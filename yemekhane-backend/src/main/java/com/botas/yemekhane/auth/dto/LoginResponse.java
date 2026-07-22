package com.botas.yemekhane.auth.dto;

/**
 * Kullanıcı başarılı bir şekilde giriş yaptığında (Login)
 * istemciye (Mobil/Web uygulamasına) döndürülecek yanıt paketini taşıyan DTO nesnesi.
 *
 * @param accessToken İstemcinin sonraki korumalı isteklerde 'Authorization' başlığında (Header) göndereceği JWT token metni
 * @param tokenType   Token'ın türü (Standart olarak "Bearer" olarak döner)
 * @param expiresIn   Token'ın geçerlilik süresi (saniye cinsinden, örn: 3600)
 * @param user        Giriş yapan kullanıcının güvenli profil bilgileri
 */
public record LoginResponse(
        String accessToken,
        String tokenType,
        long expiresIn,
        AuthenticatedUserResponse user
) {
}