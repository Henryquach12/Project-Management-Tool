package com.projet_managment.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProjectRequest {
    @NotBlank
    private String name;
    private String description;
}
