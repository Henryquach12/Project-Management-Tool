package com.projet_managment.backend.service.impl;

import com.projet_managment.backend.model.AuditAction;
import com.projet_managment.backend.model.AuditLog;
import com.projet_managment.backend.model.User;
import com.projet_managment.backend.repository.AuditLogRepository;
import com.projet_managment.backend.repository.UserRepository;
import com.projet_managment.backend.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(String entityType, Long entityId, AuditAction action, Long performedByUserId) {
        User performer = performedByUserId != null
                ? userRepository.findById(performedByUserId).orElse(null)
                : null;
        AuditLog entry = AuditLog.builder()
                .entityType(entityType)
                .entityId(entityId)
                .action(action)
                .performedBy(performer)
                .build();
        auditLogRepository.save(entry);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AuditLog> getProjectAuditLogs(Long projectId, Pageable pageable) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(
                "Project", projectId, pageable);
    }
}
