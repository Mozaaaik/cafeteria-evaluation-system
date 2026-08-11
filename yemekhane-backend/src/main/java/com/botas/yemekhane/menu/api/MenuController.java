package com.botas.yemekhane.menu.api;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.botas.yemekhane.menu.dto.MenuResponse;
import com.botas.yemekhane.menu.dto.WeeklyMenuDayResponse;
import com.botas.yemekhane.menu.service.MenuService;
import com.botas.yemekhane.evaluation.service.EvaluationService;
import org.springframework.security.core.Authentication;

/*
 * PERSONEL VE ADMIN İÇİN MENÜ OKUMA ENDPOINT'LERİ
 *
 * AdminMenuController yalnızca menü kaydetme işlemini yapıyordu.
 * Frontend ise bugünün menüsünü göstermek için GET /api/menus/today
 * adresine istek gönderiyor. Bu controller o eksik okuma kapısını sağlar.
 *
 * SecurityConfig içindeki "/api/menus/**" kuralına göre hem USER hem de
 * ADMIN rolündeki doğrulanmış kullanıcılar bu endpoint'lere erişebilir.
 */
@RestController
@RequestMapping("/api/menus")
public class MenuController {

    private final MenuService menuService;
    private final EvaluationService evaluationService;

    /* Spring, MenuService nesnesini constructor injection ile verir. */
    public MenuController(MenuService menuService, EvaluationService evaluationService) {
        this.menuService = menuService;
        this.evaluationService = evaluationService;
    }

    /*
     * GET /api/menus/today
     *
     * 1. Sunucunun bugünkü tarihini LocalDate.now() ile alır.
     * 2. MenuService üzerinden o tarihteki menüyü veritabanında arar.
     * 3. Menü varsa HTTP 200 + MenuResponse JSON döndürür.
     * 4. Menü yoksa HTTP 404 döndürür.
     */
    @GetMapping("/today")
    public ResponseEntity<MenuResponse> getTodayMenu(Authentication authentication) {
        LocalDate today = LocalDate.now();

        return menuService.getMenuByDate(today)
                .map(menu -> ResponseEntity.ok(evaluationService.menuWithRatings(menu.id(), authentication.getName())))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /*
     * GET /api/menus/date/2026-07-22
     *
     * Admin ekranında tarih değiştirildiğinde o güne daha önce menü girilip
     * girilmediğini kontrol etmek için kullanılır.
     */
    @GetMapping("/date/{menuDate}")
    public ResponseEntity<MenuResponse> getMenuByDate(
            @PathVariable
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate menuDate
    ) {
        return menuService
                .getMenuByDate(menuDate)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /*
     * GET /api/menus?startDate=2026-07-20&endDate=2026-07-24
     *
     * Haftalık ekran başlangıç ve bitiş tarihlerini query parameter olarak
     * gönderir. Spring bu YYYY-MM-DD metinlerini LocalDate'e çevirir.
     * Service, aralıktaki menüleri tarih sırasıyla getirir ve HTTP 200 ile
     * JSON listesi olarak frontend'e yollar.
     */
    @GetMapping
    public ResponseEntity<List<MenuResponse>> getMenusBetween(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {
        List<MenuResponse> menus = menuService.getMenusBetween(
                startDate,
                endDate
        );

        return ResponseEntity.ok(menus);
    }

    @GetMapping("/week")
    public ResponseEntity<List<WeeklyMenuDayResponse>> getWeek(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart
    ) {
        return ResponseEntity.ok(menuService.getWeek(weekStart));
    }

    @GetMapping("/{menuId}")
    public ResponseEntity<MenuResponse> getMenu(
            @PathVariable Long menuId,
            Authentication authentication
    ) {
        if (authentication != null) {
            return ResponseEntity.ok(evaluationService.menuWithRatings(menuId, authentication.getName()));
        }
        return ResponseEntity.ok(menuService.getMenu(menuId));
    }
}
