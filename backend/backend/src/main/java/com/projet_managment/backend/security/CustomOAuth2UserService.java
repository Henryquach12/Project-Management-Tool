package com.projet_managment.backend.security;

import com.projet_managment.backend.model.AuthProvider;
import com.projet_managment.backend.model.User;
import com.projet_managment.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest request) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(request);
        Map<String, Object> attrs = oAuth2User.getAttributes();

        String googleId = (String) attrs.get("sub");
        String email = (String) attrs.get("email");
        String name = (String) attrs.get("name");

        User user = userRepository.findByGoogleId(googleId).orElseGet(() ->
                userRepository.findByEmail(email).map(existing -> {
                    existing.setGoogleId(googleId);
                    if (existing.getDisplayName() == null) existing.setDisplayName(name);
                    return userRepository.save(existing);
                }).orElseGet(() -> userRepository.save(User.builder()
                        .googleId(googleId)
                        .email(email)
                        .displayName(name)
                        .provider(AuthProvider.GOOGLE)
                        .build()))
        );

        return new OAuth2UserPrincipal(user, attrs);
    }
}
