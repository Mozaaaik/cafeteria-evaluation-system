package com.botas.yemekhane.menu.domain;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/*
 * Belirli bir tarihe ait yemekhane menüsünü temsil eden JPA Varlık (Entity) sınıfı.
 * 'daily_menus' tablosu ile eşleşir.
 */
@Entity
@Table(name = "daily_menus")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class DailyMenu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * Menünün sunulacağı tarih (YYYY-MM-DD).
     * Her gün için yalnızca bir menü tanımlanabilir (unique = true).
     */
    @Column(
            name = "menu_date",
            nullable = false,
            unique = true
    )
    private LocalDate menuDate;

    /*
     * Menüyü sisteme giren yönetici (Admin) kullanıcısının ID'si.
     */
    @Column(
            name = "created_by",
            nullable = false
    )
    private Long createdBy;

    /*
     * Menüye bağlı olan yemeklerin listesi (1 Günlük Menü -> N Tane Yemek Çeşidi).
     * 
     * 1. @OneToMany (Bir-Çok İlişkisi):
     *    Veritabanında 1 ana menüye (DailyMenu) karşılık N tane yemek (MenuItem) olduğunu ifade eder.
     * 
     * 2. mappedBy = "menu":
     *    İlişkinin veritabanındaki sahibinin (Foreign Key sahibi) MenuItem tarafındaki 'menu' alanı
     *    olduğunu belirtir. Böylece Hibernate gereksiz ek bir ara tablo (join table) oluşturmaz.
     * 
     * 3. cascade = CascadeType.ALL (Çağlayan İşlemler):
     *    DailyMenu kaydedildiğinde, güncellendiğinde veya silindiğinde bu listedeki tüm MenuItem nesnelerine
     *    de aynı işlemin otomatik uygulanmasını sağlar. (Menüyü kaydetmek içindeki yemekleri de kaydeder).
     * 
     * 4. orphanRemoval = true (Yetim Kayıt Temizliği):
     *    Bu listeden bir MenuItem çıkarılırsa (örn: items.remove(item)), veritabanından da 
     *    otomatik olarak silinmesini (DELETE sorgusu atılmasını) sağlar.
     * 
     * 5. @OrderBy("displayOrder ASC"):
     *    Menü veritabanından çekildiğinde, içindeki yemeklerin gösterim sırasına (displayOrder)
     *    göre artan şekilde (1: Çorba, 2: Ana Yemek vb.) sıralı gelmesini sağlar.
     * 
     * 6. @Builder.Default:
     *    Lombok @Builder kullandığımızda bu listenin varsayılan olarak 'null' kalmasını engeller,
     *    boş bir ArrayList (new ArrayList<>()) olarak başlatılmasını garanti eder.
     */
    @Builder.Default
    @OneToMany(
            mappedBy = "menu",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @OrderBy("displayOrder ASC")
    private List<MenuItem> items = new ArrayList<>();

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
     * Yeni günlük menü nesnesi oluşturmak için kullanılan factory metodudur.
     * Bu metot, yeni bir DailyMenu nesnesini başlatır ve başlangıç değerlerini atar.
     */
    public static DailyMenu create(
            LocalDate menuDate,
            Long createdBy
    ) {
        return DailyMenu.builder()
                .menuDate(menuDate)
                .createdBy(createdBy)
                .build();
    }

    /*
     * Menüye yeni bir yemek ekler ve çift yönlü (bidirectional) ilişkiyi kurar.
     * 
     * --- SENARYO VE VERİTABANI İLİŞKİSİ ---
     * Admin "21 Temmuz Menüsü"ne (DailyMenu, id=1) "Mercimek Çorbası"nı (MenuItem) eklemek istiyor.
     * 
     * ADIM 1: items.add(item);
     * ------------------------
     * DailyMenu içindeki 'items' (ArrayList) listesine "Mercimek Çorbası" eklenir.
     * Artık menüye "İçinde ne yemek var?" denilince [Mercimek Çorbası] cevabını verir.
     * FAKAT! Mercimek Çorbası nesnesinin henüz "Hangi menüye aitim?" bilgisi BOŞTUR (null).
     * 
     * ADIM 2: item.attachTo(this);
     * ----------------------------
     * "Mercimek Çorbası" nesnesinin içine gidilir ve "Senin ait olduğun menü bu 21 Temmuz Menüsüdür" (this) denir.
     * Yemeğin içindeki 'menu' değişkeni doldurulur.
     * 
     * --- VERİTABANI (SQL) YANSIMASI ---
     * dailyMenuRepository.save(dailyMenu) çalıştırıldığında Hibernate şu 2 sorguyu atar:
     * 1. INSERT INTO daily_menus (menu_date...) VALUES ('2026-07-21');  --> Menü kaydedilir (ID = 1 oluşur)
     * 2. INSERT INTO menu_items (menu_id, name...) VALUES (1, 'Mercimek Çorbası'); --> ADIM 2 sayesinde menu_id=1 yazılır!
     * 
     * EĞER ADIM 2 OLMASAYDI:
     * menu_items tablosuna menu_id = NULL yazılmaya çalışılırdı ve veritabanı "menu_id cannot be null" diyerek ÇÖKERDİ.
     */
    public void addItem(MenuItem item) {
        items.add(item);        // Adım 1: Menü -> Yemeği kendi listesine koyar
        item.attachTo(this);    // Adım 2: Yemek -> Hangi menüye ait olduğunu kaydeder
    }
}
