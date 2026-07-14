package com.botas.yemekhane_backend.dto;

/*
 * Bu DTO, health endpoint'inin dışarıya döndüreceği cevabı taşır.
 *
 * MongoDB'ye veri kaydetmez.
 * Sadece backend, MongoDB bağlantısı ve veritabanı adı
 * bilgilerini JSON cevabı olarak göndermek için kullanılır.
 */

public record HealthResponse(
        String status,
        String database,
        String databaseName) {
}
