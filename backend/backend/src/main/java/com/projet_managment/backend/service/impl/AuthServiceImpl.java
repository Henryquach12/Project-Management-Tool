package com.projet_managment.backend.service.impl;

import com.projet_managment.backend.dto.AuthResponse;
import com.projet_managment.backend.dto.LoginRequest;
import com.projet_managment.backend.dto.RegisterRequest;
import com.projet_managment.backend.dto.UserDto;
import com.projet_managment.backend.model.AuthProvider;
import com.projet_managment.backend.model.User;
import com.projet_managment.backend.repository.UserRepository;
import com.projet_managment.backend.security.JwtTokenProvider;
import com.projet_managment.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new IllegalArgumentException("Email already in use");
        if (userRepository.existsByUsername(req.getUsername()))
            throw new IllegalArgumentException("Username already taken");

        User user = User.builder()
                .username(req.getUsername())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .displayName(req.getDisplayName() != null ? req.getDisplayName() : req.getUsername())
                .provider(AuthProvider.LOCAL)
                .build();
        userRepository.save(user);
        String token = tokenProvider.generateToken(user.getId());
        return new AuthResponse(token, UserDto.from(user));
    }

    @Override
    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String token = tokenProvider.generateToken(user.getId());
        return new AuthResponse(token, UserDto.from(user));
    }
}
