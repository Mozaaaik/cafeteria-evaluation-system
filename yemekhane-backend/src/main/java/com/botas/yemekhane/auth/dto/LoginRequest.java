package com.botas.yemekhane.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(

        @NotBlank(message = "Kullanıcı adı boş bırakılamaz.")
        String username,

        @NotBlank(message = "Şifre boş bırakılamaz.")
        String password

) {
}