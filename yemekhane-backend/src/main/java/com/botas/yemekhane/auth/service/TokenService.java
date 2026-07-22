package com.botas.yemekhane.auth.service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import com.botas.yemekhane.user.domain.User;

/*
 * ==============================================================================
 * TOKEN SERVICE (JWT JETON ÜRETİM SERVİSİ)
 * ==============================================================================
 *
 * Bu servis, sistemde kimliğini başarıyla doğrulamış (Login olmuş) bir kullanıcı
 * için güvenli, imzalı bir JWT (JSON Web Token) Access Token üretmekten sorumludur.
 *
 * 🔒 Güvenlik Notu:
 * Token içeriğinde kullanıcının kimlik bilgileri (ID, kullanıcı adı, rol) yer alır.
 * Kesinlikle açık şifre (plain password) veya şifre özeti (passwordHash) konulmaz.
 * ==============================================================================
 */
@Service
public class TokenService {

    // JWT'yi imzalayıp karakter dizisine (string) dönüştüren Spring Security encoder nesnesi
    private final JwtEncoder jwtEncoder;

    // Token'ı hangi uygulamanın bastığını gösteren bilgi (Örn: "yemekhane-backend")
    private final String issuer;

    // Token'ın kaç saniye geçerli olacağını belirten süre nesnesi
    private final Duration tokenDuration;

    /**
     * TokenService Bağımlılık Enjeksiyonu (Constructor Injection)
     *
     * @param jwtEncoder        JwtConfig sınıfında tanımlanan imzalayıcı Bean nesnesi
     * @param issuer            application.properties / .env dosyasındaki 'app.jwt.issuer' değeri
     * @param expirationSeconds application.properties / .env dosyasındaki 'app.jwt.expiration-seconds' değeri
     */
    public TokenService(
            JwtEncoder jwtEncoder,

            @Value("${app.jwt.issuer}")
            String issuer,

            @Value("${app.jwt.expiration-seconds}")
            long expirationSeconds
    ) {
        this.jwtEncoder = jwtEncoder;
        this.issuer = issuer;
        // Saniye cinsinden gelen süreyi Duration nesnesine çeviriyoruz
        this.tokenDuration = Duration.ofSeconds(expirationSeconds);
    }

    /**
     * Verilen kullanıcı nesnesi (User) için imzalı bir JWT token üretir.
     *
     * @param user Kimliği doğrulanmış kullanıcı nesnesi
     * @return Üretilen token metnini ve kalan geçerlilik süresini içeren GeneratedToken nesnesi
     */
    public GeneratedToken generate(User user) {

        // ----------------------------------------------------------------------
        // 1. ADIM: ZAMAN BİLGİLERİNİN HESAPLANMASI
        // ----------------------------------------------------------------------
        Instant issuedAt = Instant.now();                    // Token'ın oluşturulduğu an (Şu an)
        Instant expiresAt = issuedAt.plus(tokenDuration);   // Token'ın son kullanma tarihi (Şu an + Geçerlilik Süresi)

        // ----------------------------------------------------------------------
        // 2. ADIM: YETKİ / ROL LİSTESİNİN HAZIRLANMASI
        // ----------------------------------------------------------------------
        // Spring Security, yetkilendirme kontrollerinde (hasRole) rollerin 
        // başında "ROLE_" ön eki bulunmasını bekler. (Örn: "ROLE_ADMIN", "ROLE_USER")
        List<String> authorities = List.of(
                "ROLE_" + user.getRole().name()
        );

        // ----------------------------------------------------------------------
        // 3. ADIM: JWT PAYLOAD (GÖVDE / CLAIMS) İÇERİĞİNİN OLUŞTURULMASI
        // ----------------------------------------------------------------------
        // Token içerisine yerleştirilecek anahtar-değer (Claim) çiftleri tanımlanır.
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)                        // Token'ı basan sistem ("iss")
                .issuedAt(issuedAt)                    // Bastığımız zaman ("iat")
                .expiresAt(expiresAt)                  // Son geçerlilik zamanı ("exp")
                .subject(user.getUsername())           // Token sahibi kullanıcının kullanıcı adı ("sub")
                .claim("userId", user.getId())         // Özel alan: Kullanıcı ID'si
                .claim("role", user.getRole().name())  // Özel alan: Yalın rol adı (Örn: "ADMIN")
                .claim("roles", authorities)           // Özel alan: Spring Security yetki listesi (Örn: ["ROLE_ADMIN"])
                .build();

        // ----------------------------------------------------------------------
        // 4. ADIM: JWT HEADER (BAŞLIK) BİLGİSİNİN OLUŞTURULMASI
        // ----------------------------------------------------------------------
        // Token'ın hangi algoritma ve tip ile imzalanacağı belirlenir.
        JwsHeader header = JwsHeader
                .with(MacAlgorithm.HS256)              // HMAC-SHA256 imzalama algoritması
                .type("JWT")                           // Jeton tipi: JWT
                .build();

        // ----------------------------------------------------------------------
        // 5. ADIM: TOKEN'IN İMZALANMASI VE ŞİFRELENMİŞ METNE DÖNÜŞTÜRÜLMESİ
        // ----------------------------------------------------------------------
        // Header ve Claims bilgileri gizli anahtar (SecretKey) ile imzalanarak
        // Base64 tabanlı "eyJhbGci..." şeklinde tek bir string token'a çevrilir.
        Jwt jwt = jwtEncoder.encode(
                JwtEncoderParameters.from(
                        header,
                        claims
                )
        );

        // ----------------------------------------------------------------------
        // 6. ADIM: ÜRETİLEN TOKEN VE SÜRE BİLGİSİNİN DÖNDÜRÜLMESİ
        // ----------------------------------------------------------------------
        return new GeneratedToken(
                jwt.getTokenValue(),                  // Üretilen string JWT metni
                tokenDuration.toSeconds()             // İstemciye bildirilecek geçerlilik süresi (saniye)
        );
    }

    /**
     * TokenService tarafından üretilen sonucun istemciye (Controller/DTO) 
     * aktarılmasını sağlayan taşıyıcı veri yapısı (Immutable Data Record).
     *
     * @param value              Üretilen JWT metni (String)
     * @param expiresInSeconds   Token'ın kaç saniye boyunca geçerli olduğu
     */
    public record GeneratedToken(
            String value,
            long expiresInSeconds
    ) {
    }
}