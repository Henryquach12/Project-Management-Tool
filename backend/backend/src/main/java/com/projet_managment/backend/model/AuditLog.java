package com.projet_managment.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "audit_logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog extends BaseEntity {

    @Column(nullable = false)
    private String entityType;

    private Long entityId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditAction action;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "performed_by")
    private User performedBy;

    @Column(columnDefinition = "TEXT")
    private String diff;
}
