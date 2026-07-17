package com.botas.yemekhane.auth.service;

import org.springframework.stereotype.Service;

import com.botas.yemekhane.auth.dto.RegisterRequest;
import com.botas.yemekhane.auth.dto.RegisterResponse;
import com.botas.yemekhane.user.domain.User;
import com.botas.yemekhane.user.service.UserService;

@Service
public class AuthService {

    private UserService userService;

    public AuthService(UserService userService) {
        this.userService = userService;
    }

    public RegisterResponse register(RegisterRequest registerRequest) {

        User createdUser = userService.registerUser(
            registerRequest.fullName(),
            registerRequest.username(),
            registerRequest.password()
        );

        return RegisterResponse.fromUser(createdUser);

    }
}

