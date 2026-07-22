/*
 * --------------------------------------------------
 * SECURITY CONFIG
 *
 * Bu sınıf uygulamanın HTTP güvenlik kurallarını
 * ve AuthenticationManager bileşenini yapılandırır.
 *
 * Şimdilik:
 * - Health endpoint'i herkese açıktır.
 * - Login endpoint'i herkese açıktır.
 * - Diğer endpoint'ler giriş yapılmasını ister.
 * - HTML form login kullanılmaz.
 * - HTTP Basic kullanılmaz.
 * - Sunucu tarafında session tutulmaz.
 *
 * JWT doğrulaması login modülüyle birlikte eklenecektir.
 * --------------------------------------------------
 */

package com.botas.yemekhane.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    /*
     * Uygulamadaki endpoint erişim kurallarını belirler.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http,
        JwtAuthenticationConverter jwtAuthenticationConverter
    ) throws Exception {

        http
            /*
             * React Native uygulamasında cookie tabanlı
             * oturum kullanmayacağımız için CSRF kapatılır.
             */
            .csrf(AbstractHttpConfigurer::disable)

            /*
            * Backend kullanıcı oturumunu bellekte saklamaz.
            * Her korumalı istek ileride JWT ile doğrulanır.
            */
            .sessionManagement(
                session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )



            .authorizeHttpRequests((authorize) -> authorize

                .requestMatchers(
                    "/api/health", 
                    "/api/auth/login",
                    "/api/auth/register"
                )
                .permitAll() // Bu adreslere herkes erişebilir.
                /*
                * Admin panelindeki bütün endpoint'ler yalnızca
                * ADMIN rolüne açıktır.
                */
                .requestMatchers("/api/admin/**")
                .hasRole("ADMIN")

                /*
                * Personel ve admin menü görüntüleme endpoint'lerine
                * erişebilir.
                */
                .requestMatchers("/api/menus/**")
                .hasAnyRole("ADMIN", "USER")

                .anyRequest() // Geriye kalan tüm istekler için
                .authenticated() // Giriş yapılmış olmalı.
            )


            /*
            * React Native kullandığımız için Spring'in
            * hazır HTML login ekranını kullanmayız.
            */
            .formLogin(AbstractHttpConfigurer::disable)


            /*
             * Bir kez username + password ile giriş
             * sonraki isteklerde Bearer JWT gönderilir
             */
            .httpBasic(AbstractHttpConfigurer::disable)


            /*
             * ----------------------------------------------------------------------------------
             * GERÇEK SENARYO İLE JWT DOĞRULAMA AKIŞI (OAuth2 Resource Server)
             * ----------------------------------------------------------------------------------
             * Senaryo: Ahmet mobil uygulamadan "Yemek Menüsünü Gör" butonuna bastı.
             * Mobil uygulama isteğin başlığına şu bilgiyi ekler:
             * 'Authorization: Bearer eyJhbGciOiJIUzI1Ni...' (Ahmet'in token'ı)
             *
             * 1. .oauth2ResourceServer(...):
             *    Güvenlik kapısı isteği karşılar. Başlıktaki 'Bearer' token'ı yakalar.
             *
             * 2. .jwt(...):
             *    Token'ın geçerliliğini denetler. (İmza doğru mu? Süresi dolmuş mu?)
             *
             * 3. .jwtAuthenticationConverter(jwtAuthenticationConverter):
             *    Token'ın içine bakar (Örn: "roles": ["ROLE_USER"]). Bu bilgiyi okuyup
             *    Spring Security'ye "Ahmet sistemde USER rolüne sahip doğrulanmış bir kişidir"
             *    bilgisini işler ve isteğin controller'a (örneğin MenuController) geçmesine izin verir.
             * ----------------------------------------------------------------------------------
             */
            .oauth2ResourceServer(resourceServer -> resourceServer
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(
                            jwtAuthenticationConverter
                    )
                )
            );


        return http.build();
    }

    /**
     * Kimlik doğrulama işlemlerini (Authentication) yöneten ana Spring Security bileşenini (AuthenticationManager) tanımlar.
     * Kullanıcı adı ve şifre kontrolünü/doğrulamasını bu nesne yönetir.
     * 
     * Bu metodu @Bean olarak tanımlayarak, projedeki diğer sınıflardan (örneğin LoginController)
     * bu nesneye erişebilmeyi ve kimlik doğrulama adımlarını tetikleyebilmeyi sağlıyoruz.
     */
    @Bean
    public AuthenticationManager authenticationManager(
        // Spring'in hazır kimlik doğrulama yapılandırma nesnesidir.
        // Bize sistemin oluşturduğu hazır AuthenticationManager'ı çekme imkanı sunar.
        AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        // Hazır yapılandırılmış AuthenticationManager nesnesini alıp Spring IoC Container'a (Bean olarak) sunuyoruz.
        return authenticationConfiguration.getAuthenticationManager();
    }
}





