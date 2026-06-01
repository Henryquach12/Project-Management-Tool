package com.projet_managment.backend.repository;

import com.projet_managment.backend.model.Project;
import com.projet_managment.backend.model.ProjectMember;
import com.projet_managment.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    List<ProjectMember> findByProject(Project project);
    Optional<ProjectMember> findByProjectAndUser(Project project, User user);
    boolean existsByProjectAndUser(Project project, User user);
    void deleteByProjectAndUser(Project project, User user);
}
