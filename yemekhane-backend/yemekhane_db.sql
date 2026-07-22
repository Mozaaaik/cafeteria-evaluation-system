CREATE DATABASE IF NOT EXISTS yemekhane_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- localhost bağlantıları için
CREATE USER IF NOT EXISTS 'yemekhane_app'@'localhost'
    IDENTIFIED BY 'Qx1.3.7.99';

ALTER USER 'yemekhane_app'@'localhost'
    IDENTIFIED BY 'Qx1.3.7.99';

GRANT ALL PRIVILEGES
    ON yemekhane_db.*
    TO 'yemekhane_app'@'localhost';

-- 127.0.0.1 bağlantıları için
CREATE USER IF NOT EXISTS 'yemekhane_app'@'127.0.0.1'
    IDENTIFIED BY 'Qx1.3.7.99';

ALTER USER 'yemekhane_app'@'127.0.0.1'
    IDENTIFIED BY 'Qx1.3.7.99';

GRANT ALL PRIVILEGES
    ON yemekhane_db.*
    TO 'yemekhane_app'@'127.0.0.1';

FLUSH PRIVILEGES;
