/*
 * --------------------------------------------------
 * PASSWORD ENCODER CONFIG
 *
 * Bu sınıf, uygulamada kullanılacak parola hashleme
 * bileşenini Spring Bean olarak tanımlar.
 *
 * BCrypt:
 * - Açık şifreyi tek yönlü olarak hashler.
 * - Aynı şifre için farklı hash değerleri üretebilir.
 * - Giriş sırasında encode değil matches kullanılır.
 * --------------------------------------------------
 */



package com.botas.yemekhane.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration // Bu sınıf uygulamanın ayar sınıflarından biridir. İçindeki @Bean metotlarını bul ve çalıştır.
public class PasswordEncoderConfig {

    @Bean // Bu metot, PasswordEncoder tipinde bir nesne oluşturup Spring Container'a ekler.
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // BCryptPasswordEncoder: Parola hashlemek için kullanılan algoritmadır.
    }   
}
