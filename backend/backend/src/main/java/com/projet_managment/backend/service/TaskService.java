package com.projet_managment.backend.service;

import com.projet_managment.backend.dto.TaskDto;
import com.projet_managment.backend.dto.TaskRequest;
import com.projet_managment.backend.model.TaskStatus;
import com.projet_managment.backend.model.User;

import java.util.List;

public interface TaskService {
    TaskDto create(Long projectId, TaskRequest req, User creator);
    List<TaskDto> getByProject(Long projectId, User user);
    List<TaskDto> getMyTasks(User user);
    TaskDto update(Long projectId, Long taskId, TaskRequest req, User user);
    TaskDto updateStatus(Long projectId, Long taskId, TaskStatus status, User user);
    void delete(Long projectId, Long taskId, User user);
}
