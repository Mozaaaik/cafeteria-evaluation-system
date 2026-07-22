package com.botas.yemekhane.auth.dto;

import com.botas.yemekhane.user.domain.Role;
import com.botas.yemekhane.user.domain.User;

/**
 * Kimliği doğrulanmış (giriş yapmış) kullanıcının istemciye (Mobil/Web uygulamasına)
 * gönderilecek güvenli profil bilgilerini taşıyan DTO (Data Transfer Object) sınıfı.
 *
 * @param id       Kullanıcının sistemdeki benzersiz kimlik numarası (ID)
 * @param fullName Kullanıcının ad soyad bilgisi
 * @param username Kullanıcının giriş adı
 * @param role     Kullanıcının sistemdeki yetki rolü (Örn: USER, ADMIN)
 */
public record AuthenticatedUserResponse(
        Long id,
        String fullName,
        String username,
        Role role
) {

    /**
     * Veritabanı varlık (Entity) sınıfı olan 'User' nesnesinden,
     * istemciye gönderilecek olan bu 'AuthenticatedUserResponse' DTO nesnesini üreten
     * statik dönüşüm/fabrika (Factory) metodu.
     *
     * @param user Veritabanından gelen Kullanıcı nesnesi
     * @return İstemciye gönderilmeye hazır güvenli DTO nesnesi
     */
    public static AuthenticatedUserResponse from(
            User user
    ) {
        return new AuthenticatedUserResponse(
                user.getId(),
                user.getFullName(),
                user.getUsername(),
                user.getRole()
        );
    }
}