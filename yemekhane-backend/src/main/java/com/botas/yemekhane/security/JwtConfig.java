package com.botas.yemekhane.security;

import java.util.Base64;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

/*
 * --------------------------------------------------
 * JWT CONFIG
 *
 * JWT üretimi ve doğrulaması için gerekli bileşenleri
 * Spring IoC Container'a Bean olarak ekler.
 *
 * Aynı secret:
 * - Token oluşturulurken imza atmak,
 * - Token geldiğinde imzayı doğrulamak
 *
 * amacıyla kullanılır.
 * --------------------------------------------------
 * 1. .env içindeki secret metnini gerçek şifreleme anahtarına çevireceğiz.
 * 2. Bu anahtarla JWT üreten JwtEncoder oluşturacağız.
 * 3. Gelen JWT’yi doğrulayan JwtDecoder oluşturacağız.
 * 4. Token içindeki rolleri Spring Security yetkilerine çevireceğiz.
 */
@Configuration
public class JwtConfig {

    @Value("${app.jwt.secret}") private String base64secret;

     /*
     * .env içindeki Base64 secret değerini
     * HMAC-SHA256 anahtarına dönüştürür.
     */
    @Bean
    public SecretKey secretKey() {

        byte[] keyBytes; // Bu byte’lar JWT imzalamak için kullanılacak bir kriptografi anahtarıdır.

        try {

            keyBytes = Base64.getDecoder().decode(base64secret);

        } catch (Exception e) {

            throw new IllegalStateException("JWT_SECRET geçerli bir Base64 değeri değil.", e);
        }

        if (keyBytes.length < 32) {

            throw new IllegalStateException("JWT_SECRET en az 32 byte olmalıdır.");

        }

        return new SecretKeySpec(keyBytes, "HmacSHA256"); // Şifreleme imzalama algoritması 
    }

    /*
     * 2. Gizli Anahtar (SecretKey) kullanarak
     * JWT token'larını üretecek olan nesnedir.
     * Tokeni imzalar.
     */
    @Bean
    public JwtEncoder jwtEncoder(
        SecretKey jwtSecretKey
    ) {
        return NimbusJwtEncoder
            .withSecretKey(jwtSecretKey)      // 1. Gizli Anahtarı Verir
            .algorithm(MacAlgorithm.HS256)  // 2. İmza Algoritmasını Seçer
            .build();                        // 3. Encoder Nesnesini Oluşturur
    }

    /*
     * Mobil uygulamadan gelen JWT'nin:
     * - İmzasını,
     * - Süresini,
     * - Issuer bilgisini
     *
     * doğrular.
     */
    @Bean
    public JwtDecoder jwtDecoder(
            SecretKey jwtSecretKey,
            @Value("${app.jwt.issuer}") String issuer // JWT'nin kim tarafından üretilip imzalandığını gösteren kimlik bilgisi
    ) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder 
                .withSecretKey(jwtSecretKey) // Token'ı doğrulamak için gerekli olan gizli anahtar
                .macAlgorithm(MacAlgorithm.HS256) // Kullanılacak şifreleme algoritması
                .build();

        decoder.setJwtValidator( // imza doğruysa buraya gelinir
                JwtValidators.createDefaultWithIssuer(issuer) // JWT'nin geçerliliğini kontrol eder
        );

        return decoder;
    }

    /*
     * JWT içindeki "roles" claim'ini Spring Security
     * yetkilerine dönüştürür.
     *
     * Örneğin:
     *
     * roles: ["ROLE_ADMIN"]
     *
     * değeri hasRole("ADMIN") kontrolünde kullanılabilir.
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {

        JwtGrantedAuthoritiesConverter authoritiesConverter = // Yetki Okuyucuyu Hazırlama
                new JwtGrantedAuthoritiesConverter();

        authoritiesConverter.setAuthoritiesClaimName("roles"); // JWT içindeki "roles" claim'ini okur

        /*
         * Spring varsayılan olarak okuduğu rollerin başına "SCOPE_" veya "ROLE_" ekler.
         * Token içinde ROLE_ ön eki zaten bulunduğu için
         * Spring'in tekrar ön ek eklemesini engelliyoruz.
         */
        authoritiesConverter.setAuthorityPrefix(""); // Spring'in otomatik eklediği ön eki kaldırır

        JwtAuthenticationConverter authenticationConverter = // Ana Dönüştürücüyü Hazırlama
                new JwtAuthenticationConverter();

        // Hazırladığımız bu özel dönüştürücüyü Spring Security'nin ana dönüştürücüsüne (JwtAuthenticationConverter)
        authenticationConverter.setJwtGrantedAuthoritiesConverter(
                authoritiesConverter
        );

        return authenticationConverter;
    }

}
