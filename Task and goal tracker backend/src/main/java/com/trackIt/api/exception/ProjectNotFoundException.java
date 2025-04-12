package com.trackIt.api.exception;

public class ProjectNotFoundException extends CustomServiceException {

    public ProjectNotFoundException(String message) {
        super(message);
    }
}
