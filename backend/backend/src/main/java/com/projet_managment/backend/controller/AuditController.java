package com.projet_managment.backend.controller;

import com.projet_managment.backend.dto.AuditLogDto;
import com.projet_managment.backend.security.UserPrincipal;
import com.projet_managment.backend.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects/{projectId}/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    public ResponseEntity<Page<AuditLogDto>> getAuditLogs(
            @PathVariable Long projectId,
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(
                auditService.getProjectAuditLogs(projectId, pageable)
                        .map(AuditLogDto::from));
    }
}
