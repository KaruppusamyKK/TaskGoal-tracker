package com.trackIt.api.repository;
import com.trackIt.api.model.Chat;
import com.trackIt.api.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project,Long> {


    Optional<Project> findByProjectName(String projectId);

    Optional<Project> findByProjectId(String projectId);


    @Transactional
    @Modifying
    void deleteProjectByProjectId(String projectId);
}
