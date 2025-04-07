package com.trackIt.api.repository;

import com.trackIt.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);


    @Query("SELECT e.name FROM User e")
    List<String> getAllEmp();
}
//
//{emp.map((employee, index) => (
//                    <li key={index}>{employee}</li>
//        ))}