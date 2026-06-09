package com.projet_managment.backend.aspect;

import com.projet_managment.backend.dto.ProjectDto;
import com.projet_managment.backend.dto.TaskDto;
import com.projet_managment.backend.model.AuditAction;
import com.projet_managment.backend.security.UserPrincipal;
import com.projet_managment.backend.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@RequiredArgsConstructor
public class AuditAspect {

    private final AuditService auditService;

    @AfterReturning(
            pointcut = "execution(* com.projet_managment.backend.service.impl.ProjectServiceImpl.create(..))" +
                    " || execution(* com.projet_managment.backend.service.impl.ProjectServiceImpl.update(..))" +
                    " || execution(* com.projet_managment.backend.service.impl.ProjectServiceImpl.addOrUpdateMember(..))",
            returning = "result")
    public void afterProjectWrite(JoinPoint jp, Object result) {
        Long entityId = result instanceof ProjectDto dto ? dto.getId() : null;
        logAction("Project", entityId, resolveAction(jp.getSignature().getName()));
    }

    @AfterReturning(
            pointcut = "execution(* com.projet_managment.backend.service.impl.ProjectServiceImpl.delete(..))" +
                    " || execution(* com.projet_managment.backend.service.impl.ProjectServiceImpl.removeMember(..))",
            returning = "result")
    public void afterProjectDelete(JoinPoint jp) {
        Object[] args = jp.getArgs();
        Long entityId = args.length > 0 && args[0] instanceof Long id ? id : null;
        logAction("Project", entityId, AuditAction.DELETE);
    }

    @AfterReturning(
            pointcut = "execution(* com.projet_managment.backend.service.impl.TaskServiceImpl.create(..))" +
                    " || execution(* com.projet_managment.backend.service.impl.TaskServiceImpl.update(..))" +
                    " || execution(* com.projet_managment.backend.service.impl.TaskServiceImpl.updateStatus(..))",
            returning = "result")
    public void afterTaskWrite(JoinPoint jp, Object result) {
        Long entityId = result instanceof TaskDto dto ? dto.getId() : null;
        logAction("Task", entityId, resolveAction(jp.getSignature().getName()));
    }

    @AfterReturning(
            pointcut = "execution(* com.projet_managment.backend.service.impl.TaskServiceImpl.delete(..))",
            returning = "result")
    public void afterTaskDelete(JoinPoint jp) {
        Object[] args = jp.getArgs();
        Long entityId = args.length > 1 && args[1] instanceof Long id ? id : null;
        logAction("Task", entityId, AuditAction.DELETE);
    }

    private void logAction(String entityType, Long entityId, AuditAction action) {
        Long userId = currentUserId();
        if (userId == null) return;
        try {
            auditService.log(entityType, entityId, action, userId);
        } catch (Exception ignored) {
            // never let audit failure break the main flow
        }
    }

    private AuditAction resolveAction(String methodName) {
        if (methodName.startsWith("create") || methodName.startsWith("add")) return AuditAction.CREATE;
        if (methodName.startsWith("delete") || methodName.startsWith("remove")) return AuditAction.DELETE;
        return AuditAction.UPDATE;
    }

    private Long currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal p) {
            return p.getId();
        }
        return null;
    }
}
