package com.trackIt.api.dto.request;

public record LoginRequest(
        String username,
        String password) {
}