/*
// Login’in backend içindeki tam akışı
// AuthController
//       ↓
// AuthService
//       ↓
// AuthenticationManager.authenticate(...)
//       ↓
// DaoAuthenticationProvider
//       ↓
// DatabaseUserDetailsService
//       ↓
// UserService.getUserByUsername(...)
//       ↓
// UserRepository
//       ↓
// MySQL


Birinci adım: AuthenticationManager çağrılır

AuthService yaklaşık olarak şunu yapacak:

Authentication authentication =
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        username,
                        password
                )
        );

AuthenticationManager, kullanıcı adı ve parola doğrulama isteğini uygun authentication provider’a gönderir. 
Spring Security, kullanıcı adı/parola doğrulamasında genellikle DaoAuthenticationProvider kullanır.


İkinci adım:

Spring Security otomatik olarak şunu çağırır:

databaseUserDetailsService
        .loadUserByUsername("furkan");

Senin yazdığın sınıf:

UserService üzerinden kullanıcıyı bulur
passwordHash değerini Security'ye verir
USER rolünü ROLE_USER yapar
active durumunu Security'ye verir
UserDetails nesnesi döndürür

UserDetailsService, DaoAuthenticationProvider tarafından kullanıcı adı, kayıtlı parola ve kullanıcıya ait diğer bilgileri yüklemek için kullanılır



Üçüncü adım: Parola karşılaştırılır

Spring Security şuna benzer bir kontrol yapar:

passwordEncoder.matches(
        requesttenGelenAcikParola,
        veritabanindakiPasswordHash
);

Biz BCrypt hash’ini çözmeye çalışmıyoruz. Girilen parolanın aynı hash’e karşılık gelip gelmediğini kontrol ediyoruz.




Dördüncü adım: Kullanıcının durumu kontrol edilir

Senin kodun:

.disabled(!Boolean.TRUE.equals(user.getActive()))

şu anlama gelir:

active = true  → Kullanıcı giriş yapabilir
active = false → Kullanıcı giriş yapamaz




Beşinci adım: JWT üretilir

Kimlik doğrulama başarılı olursa TokenService bir JWT oluşturacak:

{
  "sub": "furkan",
  "role": "USER",
  "iat": 1784260000,
  "exp": 1784263600
}

JWT’nin içine parola veya parola hash’i koymayacağız.

Spring Security’nin Resource Server desteği özel olarak üretilen JWT Bearer token’larla API endpoint’lerini korumak için kullanılabilir. Böylece elle yazılmış özel bir JWT filtresi yerine framework’ün doğrulama altyapısını kullanacağız.





Altıncı adım: Login cevabı döner
HTTP 200 OK
{
  "accessToken": "eyJhbGciOi...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "id": 2,
    "fullName": "Furkan Elidolu",
    "username": "furkan",
    "role": "USER"
  }
}

Login hatalıysa dışarıya:

HTTP 401 Unauthorized
{
  "message": "Kullanıcı adı veya şifre hatalı."
}

döneceğiz. Kullanıcı adının var olup olmadığını ayrı ayrı açıklamayacağız.
*/