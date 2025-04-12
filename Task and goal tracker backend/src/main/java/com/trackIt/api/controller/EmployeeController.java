package com.trackIt.api.controller;
import com.trackIt.api.dto.response.ResponseHandler;
import com.trackIt.api.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping("/getEmployees")
    public ResponseEntity<?> getEmployees(){
        return ResponseHandler.handleResponse(employeeService::getEmployees);
    }


}
