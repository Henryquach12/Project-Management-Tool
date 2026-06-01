package com.projet_managment.backend.dto;

import com.projet_managment.backend.model.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class TaskRequest {
    @NotBlank
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDate dueDate;
    private List<Long> assigneeIds;
}
