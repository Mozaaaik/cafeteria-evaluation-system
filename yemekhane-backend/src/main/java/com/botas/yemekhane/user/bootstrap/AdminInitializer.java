package com.botas.yemekhane.user.bootstrap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.botas.yemekhane.user.domain.Role;
import com.botas.yemekhane.user.service.UserService;


/*

    Uygulama başlatılır
            ↓
    Spring sınıfları bulur
            ↓
    Veritabanı bağlantısı hazırlanır
            ↓
    Repository ve Service nesneleri oluşturulur
            ↓
    ApplicationRunner sınıfları bulunur
            ↓
    AdminInitializer.run() otomatik çağrılır


*/



@Component // Bu sınıftan bir nesne oluştur ve Spring Container içerisinde yönet.
public class AdminInitializer implements ApplicationRunner  { // Uygulama tamamen açıldıktan sonra bu sınıfın run() metodunu otomatik çalıştır.
    
    // Yeni bir logger hazırlar ve bu logger’ın AdminInitializer sınıfına ait olduğunu belirtir.
    private static final Logger LOGGER = LoggerFactory.getLogger(AdminInitializer.class); 

    private final UserService userService;

    private final Boolean enabled;
    private final String fullName;
    private final String username;
    private final String password;

    public AdminInitializer(

        UserService userService,

        @Value("${app.bootstrap-admin.enabled:false}")
        boolean enabled,
        @Value("${app.bootstrap-admin.fullName:CHANGE_ME}")
        String fullName,
        @Value("${app.bootstrap-admin.username:CHANGE_ME}")
        String username,
        @Value("${app.bootstrap-admin.password:CHANGE_ME}")
        String password
    ) {

        this.userService = userService;
        this.enabled = enabled;
        this.fullName = fullName;
        this.username = username;
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {

        if (!enabled) {
            LOGGER.info("Başlangıç Admin oluşturma devre dışı.");
            return;
        }

        if (userService.existsByUsername(username)) {
            LOGGER.info(
                "Başlangıç admin kullanıcısı zaten mevcut: {}",
                username
            );
            return;
        }

        userService.createUser(fullName, username, password, Role.ADMIN);

        LOGGER.info(
            "Başlangıç admin kullanıcısı oluşturuldu: {}",
            username
        );

        
    }

    
}

