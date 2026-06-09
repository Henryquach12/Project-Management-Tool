package com.projet_managment.backend.unit;

import com.projet_managment.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtTokenProviderTest {

    // URL-safe base64 of "TestSecret1234567890TestSecret12" (32 bytes)
    private static final String TEST_SECRET = "VGVzdFNlY3JldDEyMzQ1Njc4OTBUZXN0U2VjcmV0MTI=";
    private static final long EXPIRATION_MS = 3_600_000L;

    private JwtTokenProvider provider;

    @BeforeEach
    void setUp() {
        provider = new JwtTokenProvider(TEST_SECRET, EXPIRATION_MS);
    }

    @Test
    void generateToken_whenValidUserId_returnsNonBlankToken() {
        String token = provider.generateToken(42L);
        assertThat(token).isNotBlank();
    }

    @Test
    void getUserIdFromToken_whenValidToken_returnsOriginalUserId() {
        Long userId = 99L;
        String token = provider.generateToken(userId);
        assertThat(provider.getUserIdFromToken(token)).isEqualTo(userId);
    }

    @Test
    void validateToken_whenValidToken_returnsTrue() {
        String token = provider.generateToken(1L);
        assertThat(provider.validateToken(token)).isTrue();
    }

    @Test
    void validateToken_whenTamperedToken_returnsFalse() {
        String token = provider.generateToken(1L) + "tampered";
        assertThat(provider.validateToken(token)).isFalse();
    }

    @Test
    void validateToken_whenBlankToken_returnsFalse() {
        assertThat(provider.validateToken("")).isFalse();
    }

    @Test
    void validateToken_whenExpiredToken_returnsFalse() {
        JwtTokenProvider shortLived = new JwtTokenProvider(TEST_SECRET, -1L);
        String token = shortLived.generateToken(1L);
        assertThat(provider.validateToken(token)).isFalse();
    }
}
