package com.projet_managment.backend.unit;

import com.projet_managment.backend.dto.ProjectDto;
import com.projet_managment.backend.dto.ProjectRequest;
import com.projet_managment.backend.model.*;
import com.projet_managment.backend.repository.ProjectMemberRepository;
import com.projet_managment.backend.repository.ProjectRepository;
import com.projet_managment.backend.repository.UserRepository;
import com.projet_managment.backend.service.impl.ProjectServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectServiceImplTest {

    @Mock private ProjectRepository projectRepository;
    @Mock private ProjectMemberRepository memberRepository;
    @Mock private UserRepository userRepository;

    private ProjectServiceImpl projectService;

    private User owner;
    private User stranger;

    @BeforeEach
    void setUp() {
        projectService = new ProjectServiceImpl(projectRepository, memberRepository, userRepository);

        owner = User.builder().email("owner@test.com").provider(AuthProvider.LOCAL).build();
        stranger = User.builder().email("other@test.com").provider(AuthProvider.LOCAL).build();
    }

    @Test
    void create_whenValidRequest_returnsProjectDto() {
        ProjectRequest req = new ProjectRequest();
        req.setName("My Project");
        req.setDescription("Desc");

        when(projectRepository.save(any(Project.class))).thenAnswer(inv -> inv.getArgument(0));
        when(memberRepository.save(any(ProjectMember.class))).thenAnswer(inv -> inv.getArgument(0));

        ProjectDto result = projectService.create(req, owner);

        assertThat(result.getName()).isEqualTo("My Project");
        verify(projectRepository).save(any(Project.class));
        verify(memberRepository).save(any(ProjectMember.class));
    }

    @Test
    void getAllForUser_returnsOwnedAndMemberProjects() {
        Project p1 = Project.builder().name("P1").owner(owner).build();
        Project p2 = Project.builder().name("P2").owner(owner).build();
        when(projectRepository.findAllForUser(owner)).thenReturn(List.of(p1, p2));

        List<ProjectDto> result = projectService.getAllForUser(owner);

        assertThat(result).hasSize(2);
    }

    @Test
    void delete_whenOwner_deletesProject() {
        Project project = Project.builder().name("P").owner(owner).build();
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        projectService.delete(1L, owner);

        verify(projectRepository).delete(project);
    }

    @Test
    void delete_whenNotOwner_throwsAccessDeniedException() {
        Project project = Project.builder().name("P").owner(owner).build();
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        assertThatThrownBy(() -> projectService.delete(1L, stranger))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void getById_whenNotMember_throwsAccessDeniedException() {
        Project project = Project.builder().name("P").owner(owner).build();
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(memberRepository.existsByProjectAndUser(project, stranger)).thenReturn(false);

        assertThatThrownBy(() -> projectService.getById(1L, stranger))
                .isInstanceOf(AccessDeniedException.class);
    }

    @Test
    void getById_whenProjectNotFound_throwsIllegalArgumentException() {
        when(projectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> projectService.getById(99L, owner))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Project not found");
    }
}
