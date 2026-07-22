package com.botas.yemekhane.auth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import com.botas.yemekhane.auth.dto.AuthenticatedUserResponse;
import com.botas.yemekhane.auth.dto.LoginRequest;
import com.botas.yemekhane.auth.dto.LoginResponse;
import com.botas.yemekhane.auth.dto.RegisterRequest;
import com.botas.yemekhane.auth.dto.RegisterResponse;
import com.botas.yemekhane.common.exception.InvalidCredentialsException;
import com.botas.yemekhane.user.domain.User;
import com.botas.yemekhane.user.service.UserService;

/*
 * Authentication işlemlerini yöneten service sınıfıdır.
 *
 * Sorumlulukları:
 * - Yeni personel kaydı oluşturmak.
 * - Kullanıcı adı ve şifreyi Spring Security'ye doğrulatmak.
 * - Doğrulanan kullanıcı için JWT üretmek.
 * - Mobil uygulamaya güvenli register/login cevapları hazırlamak.
 */
@Service
public class AuthService {

    private static final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);

    /*
     * Login cevabında token türünü belirtir.
     *
     * Mobil uygulama token'ı şu biçimde gönderir:
     *
     * Authorization: Bearer eyJhbGciOi...
     */
    private static final String TOKEN_TYPE = "Bearer";

    /*
     * Kullanıcı oluşturma ve kullanıcıyı bulma
     * işlemlerini yürütür.
     */
    private final UserService userService;

    /*
     * Kullanıcı adı ve şifre doğrulamasını
     * Spring Security altyapısına yaptırır.
     */
    private final AuthenticationManager authenticationManager;

    /*
     * Kimliği doğrulanan kullanıcı için JWT oluşturur.
     */
    private final TokenService tokenService;

    /*
     * Constructor injection kullanıyoruz.
     *
     * Spring IoC Container:
     * - UserService
     * - AuthenticationManager
     * - TokenService
     *
     * bean'lerini bulup bu sınıfa otomatik olarak verir.
     */
    public AuthService(
            UserService userService,
            AuthenticationManager authenticationManager,
            TokenService tokenService
    ) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    /*
     * Yeni personel hesabı oluşturur.
     *
     * RegisterRequest içinde rol bulunmaz.
     * UserService.registerUser() her yeni kullanıcıya
     * otomatik olarak USER rolü verir.
     */
    public RegisterResponse register(
            RegisterRequest request
    ) {
        User createdUser = userService.registerUser(
                request.fullName(),
                request.username(),
                request.password()
        );

        /*
         * User entity'sini güvenli API cevabına çevirir.
         *
         * passwordHash response içinde yer almaz.
         */
        return RegisterResponse.fromUser(createdUser);
    }

    /*
     * Kullanıcının giriş işlemini gerçekleştirir.
     *
     * Akış:
     *
     * 1. Username ve açık şifre AuthenticationManager'a verilir.
     * 2. Spring Security kullanıcıyı veritabanından bulur.
     * 3. Girilen şifre BCrypt hash ile karşılaştırılır.
     * 4. Doğrulama başarılıysa JWT üretilir.
     * 5. JWT ve kullanıcı bilgileri mobil uygulamaya döndürülür.
     */
    public LoginResponse login(
            LoginRequest request
    ) {
        Authentication authentication;

        try {
            /*
             * Henüz doğrulanmamış bir authentication isteği
             * oluşturuyoruz.
             *
             * Burada:
             * - principal   = username
             * - credentials = açık şifre
             */
            UsernamePasswordAuthenticationToken authenticationRequest =
                    UsernamePasswordAuthenticationToken.unauthenticated(
                            request.username(),
                            request.password()
                    );

            /*
             * Spring Security doğrulama işlemini başlatır.
             *
             * Arka planda yaklaşık olarak:
             *
             * DatabaseUserDetailsService
             *        ↓
             * UserService
             *        ↓
             * MySQL
             *        ↓
             * BCrypt şifre karşılaştırması
             *
             * çalışır.
             *
             * Arka planda adım adım şu işlemler gerçekleşir:
             * 1. DatabaseUserDetailsService veritabanından kullanıcıyı ve BCrypt hash'li şifresini getirir.
             * 2. Spring Security (DaoAuthenticationProvider), PasswordEncoderConfig içinde tanımladığımız
             *    BCryptPasswordEncoder bean'ini alır.
             * 3. 'passwordEncoder.matches(girdiğiAçıkŞifre, veritabanındakiHash)' çağrılarak BCrypt karşılaştırması yapılır.
             * 4. Eşleşme başarılıysa doğrulanmış Authentication nesnesi döner, hatalıysa BadCredentialsException fırlatılır.
             */
            authentication =
                    authenticationManager.authenticate(
                            authenticationRequest
                    );

        } catch (AuthenticationException exception) {
            /*
             * Kullanıcı bulunamadığında, parola yanlış olduğunda
             * veya hesap pasif olduğunda ortak bir hata döndürürüz.
             *
             * Geliştirme/Hata ayıklama sürecinde terminale detaylı log basıyoruz.
             */
            LOGGER.warn("Login başarısız (kullanıcı: {}): {}", request.username(), exception.getMessage());
            throw new InvalidCredentialsException();
        }

        /*
         * authentication.getName() doğrulanmış kullanıcının
         * kullanıcı adını döndürür.
         *
         * Request içindeki değeri doğrudan kullanmak yerine
         * doğrulanmış Authentication sonucunu kullanıyoruz.
         */
        User user = userService.getUserByUsername(
                authentication.getName()
        );

        /*
         * Doğrulanmış kullanıcı için imzalı JWT oluşturulur.
         */
        TokenService.GeneratedToken generatedToken =
                tokenService.generate(user);

        /*
         * Login cevabında:
         * - JWT
         * - Token türü
         * - Geçerlilik süresi
         * - Güvenli kullanıcı bilgileri
         *
         * döndürülür.
         */
        return new LoginResponse(
                generatedToken.value(),
                TOKEN_TYPE,
                generatedToken.expiresInSeconds(),
                AuthenticatedUserResponse.from(user)
        );
    }
}