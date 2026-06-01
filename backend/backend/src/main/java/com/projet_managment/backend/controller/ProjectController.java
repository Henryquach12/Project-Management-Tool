package com.projet_managment.backend.controller;

import com.projet_managment.backend.dto.ProjectDto;
import com.projet_managment.backend.dto.ProjectMemberRequest;
import com.projet_managment.backend.dto.ProjectRequest;
import com.projet_managment.backend.model.User;
import com.projet_managment.backend.security.UserPrincipal;
import com.projet_managment.backend.service.ProjectService;
import com.projet_managment.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<ProjectDto> create(@Valid @RequestBody ProjectRequest req,
                                             @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        return ResponseEntity.ok(projectService.create(req, user));
    }

    @GetMapping
    public ResponseEntity<List<ProjectDto>> list(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        return ResponseEntity.ok(projectService.getAllForUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> get(@PathVariable Long id,
                                          @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        return ResponseEntity.ok(projectService.getById(id, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto> update(@PathVariable Long id,
                                             @Valid @RequestBody ProjectRequest req,
                                             @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        return ResponseEntity.ok(projectService.update(id, req, user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id,
                                       @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        projectService.delete(id, user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<ProjectDto> addMember(@PathVariable Long id,
                                                @Valid @RequestBody ProjectMemberRequest req,
                                                @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        return ResponseEntity.ok(projectService.addOrUpdateMember(id, req, user));
    }

    @DeleteMapping("/{id}/members/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long id,
                                             @PathVariable Long userId,
                                             @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        projectService.removeMember(id, userId, user);
        return ResponseEntity.noContent().build();
    }
}
