package com.botas.yemekhane.menu.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.botas.yemekhane.menu.domain.DailyMenu;
import com.botas.yemekhane.menu.domain.MenuCategory;
import com.botas.yemekhane.menu.domain.MenuItem;
import com.botas.yemekhane.menu.dto.CreateMenuRequest;
import com.botas.yemekhane.menu.dto.MenuResponse;
import com.botas.yemekhane.menu.exception.MenuDateAlreadyExistsException;
import com.botas.yemekhane.menu.repository.DailyMenuRepository;
import com.botas.yemekhane.user.domain.User;
import com.botas.yemekhane.user.service.UserService;

/*
 * İŞ KURALLARI KATMANI (Service Layer).
 * 
 * --- BU SINIF NE İŞE YARAR? ---
 * Günlük menü oluşturma sürecindeki tüm kontrol, kural ve veritabanı kayıt 
 * adımlarını yöneten beyin sınıfımızdır.
 */
@Service
public class MenuService {

    // Veritabanı işlemleri için gerekli bağımlılıklar (Repository ve UserService)
    private final DailyMenuRepository dailyMenuRepository;
    private final UserService userService;

    // Constructor Injection: Spring Boot bu iki servisi otomatik olarak buraya enjekte eder.
    public MenuService(
            DailyMenuRepository dailyMenuRepository,
            UserService userService
    ) {
        this.dailyMenuRepository = dailyMenuRepository;
        this.userService = userService;
    }

    /*
     * ADMIN TARAFINDAN YENİ GÜNLÜK MENÜ OLUŞTURAN METOT
     * 
     * --- @Transactional Anotasyonu Ne Yapar? ---
     * Bu metodun içindeki tüm veritabanı adımlarını tek bir paket (Transaction) yapar.
     * Örneğin 4 yemekten 3'ü kaydolup 4.sünde bir hata çıkarsa, yapılan TÜM İŞLEMLER
     * otomatik olarak geri alınır (Rollback). Veritabanında yarım kalmış bozuk menü kalmaz.
     */
    @Transactional
    public MenuResponse createMenu(
            CreateMenuRequest request,           // Admin'in ekrandan gönderdiği tarih ve 4 yemek adı (Çorba, Ana Yemek vb.)
            String authenticatedUsername         // İstegi yapan Admin'in JWT token'ından doğrulanan kullanıcı adı
    ) {
        /*
         * ADIM 1: Mükerrer Tarih Kontrolü
         * Veritabanına sorar: "request.menuDate() (Örn: 2026-07-22) için daha önce menü eklenmiş mi?"
         * Eğer eklenmişse (true dönerse), işlemi durdurur ve MenuDateAlreadyExistsException fırlatır (HTTP 409 Conflict).
         */
        if (dailyMenuRepository.existsByMenuDate(
                request.menuDate()
        )) {
            throw new MenuDateAlreadyExistsException(
                    request.menuDate()
            );
        }

        /*
         * ADIM 2: Menüyü Oluşturan Admin Kullanıcısını Bulma
         * Güvenlik nedeniyle "Menüyü kim ekliyor?" bilgisi istek paketinden (JSON) alınmaz!
         * Bunun yerine sistemde oturum açmış kullanıcının adı (authenticatedUsername) ile veritabanından Admin nesnesi çekilir.
         */
        User admin = userService.getUserByUsername(
                authenticatedUsername
        );

        /*
         * ADIM 3: Ana Menü (DailyMenu) Nesnesini Oluşturma
         * Tarih ve Admin'in ID'si verilerek henüz boş bir DailyMenu nesnesi başlatılır.
         */
        DailyMenu menu = DailyMenu.create(
                request.menuDate(),
                admin.getId()
        );

        /*
         * ADIM 4: Dört Yemeği (Çorba, Ana Yemek, Yan Yemek, Tatlı/Meyve) Menüye Ekleme
         * 
         * 1. request.soup() -> Çorba adının başındaki/sonundaki boşlukları siler (trim/normalizeName).
         * 2. MenuItem.create(...) -> Kategori SOUP (Çorba) olarak ayarlanır, gösterim sırası (displayOrder = 1) otomatik verilir.
         * 3. menu.addItem(...) -> Çorba hem menünün listesine eklenir hem de yemeğin 'menu' alanına menü nesnesi bağlanır.
         */
        menu.addItem(
                MenuItem.create(
                        MenuCategory.SOUP,
                        normalizeName(request.soup())
                )
        );

        /*
         * Ana Yemeğin eklenmesi (displayOrder = 2 otomatik atanır).
         */
        menu.addItem(
                MenuItem.create(
                        MenuCategory.MAIN_COURSE,
                        normalizeName(request.mainCourse())
                )
        );

        /*
         * Yan Yemeğin (Pilav/Makarna vb.) eklenmesi (displayOrder = 3 otomatik atanır).
         */
        menu.addItem(
                MenuItem.create(
                        MenuCategory.SIDE_DISH,
                        normalizeName(request.sideDish())
                )
        );

        /*
         * Tatlı veya Meyvenin eklenmesi (displayOrder = 4 otomatik atanır).
         */
        menu.addItem(
                MenuItem.create(
                        MenuCategory.DESSERT_OR_FRUIT,
                        normalizeName(request.dessertOrFruit())
                )
        );

        /*
         * ADIM 5: Veritabanına Kaydetme
         * DailyMenu entity sınıfındaki 'cascade = CascadeType.ALL' ayarı sayesinde 
         * 'dailyMenuRepository.save(menu)' yazmamız yeterlidir.
         * Hibernate hem ana menüyü 'daily_menus' tablosuna hem de içindeki 4 yemeği 'menu_items' tablosuna tek hamlede kaydeder.
         */
        DailyMenu savedMenu =
                dailyMenuRepository.save(menu);

        /*
         * ADIM 6: Yanıt Paketi (DTO) Oluşturma ve Döndürme
         * Veritabanına kaydolan 'savedMenu' nesnesini 'MenuResponse' DTO paketine dönüştürür ve Controller'a verir.
         * Controller da bu paketi Frontend'e (JSON olarak) gönderir.
         */
        return MenuResponse.fromDailyMenu(savedMenu);
    }

    /*
     * YARDIMCI METOT: Metin Temizleme
     * Yemek isminin başındaki ve sonundaki gereksiz boşlukları siler (Örn: "  Mercimek  " -> "Mercimek").
     */
    private String normalizeName(String name) {
        return name.trim();
    }
}


// Admin JWT
//     ↓
// authenticatedUsername = admin
//     ↓
// UserService admin kullanıcısını bulur
//     ↓
// DailyMenu oluşturulur
//     ↓
// 4 MenuItem eklenir
//     ↓
// dailyMenuRepository.save(menu)
//     ↓
// daily_menus + menu_items kaydedilir