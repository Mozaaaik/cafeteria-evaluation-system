package com.botas.yemekhane.menu.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.botas.yemekhane.menu.domain.DailyMenu;

/*
 * Veritabanı Garsonu (Repository Katmanı).
 * 
 * --- BU İNTERFACE NE İŞE YARAR? ---
 * MySQL'deki 'daily_menus' tablosuna erişip veri okuma, kaydetme, güncelleme ve silme (CRUD)
 * işlemlerini yürüten Spring Data JPA arayüzüdür.
 * 
 * --- 'extends JpaRepository<DailyMenu, Long>' NEDEN YAZILDI? ---
 * Spring Boot bize tek bir satır SQL sorgusu yazmadan hazır metodlar sunar:
 * 1. save(dailyMenu)   -> Veritabanına INSERT / UPDATE SQL sorgusu atar.
 * 2. findById(id)      -> ID ile menü aramak için SELECT SQL sorgusu atar.
 * 3. deleteById(id)    -> Veritabanından menüyü silmek için DELETE SQL sorgusu atar.
 * 4. findAll()         -> Tüm menüleri getirmek için SELECT sorgusu atar.
 */
public interface DailyMenuRepository
        extends JpaRepository<DailyMenu, Long> {

    /*
     * MÜKERRER KAYIT KONTROLÜ
     * 
     * Spring Data JPA, metodun isminden ('existsByMenuDate') otomatik olarak şu SQL'i üretir:
     * -> SELECT COUNT(*) > 0 FROM daily_menus WHERE menu_date = ?;
     * 
     * Ne İşe Yarar?
     * Admin yeni menü eklemeye çalıştığında, belirtilen tarihte menünün zaten var olup olmadığını 
     * kontrol eder. Menü varsa 'true', yoksa 'false' döner.
     */
    boolean existsByMenuDate(LocalDate menuDate);

    /*
     * TARİHE GÖRE MENÜ GETİRME
     * 
     * Spring Data JPA, metodun isminden ('findByMenuDate') otomatik olarak şu SQL'i üretir:
     * -> SELECT * FROM daily_menus WHERE menu_date = ?;
     * 
     * 'Optional<DailyMenu>' Nedir?
     * Aranılan tarihte veritabanında bir menü OLABİLİR de OLMAYABİLİR de. 
     * Optional kullanmak uygulamanın NullPointerException (null çökmesi) almasını engeller.
     * 
     * Ne İşe Yarar?
     * Kullanıcı (Mobil/Web) "Bugünün menüsünü getir" (GET /api/menus/today) dediğinde bu metot çağrılır.
     */
    Optional<DailyMenu> findByMenuDate(LocalDate menuDate);
}
