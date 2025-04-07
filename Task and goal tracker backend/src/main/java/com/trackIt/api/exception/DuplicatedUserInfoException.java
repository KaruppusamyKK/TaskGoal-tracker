package com.trackIt.api.exception;

public class DuplicatedUserInfoException extends CustomServiceException {

    public DuplicatedUserInfoException(String message) {
        super(message);
    }
}
