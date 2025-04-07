package com.trackIt.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFoundException extends CustomServiceException {

    public UserNotFoundException(String message) {
        super(message);
    }
}
