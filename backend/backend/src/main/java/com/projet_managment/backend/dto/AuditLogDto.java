package com.projet_managment.backend.dto;

import com.projet_managment.backend.model.AuditAction;
import com.projet_managment.backend.model.AuditLog;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AuditLogDto {
    private Long id;
    private String entityType;
    private Long entityId;
    private AuditAction action;
    private Long performedById;
    private String performedByName;
    private LocalDateTime createdAt;

    public static AuditLogDto from(AuditLog log) {
        AuditLogDto dto = new AuditLogDto();
        dto.setId(log.getId());
        dto.setEntityType(log.getEntityType());
        dto.setEntityId(log.getEntityId());
        dto.setAction(log.getAction());
        dto.setCreatedAt(log.getCreatedAt());
        if (log.getPerformedBy() != null) {
            dto.setPerformedById(log.getPerformedBy().getId());
            dto.setPerformedByName(log.getPerformedBy().getDisplayName() != null
                    ? log.getPerformedBy().getDisplayName()
                    : log.getPerformedBy().getUsername());
        }
        return dto;
    }
}
