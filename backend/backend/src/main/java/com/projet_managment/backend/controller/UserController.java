package com.projet_managment.backend.controller;

import com.projet_managment.backend.dto.UpdateProfileRequest;
import com.projet_managment.backend.dto.UserDto;
import com.projet_managment.backend.model.User;
import com.projet_managment.backend.security.UserPrincipal;
import com.projet_managment.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        return ResponseEntity.ok(UserDto.from(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> updateProfile(
            @RequestBody UpdateProfileRequest req,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.updateProfile(principal.getId(), req);
        return ResponseEntity.ok(UserDto.from(user));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> search(@RequestParam String q) {
        List<UserDto> results = userService.searchUsers(q).stream()
                .map(UserDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }
}
