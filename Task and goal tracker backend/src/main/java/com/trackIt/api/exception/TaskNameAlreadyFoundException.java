package com.trackIt.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class TaskNameAlreadyFoundException extends CustomServiceException {

    public TaskNameAlreadyFoundException(String message) {
        super(message);
    }
}
