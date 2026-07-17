package com.botas.yemekhane.health.dto;

/*
 * Bu DTO, health endpoint'inin dışarıya döndüreceği cevabı taşır.
 *
 * MySQL'ye veri kaydetmez.
 * Sadece backend, MySQL bağlantısı ve veritabanı adı
 * bilgilerini JSON cevabı olarak göndermek için kullanılır.
 */

public record HealthResponse(
        String status,            // Uygulamanın genel durumu
        String database,          // MySQL bağlantı durumu
        String databaseName) {   // MySQL veritabanı adı
}
