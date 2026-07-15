package com.botas.yemekhane.user.repository;

import java.util.Optional;

import com.botas.yemekhane.user.domain.User;

/*
 * Bu interface, kullanıcı verileri için gerekli repository
 * işlemlerinin sözleşmesini tanımlar.
 *
 * Burada MySQL kodu bulunmaz.
 * Yalnızca kullanıcı modülünün veritabanından hangi
 * işlemleri beklediği belirtilir.
 *
 * İlk admin oluşturma aşamasında:
 * - Kullanıcı kaydetme
 * - Kullanıcı adına göre bulma
 * - Kullanıcı adının varlığını kontrol etme
 *
 * işlemlerine ihtiyacımız var.
 */

public interface UserRepositoryInterface {

    User save(User user);

    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);

}
