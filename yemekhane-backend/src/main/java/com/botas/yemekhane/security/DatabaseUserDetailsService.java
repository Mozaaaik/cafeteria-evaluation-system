package com.botas.yemekhane.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.botas.yemekhane.user.domain.User;
import com.botas.yemekhane.user.service.UserService;

/*

Spring Security bize hazır bir güvenlik altyapısı sağlıyor. Biz de onun sözleşmelerini uygulayarak kendi veritabanımızı bu hazır sisteme bağlıyoruz.

Spring Security’nin temel görevleri şunlardır:

Authentication: Kullanıcı gerçekten kim? Kullanıcı adı ve şifre doğru mu?
Authorization: Bu kullanıcı hangi işlemleri yapabilir? Admin mi, normal kullanıcı mı?
İstekleri koruma: Giriş yapmayan veya yetkisi olmayan kişinin endpoint’lere ulaşmasını engelleme.
Yaygın web saldırılarına karşı koruma mekanizmaları sağlama.


Spring Security olmasaydı

Her endpoint’in içinde kendimiz şu kontrolleri yapmak zorunda kalabilirdik:

@GetMapping("/api/admin/report")
public Report getReport(HttpServletRequest request) {

    String token = request.getHeader("Authorization");

    // Token var mı?
    // Token geçerli mi?
    // Kullanıcı veritabanında var mı?
    // Kullanıcı aktif mi?
    // Rolü ADMIN mi?
    // Token süresi dolmuş mu?
    // Hata varsa 401 mi 403 mü dönmeli?

    return reportService.getReport();
}

******************************
******************************

“Sözleşme” neden var?

Spring Security senin projenin veritabanını tanımıyor.

Senin tablon şöyle:

users
├── username
├── password_hash
├── role
└── active

Başka bir projede alanların adı şöyle olabilir:

members
├── login_name
├── encrypted_password
├── authority
└── enabled

Spring Security bütün projelerdeki tablo ve alan isimlerini tahmin edemez. Bu yüzden şöyle bir sözleşme koyuyor:

“Kullanıcı adına göre kullanıcı bilgisi getireceksen UserDetailsService interface’ini uygula ve bana UserDetails döndür.”

******************************
******************************

DatabaseUserDetailsService tam olarak ne yapıyor?

Bu sınıf iki sistem arasında çevirmen görevi görüyor:

Bizim MySQL yapımız
        ↓
Hibernate User entity
        ↓
DatabaseUserDetailsService
        ↓
Spring Security UserDetails

Spring Security’ye şunları söylemiş oluyoruz:

Bu kişinin kullanıcı adı: admin
Kayıtlı BCrypt hash'i: $2a$10$...
Rolü: ROLE_ADMIN
Hesabı devre dışı mı: Hayır

******************************
******************************

Spring Security’ye bağlı bir giriş mekanizmasında akış yaklaşık şöyledir:

1. Kullanıcı adı ve şifre backend'e gelir
                    ↓
2. Spring Security doğrulama işlemini başlatır
                    ↓
3. DatabaseUserDetailsService.loadUserByUsername("admin")
   çağrılır
                    ↓
4. Kullanıcı MySQL'den bulunur
                    ↓
5. UserDetails nesnesine çevrilir
                    ↓
6. PasswordEncoder girilen şifreyi
   kayıtlı BCrypt hash'iyle karşılaştırır
                    ↓
7. active ve rol bilgileri değerlendirilir
                    ↓
8. Doğruysa kullanıcı authenticated kabul edilir
*/


@Service
public class DatabaseUserDetailsService implements UserDetailsService {

    private final UserService userService;

    public DatabaseUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    /*
     * Spring Security kullanıcı adıyla kullanıcı bilgisi
     * yüklemek istediğinde bu metodu çağırır.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user;

        try {

            user = userService.getUserByUsername(username);

        } catch (IllegalArgumentException e) {

            throw new UsernameNotFoundException(
                "Kullanıcı adı veya şifre hatalı ",
                e
            );
        }

        // Spring Security’ye uygun UserDetails nesnesi oluşturuluyor.
        return org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPasswordHash())
            .roles(user.getRole().name()) // ADMIN String ve .roles sonucu "ROLE_ADMIN" yetkisi elde edilir
            .disabled(!Boolean.TRUE.equals(user.getActive())) // active = true ise disabled = false olur. Kullanıcı aktif sayılır
            .build();
    }    
    
}
