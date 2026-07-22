package com.botas.yemekhane.menu.dto;

import java.time.LocalDate;
import java.util.List;

import com.botas.yemekhane.menu.domain.DailyMenu;

/*
 * Bu record, bir günlük menünün frontend'e gönderilecek halidir.
 *
 * Veritabanındaki DailyMenu entity nesnesini doğrudan dışarı göndermek yerine
 * MenuResponse kullanırız. Böylece frontend'e yalnızca ihtiyaç duyduğu
 * bilgileri göndeririz.
 *
 * "record" kullandığımız için Java;
 * - alanları,
 * - constructor'ı,
 * - id(), menuDate() ve items() erişim metotlarını
 * otomatik olarak oluşturur.
 */
public record MenuResponse(
        // Günlük menünün veritabanındaki benzersiz kimliği
        Long id,

        // Menünün ait olduğu tarih (örnek: 2026-07-21)
        LocalDate menuDate,

        // Menüdeki yemeklerin frontend'e gönderilecek DTO listesi
        List<MenuItemResponse> items
) {

    /*
     * Veritabanından gelen DailyMenu entity nesnesini MenuResponse DTO'suna
     * dönüştüren metottur.
     *
     * "static" olduğu için bu metodu çağırmadan önce MenuResponse nesnesi
     * oluşturmamız gerekmez. Şöyle çağırabiliriz:
     *
     * MenuResponse response = MenuResponse.fromDailyMenu(menu);
     */
    public static MenuResponse fromDailyMenu(
            DailyMenu menu
    ) {
        /*
         * menu.getItems() bize List<MenuItem> verir.
         * Fakat response içerisinde List<MenuItemResponse> kullanıyoruz.
         * Bu nedenle her MenuItem nesnesini MenuItemResponse'a dönüştürüyoruz.
         *
         * stream() : Listedeki elemanları sırayla işlemeye başlar.
         * map(...) : Her MenuItem'ı bir MenuItemResponse'a dönüştürür.
         * toList()  : Dönüştürülen elemanları yeni bir listede toplar.
         *
         * MenuItemResponse::fromMenuItem yazımı aşağıdaki lambda ifadesinin
         * kısa halidir:
         *
         * item -> MenuItemResponse.fromMenuItem(item)
         */
        List<MenuItemResponse> itemResponses =
                menu.getItems()
                        .stream()
                        .map(MenuItemResponse::fromMenuItem)
                        .toList();

        /*
         * DailyMenu'den aldığımız bilgilerle frontend'e gönderilecek yeni
         * MenuResponse nesnesini oluşturup geri döndürüyoruz.
         *
         * Controller bu nesneyi döndürdüğünde Spring onu otomatik olarak
         * JSON formatına çevirir.
         */
        return new MenuResponse(
                // DailyMenu nesnesinin id değeri
                menu.getId(),

                // DailyMenu nesnesinin tarih değeri
                menu.getMenuDate(),

                // Yukarıda dönüştürdüğümüz yemek DTO'larının listesi
                itemResponses
        );
    }
}
