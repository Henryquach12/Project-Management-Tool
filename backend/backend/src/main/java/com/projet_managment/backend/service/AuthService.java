package com.projet_managment.backend.service;

import com.projet_managment.backend.dto.AuthResponse;
import com.projet_managment.backend.dto.LoginRequest;
import com.projet_managment.backend.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest req);
    AuthResponse login(LoginRequest req);
}
