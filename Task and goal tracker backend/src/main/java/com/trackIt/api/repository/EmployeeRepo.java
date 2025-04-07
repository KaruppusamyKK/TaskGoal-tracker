package com.trackIt.api.repository;

import com.trackIt.api.model.Employees;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface EmployeeRepo extends JpaRepository<Employees,Long> {

    @Query("SELECT p.mentorName FROM Employees p where p.employeeName =:loggedUser")
    String findteamLead(@Param("loggedUser") String loggedUser);



}
