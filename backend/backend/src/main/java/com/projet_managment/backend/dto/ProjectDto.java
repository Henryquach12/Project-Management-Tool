package com.projet_managment.backend.dto;

import com.projet_managment.backend.model.Project;
import com.projet_managment.backend.model.ProjectMember;
import com.projet_managment.backend.model.ProjectRole;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class ProjectDto {
    private Long id;
    private String name;
    private String description;
    private UserDto owner;
    private List<MemberDto> members;
    private int taskCount;
    private LocalDateTime createdAt;

    @Data
    public static class MemberDto {
        private Long userId;
        private String username;
        private String displayName;
        private String email;
        private ProjectRole role;
        private Long reportsToUserId;
        private String reportsToName;
    }

    public static ProjectDto from(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setOwner(UserDto.from(project.getOwner()));
        dto.setTaskCount(project.getTasks().size());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setMembers(project.getMembers().stream().map(m -> {
            MemberDto md = new MemberDto();
            md.setUserId(m.getUser().getId());
            md.setUsername(m.getUser().getUsername());
            md.setDisplayName(m.getUser().getDisplayName() != null ? m.getUser().getDisplayName() : m.getUser().getUsername());
            md.setEmail(m.getUser().getEmail());
            md.setRole(m.getRole());
            if (m.getReportsTo() != null) {
                md.setReportsToUserId(m.getReportsTo().getId());
                md.setReportsToName(m.getReportsTo().getDisplayName() != null ? m.getReportsTo().getDisplayName() : m.getReportsTo().getUsername());
            }
            return md;
        }).collect(Collectors.toList()));
        return dto;
    }
}
