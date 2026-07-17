package com.botas.yemekhane.user.service;


import java.util.Locale;

import org.springframework.stereotype.Service;

import com.botas.yemekhane.user.domain.Role;
import com.botas.yemekhane.user.domain.User;
import com.botas.yemekhane.user.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Sabitler: Şifre politikası 
    private static final int MINIMUM_PASSWORD_LENGTH = 8;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /*
    * Public register işleminde oluşturulan her kullanıcı
    * zorunlu olarak USER rolüne sahip olur.
    */
    @Transactional
    public User registerUser(
        String fullName,
        String username,
        String rawPassword
    ) {
        return createUser(fullName, username, rawPassword, Role.USER);
    }

    /*
     * Yeni kullanıcı oluşturur.
     *
     * rawPassword açık şifredir.
     * Veritabanına gönderilmeden önce BCrypt ile hashlenir.
     */
    @Transactional
    public User createUser(
        String fullName,
        String username,
        String rawPassword,
        Role role
    ) {

        String normalizedFullName = normalizeFullName(fullName);
        String normalizedUsername = normalizeUsername(username);

        validatePassword(rawPassword);

        if (userRepository.existsByUsername(normalizedUsername)) {
            throw new IllegalArgumentException(
                "Bu username kullanılmaktadır: " + normalizedUsername
            );
        }

        String passwordHash = passwordEncoder.encode(rawPassword);

        Role effectiveRole = (role == null ? Role.USER : role);

        User user = User.builder()
            .fullName(normalizedFullName)
            .username(normalizedUsername)
            .passwordHash(passwordHash)
            .role(effectiveRole)
            .active(true)
            .build();


        return userRepository.save(user);
    }

    /*
     * Kullanıcı adına göre kullanıcıyı getirir.
     *
     * Veri değiştirmediği için readOnly transaction kullanılır.
     */
    @Transactional(readOnly = true) // bir hata çıkarsa içbiri çalışmaz transactiomal o anlama gelir
    public User getUserByUsername(String username) {
        
        String normalizedUsername = normalizeUsername(username);

        return userRepository
            .findByUsername(normalizedUsername)
            .orElseThrow(() -> new IllegalArgumentException(
                "Kullanıcı bulunamadı: " + normalizedUsername
            ));
    }

    /*
     * Kullanıcı adının veritabanında
     * bulunup bulunmadığını kontrol eder.
     */
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username){

        String normalizedUsername = normalizeUsername(username);
        return userRepository.existsByUsername(normalizedUsername);
    }

    
    private String normalizeFullName(String fullName) {
        if (fullName == null || fullName.isBlank()) {
            throw new IllegalArgumentException(
                "Ad Soyad Boş Bırakılamaz"
            );
        }
        return fullName.trim();
    }
    
    private String normalizeUsername(String username) {
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException(
                "Kullanıcı Adı Boş Bırakılamaz"
            );
        }
        // Locale.ROOT: İşletim sisteminin yerel ayarlarından (örneğin Türkçe'deki I/ı, İ/i harf dönüşüm farklarından)
        // etkilenmeden, her sistemde tutarlı ve standart (İngilizce/ASCII tabanlı) küçük harfe dönüştürme yapılmasını sağlar.
        return username.trim().toLowerCase(Locale.ROOT);
    }
    
    private void validatePassword(String rawPassword) {

        if (rawPassword == null || rawPassword.isBlank()) {
            throw new IllegalArgumentException(
                "Şifre boş bırakılamaz"
            );
        }

        if (rawPassword.length() < MINIMUM_PASSWORD_LENGTH) {
            throw new IllegalArgumentException(
                "Şifre en az " + MINIMUM_PASSWORD_LENGTH + " karakter uzunluğunda olmalıdır"
            );
        }
    }
}
