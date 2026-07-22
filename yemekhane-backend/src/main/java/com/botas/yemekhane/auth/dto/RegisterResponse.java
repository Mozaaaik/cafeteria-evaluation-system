package com.botas.yemekhane.auth.dto;

import java.time.Instant;

import com.botas.yemekhane.user.domain.Role;
import com.botas.yemekhane.user.domain.User;

public record RegisterResponse(
    Long id,
    String fullName,
    String username,
    Role role,
    boolean active,
    Instant createdAt
) {
    public static RegisterResponse fromUser(User user) {
        return new RegisterResponse(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getRole(),
                Boolean.TRUE.equals(user.getActive()),
                user.getCreatedAt());
    }
}
