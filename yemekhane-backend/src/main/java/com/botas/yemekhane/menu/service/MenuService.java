package com.botas.yemekhane.menu.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.botas.yemekhane.menu.domain.DailyMenu;
import com.botas.yemekhane.menu.domain.MenuCategory;
import com.botas.yemekhane.menu.domain.MenuItem;
import com.botas.yemekhane.menu.dto.CreateMenuRequest;
import com.botas.yemekhane.menu.dto.MenuResponse;
import com.botas.yemekhane.menu.dto.UpdateMenuRequest;
import com.botas.yemekhane.menu.dto.WeeklyMenuDayResponse;
import com.botas.yemekhane.menu.exception.MenuDateAlreadyExistsException;
import com.botas.yemekhane.menu.exception.MenuNotFoundException;
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

    /*
     * VERİLEN TARİHE AİT MENÜYÜ GETİRİR
     *
     * readOnly = true:
     * Bu işlem yalnızca SELECT sorgusu çalıştırır; veritabanında değişiklik
     * yapmayacağını Spring/Hibernate'e bildirir.
     *
     * Repository Optional döndürür. Menü bulunamazsa null döndürmek yerine
     * Optional.empty() korunur; menünün bulunamadığına hangi HTTP cevabının
     * verileceğine Controller karar verir.
     */
    @Transactional(readOnly = true)
    public java.util.Optional<MenuResponse> getMenuByDate(LocalDate menuDate) {
        return dailyMenuRepository
                .findByMenuDate(menuDate)
                /*
                 * DailyMenu entity'sini frontend'e doğrudan açmıyoruz.
                 * MenuResponse DTO'suna çevirerek yalnızca id, tarih ve
                 * yemek listesini gönderiyoruz.
                 */
                .map(MenuResponse::fromDailyMenu);
    }

    /*
     * HAFTALIK / TARİH ARALIĞINDAKİ MENÜLERİ GETİRİR
     *
     * Repository'den gelen List<DailyMenu> entity listesindeki her elemanı
     * frontend'e uygun MenuResponse DTO'suna dönüştürür.
     * Hiç menü yoksa hata yerine boş JSON listesi ([]) döner.
     */
    @Transactional(readOnly = true)
    public List<MenuResponse> getMenusBetween(
            LocalDate startDate,
            LocalDate endDate
    ) {
        return dailyMenuRepository
                .findAllByMenuDateBetweenOrderByMenuDateAsc(startDate, endDate)
                .stream()
                .map(MenuResponse::fromDailyMenu)
                .toList();
    }

    @Transactional(readOnly = true)
    public MenuResponse getMenu(Long menuId) {
        return dailyMenuRepository.findById(menuId).map(MenuResponse::fromDailyMenu)
                .orElseThrow(() -> new MenuNotFoundException(menuId));
    }

    @Transactional(readOnly = true)
    public List<WeeklyMenuDayResponse> getWeek(LocalDate weekStart) {
        if (weekStart.getDayOfWeek() != java.time.DayOfWeek.MONDAY) {
            throw new IllegalArgumentException("weekStart pazartesi olmalıdır.");
        }
        LocalDate weekEnd = weekStart.plusDays(4);
        java.util.Map<LocalDate, MenuResponse> menus = getMenusBetween(weekStart, weekEnd).stream()
                .collect(java.util.stream.Collectors.toMap(MenuResponse::menuDate, value -> value));
        return java.util.stream.IntStream.range(0, 5)
                .mapToObj(day -> { LocalDate date = weekStart.plusDays(day); return new WeeklyMenuDayResponse(date, menus.get(date)); })
                .toList();
    }

    @Transactional
    public MenuResponse updateMenu(Long menuId, UpdateMenuRequest request) {
        DailyMenu menu = dailyMenuRepository.findById(menuId).orElseThrow(() -> new MenuNotFoundException(menuId));
        if (dailyMenuRepository.existsByMenuDateAndIdNot(request.menuDate(), menuId)) {
            throw new MenuDateAlreadyExistsException(request.menuDate());
        }
        menu.updateMenuDate(request.menuDate());
        menu.updateItemName(MenuCategory.SOUP, normalizeName(request.soup()));
        menu.updateItemName(MenuCategory.MAIN_COURSE, normalizeName(request.mainCourse()));
        menu.updateItemName(MenuCategory.SIDE_DISH, normalizeName(request.sideDish()));
        menu.updateItemName(MenuCategory.DESSERT_OR_FRUIT, normalizeName(request.dessertOrFruit()));
        return MenuResponse.fromDailyMenu(dailyMenuRepository.save(menu));
    }

    @Transactional
    public void deleteMenu(Long menuId) {
        DailyMenu menu = dailyMenuRepository.findById(menuId).orElseThrow(() -> new MenuNotFoundException(menuId));
        dailyMenuRepository.delete(menu);
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
