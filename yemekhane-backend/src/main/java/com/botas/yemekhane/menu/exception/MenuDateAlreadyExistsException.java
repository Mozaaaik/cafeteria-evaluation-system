package com.botas.yemekhane.menu.exception;

import java.time.LocalDate;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Belirtilen tarih için sistemde zaten bir günlük menü kayıtlı olduğunda fırlatılan
 * özel (custom) istisna (Exception) sınıfıdır.
 * <p>
 * {@code @ResponseStatus(HttpStatus.CONFLICT)} anotasyonu sayesinde bu hata fırlatıldığında
 * Spring Boot istemciye (Mobil/Web) otomatik olarak HTTP 409 Conflict (Çakışma/Mükerrer Kayıt)
 * yanıt kodunu döndürür.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class MenuDateAlreadyExistsException extends RuntimeException {

    /**
     * Varsayılan hata mesajı ile istisna nesnesini oluşturur.
     */
    public MenuDateAlreadyExistsException() {
        super("Belirtilen tarih için zaten bir menü tanımlanmıştır.");
    }

    public MenuDateAlreadyExistsException(LocalDate menuDate) {
        super("Bu tarih için zaten bir menü tanımlanmıştır: " + menuDate);
    }

    /**
     * Belirli bir tarih detayını içeren mesaj ile istisna nesnesini oluşturur.
     *
     * @param message Özel hata mesajı
     */
    public MenuDateAlreadyExistsException(String message) {
        super(message);
    }
}
