package com.trackIt.api.exception;

public class NotificationNotFoundException extends CustomServiceException {

    public NotificationNotFoundException(String message) {
        super(message);
    }
}
