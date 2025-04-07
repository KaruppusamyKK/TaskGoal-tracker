package com.trackIt.api.service;

import com.trackIt.api.dto.EmployeesDto;
import com.trackIt.api.model.User;
import com.trackIt.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmployeeService {

    private final UserRepository userRepository;


    public List<EmployeesDto> getEmployees() {
        return userRepository.findAll()
                .stream().map(users-> new EmployeesDto(users.getName(),users.getEmail()))
                .collect(Collectors.toList());
    }
}
