package com.botas.yemekhane.menu.dto;

import com.botas.yemekhane.menu.domain.MenuCategory;
import com.botas.yemekhane.menu.domain.MenuItem;

/*
 * İstemciye (Mobil Uygulama / Frontend) tekil bir yemeğin bilgilerini 
 * göndermek için kullanılan DTO (Data Transfer Object) record yapısıdır.
 * 
 * --- NEDEN RECORD VE DTO KULLANIYORUZ? ---
 * 1. Güvenlik ve Temizlik: Veritabanı varlığı olan 'MenuItem' entity nesnesini 
 *    doğrudan dışarı açmayız (içinde createdAt, updatedAt, menu gibi gereksiz veya gizli veriler olabilir).
 * 2. Java Record Yapısı: Java 14+ ile gelen 'record', yalnızca veri taşımak için 
 *    tasarlanmış değiştirilemez (immutable) ve hafif bir sınıf türüdür.
 * 
 * --- FRONTEND'E DÖNECEK JSON ÖRNEĞİ ---
 * {
 *   "id": 101,
 *   "category": "SOUP",
 *   "name": "Ezogelin Çorbası",
 *   "displayOrder": 1
 * }
 */
public record MenuItemResponse(
        Long id,
        MenuCategory category,
        String name,
        int displayOrder
) {

    /*
     * Veritabanından çekilen 'MenuItem' (Entity) nesnesini 
     * dışarıya gönderilecek 'MenuItemResponse' (DTO) nesnesine dönüştüren 
     * mapper (dönüştürücü) metodudur.
     */
    public static MenuItemResponse fromMenuItem(
            MenuItem item
    ) {
        return new MenuItemResponse(
                item.getId(),
                item.getCategory(),
                item.getName(),
                item.getDisplayOrder()
        );
    }
}