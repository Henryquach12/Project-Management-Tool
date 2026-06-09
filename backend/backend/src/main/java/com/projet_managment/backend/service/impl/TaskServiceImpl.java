package com.projet_managment.backend.service.impl;

import com.projet_managment.backend.dto.TaskDto;
import com.projet_managment.backend.dto.TaskRequest;
import com.projet_managment.backend.model.*;
import com.projet_managment.backend.repository.ProjectMemberRepository;
import com.projet_managment.backend.repository.ProjectRepository;
import com.projet_managment.backend.repository.TaskRepository;
import com.projet_managment.backend.repository.UserRepository;
import com.projet_managment.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository memberRepository;
    private final UserRepository userRepository;

    @Override
    public TaskDto create(Long projectId, TaskRequest req, User creator) {
        Project project = findProjectOrThrow(projectId);
        assertMember(project, creator);

        Task task = Task.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .status(req.getStatus() != null ? req.getStatus() : TaskStatus.TODO)
                .dueDate(req.getDueDate())
                .project(project)
                .createdBy(creator)
                .build();

        if (req.getAssigneeIds() != null) {
            task.setAssignees(userRepository.findAllById(req.getAssigneeIds()));
        }

        return TaskDto.from(taskRepository.save(task));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getByProject(Long projectId, User user) {
        Project project = findProjectOrThrow(projectId);
        assertMember(project, user);
        return taskRepository.findByProject(project).stream()
                .map(TaskDto::from).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskDto> getMyTasks(User user) {
        return taskRepository.findActiveByAssignee(user).stream()
                .map(TaskDto::from).collect(Collectors.toList());
    }

    @Override
    public TaskDto update(Long projectId, Long taskId, TaskRequest req, User user) {
        Project project = findProjectOrThrow(projectId);
        assertMember(project, user);
        Task task = findTaskOrThrow(taskId);

        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        if (req.getDueDate() != null) task.setDueDate(req.getDueDate());
        if (req.getStatus() != null) task.setStatus(req.getStatus());
        if (req.getAssigneeIds() != null) {
            task.setAssignees(userRepository.findAllById(req.getAssigneeIds()));
        }

        return TaskDto.from(taskRepository.save(task));
    }

    @Override
    public TaskDto updateStatus(Long projectId, Long taskId, TaskStatus status, User user) {
        Project project = findProjectOrThrow(projectId);
        assertMember(project, user);
        Task task = findTaskOrThrow(taskId);
        task.setStatus(status);
        return TaskDto.from(taskRepository.save(task));
    }

    @Override
    public void delete(Long projectId, Long taskId, User user) {
        Project project = findProjectOrThrow(projectId);
        assertMember(project, user);
        taskRepository.delete(findTaskOrThrow(taskId));
    }

    private Project findProjectOrThrow(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
    }

    private Task findTaskOrThrow(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
    }

    private void assertMember(Project project, User user) {
        boolean ok = project.getOwner().getId().equals(user.getId()) ||
                memberRepository.existsByProjectAndUser(project, user);
        if (!ok) throw new AccessDeniedException("Not a project member");
    }
}
