package com.trackIt.api.repository;

import com.trackIt.api.model.TaskResources;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskResourcesRepo extends JpaRepository<TaskResources,Long> {
//    @Query("SELECT tr.attachment FROM TaskResources tr WHERE tr.taskUniqueId = :taskId")
//    List<byte[]> getAttachmentsByTaskId(@Param("taskId") String taskId);

        List<TaskResources> findByTaskUniqueId(String taskId, Sort sort);

        @Modifying
        @Query("DELETE FROM TaskResources tr WHERE tr.imgId = :imgId")
        void deleteByImgId(String imgId);


        @Modifying
        @Query("DELETE FROM TaskResources tr WHERE tr.descriptionId = :descId")
        void deleteByDescById(String descId);



}
