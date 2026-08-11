package com.botas.yemekhane.user.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.botas.yemekhane.user.dto.ChangePasswordRequest;
import com.botas.yemekhane.user.dto.UserProfileResponse;
import com.botas.yemekhane.user.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users/me")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService) { this.userService = userService; }

    @GetMapping
    public UserProfileResponse me(Authentication authentication) {
        return UserProfileResponse.from(userService.getUserByUsername(authentication.getName()));
    }

    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request,
                                                Authentication authentication) {
        userService.changePassword(authentication.getName(), request.currentPassword(), request.newPassword());
        return ResponseEntity.noContent().build();
    }
}
