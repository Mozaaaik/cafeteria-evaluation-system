package com.botas.yemekhane.user.dto;

import com.botas.yemekhane.user.domain.User;

public record UserProfileResponse(Long id, String fullName, String username, String role) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(user.getId(), user.getFullName(), user.getUsername(), user.getRole().name());
    }
}
