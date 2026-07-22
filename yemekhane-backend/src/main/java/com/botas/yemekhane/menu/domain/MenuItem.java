package com.botas.yemekhane.menu.domain;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/*
 * Günlük menü içerisindeki tek bir yemeği temsil eder.
 *
 * Örneğin:
 *
 * category = SOUP
 * name = Ezogelin
 * displayOrder = 1
 */
@Entity
@Table(name = "menu_items")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Yemeğin bağlı olduğu ana menüyü tutan değişkendir.
     * 
     * 1. 'private DailyMenu menu;' Nedir?
     *    Yemeğin içinde bir 'menu' kutusu oluşturur. 
     *    Başlangıçta bu kutunun içi BOŞTUR (null).
     * 
     * 2. '@JoinColumn(name = "menu_id")' Nedir?
     *    Veritabanına tercümanlık yapar: 
     *    "Veritabanındaki 'menu_items' tablosunda bulunan 'menu_id' sütununa ne yazılacağını 
     *    buradaki 'menu' kutusunun içindeki DailyMenu nesnesinin ID'sinden bakarak öğren."
     */
    @ManyToOne(
            fetch = FetchType.LAZY,
            optional = false
    )
    @JoinColumn(
            name = "menu_id",
            nullable = false
    )
    private DailyMenu menu;

    /*
     * EnumType.STRING sayesinde kategori veritabanına
     * SOUP, MAIN_COURSE gibi metin olarak yazılır.
     */
    @Enumerated(EnumType.STRING)
    @Column(
            name = "category",
            nullable = false,
            length = 30
    )
    private MenuCategory category;

    @Column(
            name = "name",
            nullable = false,
            length = 100
    )
    private String name;

    @Column(
            name = "display_order",
            nullable = false,
            columnDefinition = "TINYINT"
    )
    private int displayOrder;

    @CreationTimestamp
    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private Instant createdAt;

    @UpdateTimestamp
    @Column(
            name = "updated_at",
            nullable = false
    )
    private Instant updatedAt;

    /*
     * Kontrollü yeni yemek (MenuItem) oluşturma metodudur (Factory Pattern / Fabrika Metodu).
     * 
     * --- NEDEN BU METODU KULLANIYORUZ? ---
     * Kodun başka bir yerinde rastgele 'new MenuItem()' veya 'builder()' çağırıp 
     * gösterim sırasını (displayOrder) yanlış yazma riskini engeller.
     * 
     * --- NASIL ÇALIŞIR? ---
     * 1. Dışarıdan sadece 'category' (Kategori) ve 'name' (Yemek Adı) parametrelerini alır.
     * 2. 'displayOrder' (Ekrandaki sıra numarası) bilgisini parametre olarak İSTEMEZ! 
     *    Bunun yerine 'category.getDisplayOrder()' çağırarak kategoriden OTOMATİK alır.
     *    (Örn: Kategori SOUP ise sıra 1, MAIN_COURSE ise sıra 2 otomatik atanır).
     * 3. Hazırlanan bu verilerle nesneyi oluşturup (build) geri döndürür.
     */
    public static MenuItem create(
            MenuCategory category,
            String name
    ) {
        return MenuItem.builder()
                .category(category)
                .name(name)
                .displayOrder(category.getDisplayOrder()) // Sıra numarası kategoriden otomatik çekilir
                .build();
    }

    /*
     * Yemeğin 'menu' kutusunu dolduran yardımcı metottur (Setter gibi çalışır).
     * 
     * 'attachTo(dailyMenu)' çağrıldığında:
     * -> Yemeğin içindeki 'private DailyMenu menu;' kutusunun içine parametre gelen menüyü koyar.
     * -> Böylece @JoinColumn(name = "menu_id") kutunun dolduğunu görür ve veritabanına menünün ID'sini yazar.
     */
    void attachTo(DailyMenu menu) {
        this.menu = menu;
    }
}