package com.botas.yemekhane.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Kullanıcı hatalı şifre girdiğinde veya sistemde bulunmayan bir kullanıcı adı ile
 * giriş yapmaya çalıştığında fırlatılan özel (custom) istisna (Exception) sınıfıdır.
 * <p>
 * {@code @ResponseStatus(HttpStatus.UNAUTHORIZED)} anotasyonu sayesinde bu exception fırlatıldığında
 * Spring Boot istemciye (Mobil/Web) otomatik olarak HTTP 401 Unauthorized (Yetkisiz/Geçersiz Kimlik)
 * yanıt kodunu döndürür.
 */
// 1. SPRING ANOTASYONU: Bu exception fırlatıldığında Spring Boot'un istemciye (Mobil/Web) HTTP 401 (Unauthorized - Yetkisiz) yanıtı dönmesini sağlar.
@ResponseStatus(HttpStatus.UNAUTHORIZED)
// 2. SINIF TANIMI: 'extends RuntimeException' yazarak bu sınıfı Java'da çalışırken fırlatılabilen (Unchecked Exception) bir Hata sınıfı haline getiriyoruz.
public class InvalidCredentialsException extends RuntimeException {

    /**
     * Sınıfın Yapıcı Metodu (Constructor).
     * 'new InvalidCredentialsException()' yazıldığında otomatik çalışır.
     */
    public InvalidCredentialsException() {
        // 3. SUPER KELİMESİ: Üst sınıf olan RuntimeException'ın constructor'ını çağırır ve varsayılan hata mesajını ona teslim eder.
        // Bu sayede e.getMessage() dendiğinde bu metin okunur.
        super("Kullanıcı adı veya şifre hatalı.");
    }
}