package com.projet_managment.backend.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.projet_managment.backend.dto.LoginRequest;
import com.projet_managment.backend.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @Test
    void register_whenValidRequest_returns200WithToken() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("integuser");
        req.setEmail("integ@example.com");
        req.setPassword("password123");
        req.setDisplayName("Integ User");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("integ@example.com"));
    }

    @Test
    void register_whenEmailInvalid_returns400() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("baduser");
        req.setEmail("not-an-email");
        req.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_thenLogin_returns200WithToken() throws Exception {
        RegisterRequest reg = new RegisterRequest();
        reg.setUsername("loginuser");
        reg.setEmail("login@example.com");
        reg.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isOk());

        LoginRequest login = new LoginRequest();
        login.setEmail("login@example.com");
        login.setPassword("password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty());
    }

    @Test
    void protectedEndpoint_withoutToken_returns401Or403() throws Exception {
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().is(org.hamcrest.Matchers.either(
                        org.hamcrest.Matchers.is(401)).or(org.hamcrest.Matchers.is(403))));
    }
}
