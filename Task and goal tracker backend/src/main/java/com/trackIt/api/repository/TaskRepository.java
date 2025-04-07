package com.trackIt.api.repository;

import com.trackIt.api.dto.UserTaskDto;
import com.trackIt.api.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task,Long> {
//    @Modifying
//    @Transactional
//    @Query("UPDATE Task t SET t.status = :status WHERE t.taskId = :taskId")
//    void updateStatusByTaskId(@Param("status") String status, @Param("taskId") String taskId);


    Optional<Task> findByTaskId(String taskId);

    @Modifying
    @Transactional
    void deleteByTaskId(String taskId);

    Optional<Task> findByTaskName(String taskId);

    Optional<List<UserTaskDto>> findByAssignee(String assignee);



    @Query("SELECT t FROM Task t where t.taskId = :taskId")
    List<Task> findByTaskNo(@Param("taskId") String taskId);





    @Query("SELECT n.taskId, n.taskName, n.timestamp, n.description, n.priority, n.assigner, n.status, n.assignee " +
            "FROM Task n")
    List<Object[]> findTaskNotificationDetailss();



}
