package com.botas.yemekhane.user.repository;

import com.botas.yemekhane.user.domain.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long>{

    /*
     * Yaklaşık olarak şu sorguyu üretir:
     *
     * SELECT *
     * FROM users
     * WHERE username = ?
     */
    Optional<User> findByUsername(String username);

    /*
     * Verilen kullanıcı adının veritabanında
     * bulunup bulunmadığını kontrol eder.
     */
    boolean existsByUsername(String username);

   
}
