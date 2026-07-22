package com.botas.yemekhane.menu.domain;

/**
 * Günlük menüde bulunabilecek yemek kategorilerini ve bu kategorilerin
 * mobil/web uygulamasındaki varsayılan gösterim sıralarını (displayOrder) tanımlayan Enum sınıfı.
 * <p>
 * Veritabanındaki 'menu_items' tablosunun 'category' sütunu ile birebir eşleşir.
 */
public enum MenuCategory {

    /** 1. Sıra: Çorba */
    SOUP(1),

    /** 2. Sıra: Ana Yemek */
    MAIN_COURSE(2),

    /** 3. Sıra: Yardımcı Yemek (Pilav, Makarna vb.) */
    SIDE_DISH(3),

    /** 4. Sıra: Tatlı veya Meyve */
    DESSERT_OR_FRUIT(4);

    /** Kategorinin ekrandaki sabit gösterim sırası (1, 2, 3, 4) */
    private final int displayOrder;

    /**
     * Enum sabiti oluşturulurken ona ait gösterim sırasını atayan yapıcı metot (Constructor).
     * Enum constructor'ları varsayılan olarak private çalışır.
     *
     * @param displayOrder Ekrandaki sıralama numarası
     */
    MenuCategory(int displayOrder) {
        this.displayOrder = displayOrder;
    }

    /**
     * Kategorinin ekrandaki gösterim sırasını döndürür.
     *
     * @return Sıralama numarası (1, 2, 3 veya 4)
     */
    /**
     * Kategorinin ekrandaki gösterim sırasını döndürür.
     *
     * @return Sıralama numarası (1, 2, 3 veya 4)
     */
    public int getDisplayOrder() {
        return displayOrder;
    }
}

/*
 * ==============================================================================
 * EĞİTİM / ANLATIM: JAVA ENUM ARKAPLAN ÇALIŞMA MANTIĞI
 * ==============================================================================
 *
 * 1. PARANTEZ İÇİNDEKİ SAYI NASIL DEĞİŞKENE ATANIYOR?
 * ----------------------------------------------------
 * Siz 'SOUP(1)' yazdığınızda Java arka planda aynen şu kodu çalıştırır:
 * 
 *    public static final MenuCategory SOUP = new MenuCategory(1);
 * 
 * - Parantez içindeki '1' sayısı, aşağıdaki yapıcı metoda (Constructor) gider:
 *      MenuCategory(int displayOrder) {
 *          this.displayOrder = displayOrder; // 1 sayısı bu değişkene aktarılır!
 *      }
 *
 * 2. ÖRNEK KULLANIM: KOD İÇİNDE NASIL ÇAĞRILIR?
 * ----------------------------------------------------
 * // Örnek 1: Kategorinin sırasını alma
 * MenuCategory secilenKategori = MenuCategory.SOUP;
 * int sira = secilenKategori.getDisplayOrder(); // 'sira' değişkeninin değeri 1 olur!
 *
 * // Örnek 2: Sıralama yaparken kullanma
 * System.out.println(MenuCategory.MAIN_COURSE.getDisplayOrder()); // Çıktı: 2
 * ==============================================================================
 */