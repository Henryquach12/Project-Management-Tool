package com.projet_managment.backend.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String displayName;
    private String bio;
    private String interests;
    private String usualRole;
    private String photoUrl;
}
