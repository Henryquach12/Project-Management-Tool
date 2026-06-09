package com.projet_managment.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User extends BaseEntity {

    @Column(unique = true)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    private String passwordHash;

    private String googleId;

    private String displayName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuthProvider provider;
}
