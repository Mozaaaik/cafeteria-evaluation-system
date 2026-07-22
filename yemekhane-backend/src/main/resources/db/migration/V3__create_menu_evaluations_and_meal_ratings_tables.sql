-- ==============================================================================
-- FLYWAY MIGRATION: V3__create_menu_evaluations_and_meal_ratings_tables.sql
-- Açıklama: Kullanıcıların (Personel) günlük yemekhane menülerine yaptığı genel
--           yorumları ve her yemeğe verdiği 1-5 arası puanları saklayan tablolar.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLO: menu_evaluations (Menü Genel Değerlendirmeleri ve Yorumlar)
-- Açıklama: Bir kullanıcının belirli bir günün menüsüne yaptığı ana değerlendirme kaydı.
-- ------------------------------------------------------------------------------
CREATE TABLE menu_evaluations (
    id                  BIGINT          AUTO_INCREMENT PRIMARY KEY, -- Benzersiz değerlendirme ID'si
    menu_id             BIGINT          NOT NULL,                   -- Değerlendirilen günlük menünün ID'si
    user_id             BIGINT          NOT NULL,                   -- Oy veren/yorum yapan kullanıcının ID'si
    general_comment     VARCHAR(500),                               -- Kullanıcının günün menüsü hakkındaki genel metin yorumu (Opsiyonel)
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,                   -- Değerlendirmenin yapıldığı tarih/saat
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,                   -- Değerlendirmenin güncellenme tarih/saati

    -- Kural (Unique Constraint): Bir kullanıcı aynı günün menüsünü sadece 1 KERE değerlendirebilir (Tekrar oy kullanamaz)
    CONSTRAINT uq_menu_evaluations_user_menu 
        UNIQUE (user_id, menu_id),

    -- İlişki (Foreign Key): Menü silindiğinde o menüye yapılmış tüm değerlendirmeler ve yorumlar da silinir (ON DELETE CASCADE)
    CONSTRAINT fk_menu_evaluations_menu_id 
        FOREIGN KEY (menu_id) REFERENCES daily_menus(id) 
        ON DELETE CASCADE,

    -- İlişki (Foreign Key): Değerlendirmeyi yapan kullanıcının 'users' tablosundaki varlığı doğrulanır
    CONSTRAINT fk_menu_evaluations_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id)
);


-- ------------------------------------------------------------------------------
-- 2. TABLO: meal_ratings (Tekil Yemek Puanları)
-- Açıklama: Değerlendirme kapsamındaki her bir yemeğe (Çorba, Ana Yemek vb.) verilen 1-5 arası puanlar.
-- ------------------------------------------------------------------------------
CREATE TABLE meal_ratings (
    id                  BIGINT          AUTO_INCREMENT PRIMARY KEY, -- Benzersiz puanlama ID'si
    evaluation_id       BIGINT          NOT NULL,                   -- Bağlı olduğu ana menü değerlendirme kaydının ID'si
    menu_item_id        BIGINT          NOT NULL,                   -- Puan verilen tekil yemeğin ID'si
    score               TINYINT         NOT NULL,                   -- Verilen puan (1 ile 5 arasında olmak zorundadır)
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,                   -- Puanın verildiği tarih/saat
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,                   -- Puanın güncellenme tarih/saati

    -- Kural (Check Constraint): Puan değerinin mutlaka 1, 2, 3, 4 veya 5 olmasını garanti eder (Örn: 0 veya 6 girilemez)
    CONSTRAINT chk_meal_ratings_score 
        CHECK (score BETWEEN 1 AND 5),

    -- Kural (Unique Constraint): Bir değerlendirme paketi içinde aynı yemeğe 2 defa puan verilemez
    CONSTRAINT uq_meal_ratings_evaluation_item 
        UNIQUE (evaluation_id, menu_item_id),

    -- İlişki (Foreign Key): Ana değerlendirme kaydı silinirse bu yemeğe verilen puan da otomatik silinir (ON DELETE CASCADE)
    CONSTRAINT fk_meal_ratings_evaluation_id 
        FOREIGN KEY (evaluation_id) REFERENCES menu_evaluations(id) 
        ON DELETE CASCADE,

    -- İlişki (Foreign Key): Yemek menüden silinirse ona verilmiş olan puan da otomatik silinir (ON DELETE CASCADE)
    CONSTRAINT fk_meal_ratings_menu_item_id 
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) 
        ON DELETE CASCADE
);
