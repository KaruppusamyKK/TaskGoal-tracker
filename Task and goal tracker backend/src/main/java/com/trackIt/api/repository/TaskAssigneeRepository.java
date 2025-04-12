package com.trackIt.api.repository;

import com.trackIt.api.model.TaskAssignee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface TaskAssigneeRepository extends JpaRepository<TaskAssignee,Long> {




    Optional<List<TaskAssignee>> findByTaskId(String taskId);

    @Query("SELECT ta FROM TaskAssignee ta WHERE ta.taskId = :taskId AND ta.assignee IN :assignee")
    List<TaskAssignee> findByTaskIdAndAssignee(@Param("taskId") String taskId, @Param("assignee") List<String> assignees);

    @Modifying
    @Transactional
    @Query("UPDATE TaskAssignee t SET t.assignee = NULL WHERE t.taskId = :taskId AND t.assignee IN :assignee")
    void removeAssignee(@Param("taskId") String taskId, @Param("assignee") List<String> assignees);


}
