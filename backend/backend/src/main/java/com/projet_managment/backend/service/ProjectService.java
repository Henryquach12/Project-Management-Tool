package com.projet_managment.backend.service;

import com.projet_managment.backend.dto.ProjectDto;
import com.projet_managment.backend.dto.ProjectMemberRequest;
import com.projet_managment.backend.dto.ProjectRequest;
import com.projet_managment.backend.model.User;

import java.util.List;

public interface ProjectService {
    ProjectDto create(ProjectRequest req, User owner);
    List<ProjectDto> getAllForUser(User user);
    ProjectDto getById(Long id, User user);
    ProjectDto update(Long id, ProjectRequest req, User user);
    void delete(Long id, User user);
    ProjectDto addOrUpdateMember(Long projectId, ProjectMemberRequest req, User requester);
    void removeMember(Long projectId, Long userId, User requester);
}
