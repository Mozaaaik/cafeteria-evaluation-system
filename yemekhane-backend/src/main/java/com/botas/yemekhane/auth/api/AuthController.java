package com.botas.yemekhane.auth.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.botas.yemekhane.auth.dto.LoginRequest;
import com.botas.yemekhane.auth.dto.LoginResponse;
import com.botas.yemekhane.auth.dto.RegisterRequest;
import com.botas.yemekhane.auth.dto.RegisterResponse;
import com.botas.yemekhane.auth.service.AuthService;

import jakarta.validation.Valid;

/*
 * Register ve login HTTP endpoint'lerini sağlar.
 *
 * Controller:
 * - HTTP isteğini alır.
 * - Request doğrulamasını başlatır.
 * - AuthService'i çağırır.
 * - HTTP cevabını döndürür.
 *
 * İş kuralları controller içerisinde yazılmaz
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /*
    * Bu anotasyon, register metodunun
    * POST /api/auth/register isteğini karşılamasını sağlar.
    */

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {  

                RegisterResponse registerResponse = authService.register(request);
                return ResponseEntity.status(HttpStatus.CREATED).body(registerResponse);

    }

    /*
    * POST /api/auth/login
    *
    * Kullanıcı adı ve şifreyi doğrular.
    * Başarılıysa JWT ve kullanıcı bilgilerini döndürür.
    */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        LoginResponse response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }

/*
 
 @Valid @RequestBody RegisterRequest request) 

 * HTTP isteğinin JSON gövdesini okuyup
 * RegisterRequest nesnesine dönüştürür.
 */

// React Native
//      ↓
// POST /api/auth/register
//      ↓
// AuthController.register()
//      ↓
// AuthService.register()
//      ↓
// Kullanıcı veritabanına kaydedilir
//      ↓
// 201 Created + RegisterResponse

// DTO kurallarını tetikler: 

// RegisterRequest
//  sınıfı içindeki alanlara yazılmış olan şu kuralları kontrol eder:

// fullName: En az 3, en fazla 100 karakter olmalı
// username: En az 3, en fazla 50 karakter olmalı ve sadece harf, rakam, alt çizgi, nokta, tire içerebilir
// password: En az 8, en fazla 50 karakter olmalı

}