package com.projet_managment.backend.service.impl;

import com.projet_managment.backend.model.User;
import com.projet_managment.backend.repository.UserRepository;
import com.projet_managment.backend.security.UserPrincipal;
import com.projet_managment.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        User user;
        try {
            user = userRepository.findById(Long.parseLong(identifier))
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + identifier));
        } catch (NumberFormatException e) {
            user = userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + identifier));
        }
        return new UserPrincipal(user);
    }

    @Override
    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + id));
    }

    @Override
    public List<User> searchUsers(String query) {
        return userRepository.findByEmailContainingIgnoreCaseOrUsernameContainingIgnoreCase(query, query);
    }
}
