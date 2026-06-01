package com.projet_managment.backend.dto;

import com.projet_managment.backend.model.Task;
import com.projet_managment.backend.model.TaskStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDate dueDate;
    private Long projectId;
    private String projectName;
    private UserDto createdBy;
    private List<UserDto> assignees;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TaskDto from(Task task) {
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setDueDate(task.getDueDate());
        dto.setProjectId(task.getProject().getId());
        dto.setProjectName(task.getProject().getName());
        dto.setCreatedBy(UserDto.from(task.getCreatedBy()));
        dto.setAssignees(task.getAssignees().stream().map(UserDto::from).collect(Collectors.toList()));
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }
}
