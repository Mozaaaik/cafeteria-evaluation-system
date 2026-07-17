package com.botas.yemekhane.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/*

DTO ne demek?

DTO, Data Transfer Object demektir. Katmanlar veya uygulamalar arasında veri taşımak için kullanılır.

Buradaki akış:

React Native kayıt ekranı
        ↓
JSON gönderir
        ↓
RegisterRequest nesnesine çevrilir
        ↓
Validation kontrolleri yapılır
        ↓
Kullanıcı oluşturulur

*/

/*
 * Personelin kayıt olurken backend'e göndereceği veriler.
 *
 * Role ve active alanları özellikle bulunmaz.
 * Yeni kayıt olan herkes backend tarafından USER yapılır.
 * record constructor ve get metotları içerir
 */
public record RegisterRequest(  

    @NotBlank(message = "Ad Soyad Boş Bırakılamaz")
    @Size(min = 3, max = 100, message = "Ad Soyad en az 3, en fazla 100 karakter olmalıdır")
    String fullName,

    @NotBlank(message = "Kullanıcı Adı Boş Bırakılamaz")
    @Size(min = 3, max = 50, message = "Kullanıcı Adı en az 3, en fazla 50 karakter olmalıdır")
    @Pattern(regexp = "^[a-zA-Z0-9_.-]*$", message = "Kullanıcı Adı sadece harf, rakam, alt çizgi, nokta ve tire içerebilir")
    String username,

    @NotBlank(message = "Şifre Boş Bırakılamaz")
    @Size(min = 8, max = 50, message = "Şifre en az 8, en fazla 50 karakter olmalıdır")
    String password

    
){}
