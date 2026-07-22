package com.botas.yemekhane.menu.api;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.botas.yemekhane.menu.dto.CreateMenuRequest;
import com.botas.yemekhane.menu.dto.MenuResponse;
import com.botas.yemekhane.menu.service.MenuService;

import jakarta.validation.Valid;

/*
 * REST CONTROLLER KATMANI (API Dış Kapısı).
 * 
 * --- BU SINIF NE İŞE YARAR? ---
 * Mobil veya Web uygulamasından (Frontend) gelen HTTP isteklerini karşılayan dış kapıdır.
 * İstemciden gelen JSON verilerini doğrular, işi 'MenuService' sınıfına havale eder 
 * ve sonucunu HTTP yanıt kodu (201 Created vb.) ve JSON verisi olarak geri döner.
 * 
 * @RestController : Bu sınıfın bir REST API ucu olduğunu ve döneceği verilerin 
 *                   otomatik olarak JSON formatına çevrileceğini belirtir.
 * @RequestMapping("/api/admin/menus") : Bu sınıftaki tüm endpoint'lerin adreslerinin 
 *                                       '/api/admin/menus' ile başlayacağını belirler.
 */
@RestController
@RequestMapping("/api/admin/menus")
public class AdminMenuController {

    // İş kurallarını yürüten servis katmanı bağımlılığı
    private final MenuService menuService;

    // Constructor Injection: Spring Boot MenuService'i otomatik enjekte eder.
    public AdminMenuController(
            MenuService menuService
    ) {
        this.menuService = menuService;
    }

    /*
     * YENİ GÜNLÜK MENÜ OLUŞTURMA ENDPOINT'İ
     * 
     * --- HTTP İSTEK ADRESİ: POST /api/admin/menus ---
     * 
     * 1. @PostMapping:
     *    İstemciden (Frontend) gelecek 'POST' türündeki HTTP isteklerini bu metoda yönlendirir.
     * 
     * 2. @RequestBody CreateMenuRequest request:
     *    Frontend'in gönderdiği JSON verisini (menuDate, soup, mainCourse...) alıp 'CreateMenuRequest' DTO nesnesine çevirir.
     * 
     * 3. @Valid:
     *    'CreateMenuRequest' içindeki doğrulama kurallarını (@NotBlank, @NotNull vb.) çalıştırır.
     *    Eğer çorba adı veya tarih boş bırakılmışsa kod hiç çalışmadan istemciye HTTP 400 Bad Request döner.
     * 
     * 4. Authentication authentication:
     *    Spring Security tarafından doğrulanan JWT token bilgisini tutar.
     *    'authentication.getName()' denildiğinde JWT içindeki kullanıcının adı (username / sub) alınır.
     * 
     * 5. ResponseEntity<MenuResponse>:
     *    HTTP Yanıt paketidir. 'HttpStatus.CREATED' (201 Oluşturuldu) durum kodu ile birlikte 
     *    kaydolan menünün JSON verisini (MenuResponse) istemciye döndürür.
     */
    @PostMapping
    public ResponseEntity<MenuResponse> createMenu(
            @Valid @RequestBody CreateMenuRequest request,
            Authentication authentication
    ) {
        /*
         * authentication.getName() -> Güvenlik kapısından geçmiş JWT'nin 
         * içindeki kullanıcı adını (username) verir (Örn: "admin").
         */
        MenuResponse response = menuService.createMenu(
                request,
                authentication.getName()
        );

        /*
         * HTTP 201 Created yanıtı ve oluşturulan menünün DTO paketini (JSON) geri dönüyoruz.
         */
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}

/*
 * =====================================================================================
 * KONTROLCÜYE İSTEK GELDİĞİNDE BAŞTAN SONA ÇALIŞMA AKIŞI (SENARYO)
 * =====================================================================================
 * Senaryo: Admin "Ahmet", paneldan '2026-07-22' tarihi için menüyü doldurup "Kaydet"e bastı.
 * 
 * 1. HTTP İSTEĞİ (Frontend -> Backend):
 *    - İstemci 'POST /api/admin/menus' adresine JSON paketi ve Authorization Bearer JWT atar.
 * 
 * 2. GÜVENLİK FİLTRESİ (SecurityConfig):
 *    - Spring Security JWT imzasını doğrular, '/api/admin/**' adresi için 'ADMIN' rolü olduğunu onaylar.
 * 
 * 3. CONTROLLER KATMANI (AdminMenuController.createMenu):
 *    - @Valid: JSON verisini doğrular (tarih/çorba boşsa 400 Bad Request verir).
 *    - authentication.getName(): JWT içindeki "ahmet" kullanıcı adını söker.
 *    - İş kuralını çalıştırmak için MenuService.createMenu(...) metodunu çağırır.
 * 
 * 4. SERVİS KATMANI (MenuService):
 *    - @Transactional altında çalışır.
 *    - Mükerrer tarih kontrolü yapar (Tarih varsa 409 Conflict verir).
 *    - Ahmet'in User nesnesini veritabanından bulur.
 *    - DailyMenu ve 4 adet MenuItem (Çorba, Ana Yemek vb.) nesnesini oluşturup birbirine bağlar (addItem).
 * 
 * 5. VERİTABANI KAYDI (DailyMenuRepository & Hibernate):
 *    - 'dailyMenuRepository.save(menu)' çağrılır.
 *    - Hibernate 'daily_menus' tablosuna ana menüyü, 'menu_items' tablosuna 4 yemeği kaydeder (INSERT).
 * 
 * 6. YANIT DÖNÜŞÜ (Backend -> Frontend):
 *    - Kaydolan veri 'MenuResponse' DTO paketine dönüştürülür.
 *    - Controller bu paketi 'HTTP 201 Created' koduyla JSON olarak istemciye (Ahmet'in ekranına) döner.
 * =====================================================================================
 */
