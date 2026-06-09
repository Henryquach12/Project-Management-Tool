package com.projet_managment.backend.service;

import com.projet_managment.backend.dto.UpdateProfileRequest;
import com.projet_managment.backend.model.User;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface UserService extends UserDetailsService {
    User getById(Long id);
    List<User> searchUsers(String query);
    User updateProfile(Long userId, UpdateProfileRequest req);
}
