package com.projet_managment.backend.controller;

import com.projet_managment.backend.dto.TaskDto;
import com.projet_managment.backend.dto.TaskRequest;
import com.projet_managment.backend.model.TaskStatus;
import com.projet_managment.backend.model.User;
import com.projet_managment.backend.security.UserPrincipal;
import com.projet_managment.backend.service.TaskService;
import com.projet_managment.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    @PostMapping("/projects/{projectId}/tasks")
    public ResponseEntity<TaskDto> create(@PathVariable Long projectId,
                                          @Valid @RequestBody TaskRequest req,
                                          @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        return ResponseEntity.ok(taskService.create(projectId, req, user));
    }

    @GetMapping("/projects/{projectId}/tasks")
    public ResponseEntity<List<TaskDto>> list(@PathVariable Long projectId,
                                              @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        return ResponseEntity.ok(taskService.getByProject(projectId, user));
    }

    @PutMapping("/projects/{projectId}/tasks/{taskId}")
    public ResponseEntity<TaskDto> update(@PathVariable Long projectId,
                                          @PathVariable Long taskId,
                                          @Valid @RequestBody TaskRequest req,
                                          @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        return ResponseEntity.ok(taskService.update(projectId, taskId, req, user));
    }

    @PatchMapping("/projects/{projectId}/tasks/{taskId}/status")
    public ResponseEntity<TaskDto> updateStatus(@PathVariable Long projectId,
                                                @PathVariable Long taskId,
                                                @RequestParam TaskStatus status,
                                                @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        return ResponseEntity.ok(taskService.updateStatus(projectId, taskId, status, user));
    }

    @DeleteMapping("/projects/{projectId}/tasks/{taskId}")
    public ResponseEntity<Void> delete(@PathVariable Long projectId,
                                       @PathVariable Long taskId,
                                       @AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        taskService.delete(projectId, taskId, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tasks/my")
    public ResponseEntity<List<TaskDto>> myTasks(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userService.getById(principal.getId());
        return ResponseEntity.ok(taskService.getMyTasks(user));
    }
}
