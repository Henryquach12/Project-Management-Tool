package com.projet_managment.backend.repository;

import com.projet_managment.backend.model.Project;
import com.projet_managment.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOwner(User owner);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.members m WHERE m.user = :user")
    List<Project> findByMember(@Param("user") User user);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.members m WHERE p.owner = :user OR m.user = :user")
    List<Project> findAllForUser(@Param("user") User user);
}
