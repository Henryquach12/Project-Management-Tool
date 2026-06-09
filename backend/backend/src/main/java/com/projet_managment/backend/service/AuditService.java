package com.projet_managment.backend.service;

import com.projet_managment.backend.model.AuditAction;
import com.projet_managment.backend.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditService {
    void log(String entityType, Long entityId, AuditAction action, Long performedByUserId);
    Page<AuditLog> getProjectAuditLogs(Long projectId, Pageable pageable);
}
