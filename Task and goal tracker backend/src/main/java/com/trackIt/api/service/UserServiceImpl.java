package com.trackIt.api.service;
import com.trackIt.api.dto.request.RegisterRequest;
import com.trackIt.api.dto.response.RegisterServiceResponse;
import com.trackIt.api.exception.DuplicatedUserInfoException;
import com.trackIt.api.model.User;
import com.trackIt.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;


    @Override
    public RegisterServiceResponse registerUser(RegisterRequest request) {
        return (RegisterServiceResponse) userRepository.findByUsername(request.username())
                .map(user -> {
                    throw new DuplicatedUserInfoException("User already exists " + request.username()); })
                .orElseGet(() -> {
                    User newUser = new User(request.username(), request.password(), request.name(), request.email());
                    userRepository.save(newUser);
                    return new RegisterServiceResponse(true, "User registered successfully!");
                });
    }

}
