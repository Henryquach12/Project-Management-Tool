package com.projet_managment.backend.service;

import com.projet_managment.backend.model.Task;
import com.projet_managment.backend.model.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendTaskReminder(User user, Task task, int daysUntilDue) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("Task due in " + daysUntilDue + " day" + (daysUntilDue > 1 ? "s" : "") + ": " + task.getTitle());
            message.setText(buildReminderBody(user, task, daysUntilDue));
            mailSender.send(message);
            log.info("Reminder sent to {} for task {}", user.getEmail(), task.getId());
        } catch (Exception e) {
            log.error("Failed to send reminder to {} for task {}: {}", user.getEmail(), task.getId(), e.getMessage());
        }
    }

    private String buildReminderBody(User user, Task task, int daysUntilDue) {
        String name = user.getDisplayName() != null ? user.getDisplayName() : user.getUsername();
        return String.format("""
                Hi %s,

                This is a reminder that the following task is due in %d day%s:

                Task:    %s
                Project: %s
                Due:     %s
                Status:  %s

                Please make sure to complete it on time.

                — Project Management System
                """,
                name,
                daysUntilDue,
                daysUntilDue > 1 ? "s" : "",
                task.getTitle(),
                task.getProject().getName(),
                task.getDueDate(),
                task.getStatus());
    }
}
