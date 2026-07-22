-- ==============================================================================
-- FLYWAY MIGRATION: V2__create_daily_menus_and_menu_items_tables.sql
-- Açıklama: Yemekhane günlük menüleri ve menüdeki yemek çeşitlerini saklayan
--           veritabanı tablolarının oluşturulması scripti.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLO: daily_menus (Günlük Menüler)
-- Açıklama: Her bir güne özel oluşturulan yemek menüsü ana bilgilerini tutar.
-- ------------------------------------------------------------------------------
CREATE TABLE daily_menus (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY, -- Benzersiz menü ID'si (Otomatik artan)
    menu_date       DATE            NOT NULL UNIQUE,            -- Menünün geçerli olduğu tarih (Bir güne sadece 1 menü eklenmesini garanti eder)
    created_by      BIGINT          NOT NULL,                   -- Menüyü oluşturan yöneticinin (Admin) kullanıcı ID'si
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,                   -- Kaydın veritabanına eklenme zamanı
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,                   -- Kaydın en son güncellenme zamanı

    -- İlişki (Foreign Key): Menüyü oluşturan kullanıcının 'users' tablosunda bulunmasını zorunlu kılar
    CONSTRAINT fk_daily_menus_created_by 
        FOREIGN KEY (created_by) REFERENCES users(id)
);


-- ------------------------------------------------------------------------------
-- 2. TABLO: menu_items (Menü İçindeki Yemekler)
-- Açıklama: Bir günlük menünün içinde yer alan detaylı yemek çeşitlerini tutar.
-- ------------------------------------------------------------------------------
CREATE TABLE menu_items (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY, -- Benzersiz yemek ID'si (Otomatik artan)
    menu_id         BIGINT          NOT NULL,                   -- Yemeğin bağlı olduğu günlük menünün ID'si
    
    -- Yemek Kategorisi: Sadece belirlenen 4 standart kategoriden biri olabilir
    category        ENUM(
                        'SOUP',             -- Çorba
                        'MAIN_COURSE',       -- Ana Yemek
                        'SIDE_DISH',        -- Yardımcı Yemek (Pilav, Makarna vb.)
                        'DESSERT_OR_FRUIT'  -- Tatlı veya Meyve
                    )               NOT NULL,

    name            VARCHAR(100)    NOT NULL,                   -- Yemeğin adı (Örn: "Mercimek Çorbası", "Karnıyarık")
    display_order   TINYINT         NOT NULL,                   -- Ekranda sıralama önceliği (1: Çorba, 2: Ana Yemek, 3: Yan Yemek, 4: Tatlı)
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,                   -- Kaydın veritabanına eklenme zamanı
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,                   -- Kaydın en son güncellenme zamanı

    -- Kural (Unique Constraint): Aynı günün menüsünde aynı kategoriden 2. bir yemek olamaz (Örn: 2 tane çorba eklenemez)
    CONSTRAINT uq_menu_items_menu_category 
        UNIQUE (menu_id, category),

    -- İlişki (Foreign Key): Yemek 'daily_menus' tablosuna bağlıdır. Menü silinirse içindeki yemekler de silinir (ON DELETE CASCADE)
    CONSTRAINT fk_menu_items_menu_id 
        FOREIGN KEY (menu_id) REFERENCES daily_menus(id) 
        ON DELETE CASCADE
);
