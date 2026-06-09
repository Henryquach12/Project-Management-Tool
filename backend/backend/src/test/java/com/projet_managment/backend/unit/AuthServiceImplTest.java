package com.projet_managment.backend.unit;

import com.projet_managment.backend.dto.AuthResponse;
import com.projet_managment.backend.dto.LoginRequest;
import com.projet_managment.backend.dto.RegisterRequest;
import com.projet_managment.backend.model.AuthProvider;
import com.projet_managment.backend.model.User;
import com.projet_managment.backend.repository.UserRepository;
import com.projet_managment.backend.security.JwtTokenProvider;
import com.projet_managment.backend.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private JwtTokenProvider tokenProvider;
    @Mock private AuthenticationManager authenticationManager;

    private PasswordEncoder passwordEncoder;
    private AuthServiceImpl authService;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder(4); // low strength for test speed
        authService = new AuthServiceImpl(userRepository, passwordEncoder, tokenProvider, authenticationManager);
    }

    @Test
    void register_whenNewUser_returnsTokenAndUser() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("alice");
        req.setEmail("alice@example.com");
        req.setPassword("password123");
        req.setDisplayName("Alice");

        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(tokenProvider.generateToken(any())).thenReturn("mock-jwt-token");

        AuthResponse response = authService.register(req);

        assertThat(response.getToken()).isEqualTo("mock-jwt-token");
        assertThat(response.getUser().getEmail()).isEqualTo("alice@example.com");
    }

    @Test
    void register_whenEmailTaken_throwsIllegalArgumentException() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("bob");
        req.setEmail("taken@example.com");
        req.setPassword("password123");

        when(userRepository.existsByEmail("taken@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email already in use");
    }

    @Test
    void register_whenUsernameTaken_throwsIllegalArgumentException() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("taken");
        req.setEmail("new@example.com");
        req.setPassword("password123");

        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(userRepository.existsByUsername("taken")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Username already taken");
    }

    @Test
    void login_whenValidCredentials_returnsToken() {
        LoginRequest req = new LoginRequest();
        req.setEmail("alice@example.com");
        req.setPassword("password123");

        User user = User.builder()
                .email("alice@example.com")
                .provider(AuthProvider.LOCAL)
                .build();

        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));
        when(tokenProvider.generateToken(any())).thenReturn("mock-jwt-token");

        AuthResponse response = authService.login(req);

        assertThat(response.getToken()).isEqualTo("mock-jwt-token");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_whenBadCredentials_throwsException() {
        LoginRequest req = new LoginRequest();
        req.setEmail("alice@example.com");
        req.setPassword("wrong");

        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager).authenticate(any());

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BadCredentialsException.class);
    }
}
