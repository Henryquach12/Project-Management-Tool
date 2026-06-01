package com.projet_managment.backend.dto;

import com.projet_managment.backend.model.ProjectRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProjectMemberRequest {
    @NotNull
    private Long userId;

    @NotNull
    private ProjectRole role;

    private Long reportsToUserId;
}
