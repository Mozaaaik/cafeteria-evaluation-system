/*
 * --------------------------------------------------
 * YEREL MYSQL ORTAM KURULUMU
 *
 * Bu script:
 * - Yerel yemekhane_db veritabanını oluşturur.
 * - Spring Boot için yemekhane_app kullanıcısını oluşturur.
 * - Kullanıcıya yalnızca yemekhane_db üzerinde yetki verir.
 *
 * Bu dosya root veya kullanıcı yönetme yetkisine sahip
 * bir MySQL hesabıyla bir kez çalıştırılmalıdır.
 *
 * CHANGE_ME_LOCAL_PASSWORD değeri çalıştırılmadan önce
 * kişisel yerel şifreyle değiştirilmelidir.
 *
 * Tablolar burada oluşturulmaz.
 * Tablolar Flyway migration dosyalarıyla oluşturulur.
 * --------------------------------------------------
 */

CREATE DATABASE IF NOT EXISTS yemekhane_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'yemekhane_app'@'127.0.0.1'
    IDENTIFIED BY 'CHANGE_ME_LOCAL_PASSWORD';

ALTER USER 'yemekhane_app'@'127.0.0.1'
    IDENTIFIED BY 'CHANGE_ME_LOCAL_PASSWORD';

GRANT ALL PRIVILEGES
    ON yemekhane_db.*
    TO 'yemekhane_app'@'127.0.0.1';