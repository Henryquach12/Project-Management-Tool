package com.projet_managment.backend.service;

import com.projet_managment.backend.dto.ProjectDto;
import com.projet_managment.backend.dto.ProjectMemberRequest;
import com.projet_managment.backend.dto.ProjectRequest;
import com.projet_managment.backend.model.*;
import com.projet_managment.backend.repository.ProjectMemberRepository;
import com.projet_managment.backend.repository.ProjectRepository;
import com.projet_managment.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository memberRepository;
    private final UserRepository userRepository;

    public ProjectDto create(ProjectRequest req, User owner) {
        Project project = Project.builder()
                .name(req.getName())
                .description(req.getDescription())
                .owner(owner)
                .build();
        projectRepository.save(project);

        ProjectMember ownerMember = ProjectMember.builder()
                .project(project)
                .user(owner)
                .role(ProjectRole.OWNER)
                .build();
        memberRepository.save(ownerMember);

        return ProjectDto.from(project);
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> getAllForUser(User user) {
        return projectRepository.findAllForUser(user).stream()
                .map(ProjectDto::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectDto getById(Long id, User user) {
        Project project = findProjectOrThrow(id);
        assertMember(project, user);
        return ProjectDto.from(project);
    }

    public ProjectDto update(Long id, ProjectRequest req, User user) {
        Project project = findProjectOrThrow(id);
        assertOwner(project, user);
        project.setName(req.getName());
        project.setDescription(req.getDescription());
        return ProjectDto.from(projectRepository.save(project));
    }

    public void delete(Long id, User user) {
        Project project = findProjectOrThrow(id);
        assertOwner(project, user);
        projectRepository.delete(project);
    }

    public ProjectDto addOrUpdateMember(Long projectId, ProjectMemberRequest req, User requester) {
        Project project = findProjectOrThrow(projectId);
        assertOwnerOrLeader(project, requester);

        User targetUser = userRepository.findById(req.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        User reportsTo = null;
        if (req.getReportsToUserId() != null) {
            reportsTo = userRepository.findById(req.getReportsToUserId())
                    .orElseThrow(() -> new IllegalArgumentException("ReportsTo user not found"));
        }

        User finalReportsTo = reportsTo;
        ProjectMember member = memberRepository.findByProjectAndUser(project, targetUser)
                .map(m -> { m.setRole(req.getRole()); m.setReportsTo(finalReportsTo); return m; })
                .orElse(ProjectMember.builder()
                        .project(project)
                        .user(targetUser)
                        .role(req.getRole())
                        .reportsTo(reportsTo)
                        .build());
        memberRepository.save(member);

        return ProjectDto.from(projectRepository.findById(projectId).orElseThrow());
    }

    public void removeMember(Long projectId, Long userId, User requester) {
        Project project = findProjectOrThrow(projectId);
        assertOwnerOrLeader(project, requester);
        User target = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        memberRepository.deleteByProjectAndUser(project, target);
    }

    private Project findProjectOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
    }

    private void assertMember(Project project, User user) {
        boolean isMember = project.getOwner().getId().equals(user.getId()) ||
                memberRepository.existsByProjectAndUser(project, user);
        if (!isMember) throw new AccessDeniedException("Not a project member");
    }

    private void assertOwner(Project project, User user) {
        if (!project.getOwner().getId().equals(user.getId()))
            throw new AccessDeniedException("Only the project owner can perform this action");
    }

    private void assertOwnerOrLeader(Project project, User user) {
        if (project.getOwner().getId().equals(user.getId())) return;
        memberRepository.findByProjectAndUser(project, user)
                .filter(m -> m.getRole() == ProjectRole.LEADER || m.getRole() == ProjectRole.OWNER)
                .orElseThrow(() -> new AccessDeniedException("Only owners or leaders can manage members"));
    }
}
