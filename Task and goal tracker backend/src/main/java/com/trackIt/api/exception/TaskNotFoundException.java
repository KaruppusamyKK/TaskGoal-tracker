package com.trackIt.api.exception;

public class TaskNotFoundException extends CustomServiceException {

    public TaskNotFoundException(String message) {
        super(message);
    }
}
