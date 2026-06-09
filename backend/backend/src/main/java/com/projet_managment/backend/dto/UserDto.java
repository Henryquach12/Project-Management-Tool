package com.projet_managment.backend.dto;

import com.projet_managment.backend.model.User;
import lombok.Data;

@Data
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String displayName;
    private String bio;
    private String interests;
    private String usualRole;
    private String photoUrl;

    public static UserDto from(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setDisplayName(user.getDisplayName() != null ? user.getDisplayName() : user.getUsername());
        dto.setBio(user.getBio());
        dto.setInterests(user.getInterests());
        dto.setUsualRole(user.getUsualRole());
        dto.setPhotoUrl(user.getPhotoUrl());
        return dto;
    }
}
