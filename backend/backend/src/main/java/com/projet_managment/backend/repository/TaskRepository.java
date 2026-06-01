package com.projet_managment.backend.repository;

import com.projet_managment.backend.model.Project;
import com.projet_managment.backend.model.Task;
import com.projet_managment.backend.model.TaskStatus;
import com.projet_managment.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProject(Project project);
    List<Task> findByProjectAndStatus(Project project, TaskStatus status);

    @Query("SELECT t FROM Task t JOIN t.assignees a WHERE a = :user")
    List<Task> findByAssignee(@Param("user") User user);

    @Query("SELECT t FROM Task t JOIN t.assignees a WHERE a = :user AND t.status != 'DONE'")
    List<Task> findActiveByAssignee(@Param("user") User user);

    @Query("SELECT t FROM Task t WHERE t.dueDate = :date AND t.reminder2DaysSent = false AND t.status != 'DONE'")
    List<Task> findTasksDueOnDateWith2DayReminderPending(@Param("date") LocalDate date);

    @Query("SELECT t FROM Task t WHERE t.dueDate = :date AND t.reminder1DaySent = false AND t.status != 'DONE'")
    List<Task> findTasksDueOnDateWith1DayReminderPending(@Param("date") LocalDate date);
}
