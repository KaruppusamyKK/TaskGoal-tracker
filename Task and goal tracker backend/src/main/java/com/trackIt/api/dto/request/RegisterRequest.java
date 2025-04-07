package com.trackIt.api.dto.request;
public record RegisterRequest(
        String username,
        String password,
        String name,
        String email) {}
