package com.projet_managment.backend.scheduler;

import com.projet_managment.backend.model.Task;
import com.projet_managment.backend.repository.TaskRepository;
import com.projet_managment.backend.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private final TaskRepository taskRepository;
    private final EmailService emailService;

    @Scheduled(cron = "0 0 8 * * *")
    @Transactional
    public void sendReminders() {
        LocalDate today = LocalDate.now();

        List<Task> twoDayTasks = taskRepository.findTasksDueOnDateWith2DayReminderPending(today.plusDays(2));
        for (Task task : twoDayTasks) {
            task.getAssignees().forEach(user -> emailService.sendTaskReminder(user, task, 2));
            task.setReminder2DaysSent(true);
            taskRepository.save(task);
        }
        log.info("Sent 2-day reminders for {} tasks", twoDayTasks.size());

        List<Task> oneDayTasks = taskRepository.findTasksDueOnDateWith1DayReminderPending(today.plusDays(1));
        for (Task task : oneDayTasks) {
            task.getAssignees().forEach(user -> emailService.sendTaskReminder(user, task, 1));
            task.setReminder1DaySent(true);
            taskRepository.save(task);
        }
        log.info("Sent 1-day reminders for {} tasks", oneDayTasks.size());
    }
}
