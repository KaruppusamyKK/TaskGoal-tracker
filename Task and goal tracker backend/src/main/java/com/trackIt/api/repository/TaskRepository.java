package com.trackIt.api.repository;

import com.trackIt.api.dto.UserTaskDto;
import com.trackIt.api.dto.response.TaskResponse;
import com.trackIt.api.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task,Long> {



    Optional<Task> findByTaskId(String taskId);

    @Modifying
    @Transactional
    void deleteByTaskId(String taskId);

    Optional<Task> findByTaskName(String taskId);

    @Query(value = "SELECT t.task_id, t.description, t.task_name, t.priority, " +
            "t.assigner, t.status, t.start_date, t.due_date, " +
            "t.time_tracked, t.time_estimate, " +
            "GROUP_CONCAT(a.assignee SEPARATOR ', ') AS assignee, " +
            "p.project_name " +
            "FROM task t " +
            "LEFT JOIN task_assignee a ON t.id = a.task_ref " +
            "LEFT JOIN project p ON t.project_ref = p.id " +
            "GROUP BY t.task_id, t.description, t.task_name, t.priority, " +
            "t.assigner, t.status, t.start_date, t.due_date, " +
            "t.time_tracked, t.time_estimate, p.project_name",
            nativeQuery = true)
    List<Object[]> findTaskWithAssignees();













    @Query(value = "SELECT t.task_id, t.description, t.task_name, t.priority, " +
            "GROUP_CONCAT(a.assignee) AS assignee, " +
            "t.assigner, t.status, t.time_estimate, t.time_tracked, " +
            "t.due_date, t.start_date " +
            "FROM task_assignee a " +
            "JOIN task t ON t.id = a.task_ref " +
            "WHERE a.assignee = :assignee " +
            "GROUP BY t.task_id, t.description, t.task_name, t.priority, " +
            "t.assigner, t.status, t.time_estimate, t.time_tracked, " +
            "t.due_date, t.start_date",
            nativeQuery = true)
    List<Object[]> findTasksByAssignee(@Param("assignee") String assignee);






}
