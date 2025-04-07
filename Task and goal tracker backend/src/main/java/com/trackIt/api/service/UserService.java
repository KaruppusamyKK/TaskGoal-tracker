package com.trackIt.api.service;
import com.trackIt.api.dto.request.RegisterRequest;
import com.trackIt.api.dto.response.RegisterServiceResponse;

public interface UserService {

    RegisterServiceResponse registerUser(RegisterRequest request);
}
