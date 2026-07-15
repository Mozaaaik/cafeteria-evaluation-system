package com.botas.yemekhane.health.controller;

import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.botas.yemekhane.health.dto.HealthResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// REST controller sınıfı olduğunu belirtir
// Bu sınıf HTTP isteklerini karşılayacak ve döndürdüğü Java nesneleri JSON’a çevrilecek.
@RestController
// Tüm endpoint'ler için "/api" ön ekini tanımlar
@RequestMapping("/api")
public class HealthController {

    private static final Logger LOGGER = LoggerFactory.getLogger(HealthController.class);

    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> healthCheck() {

        try {


            // Veritabanına bağlanıp bağlanmadığını kontrol eder.
            // SELECT 1 yollar sonucu INTEGER olarak alır bağlantı kapalıysa hata yollar
            // Başarısız olursa DataAccessException oluşur
            // ve catch bölümüne geçilir.
            jdbcTemplate.queryForObject(
                "SELECT 1",
                Integer.class
            );

            String databaseName = jdbcTemplate.queryForObject(
                "SELECT DATABASE()",
                String.class
            );

            HealthResponse res = new HealthResponse(
                "UP",
                "CONNECTED",
                databaseName
            );

            return ResponseEntity.ok(res);

            /*
                HTTP durum kodu: 200 OK
                Gövde: response nesnesi

                İstenen postman cevabı:

                HTTP 200 OK
                {
                    "status": "UP",
                    "database": "CONNECTED",
                    "databaseName": "yemekhane_db"
                }
            */
            
        } catch (DataAccessException daeErr) { // Spring’in veritabanı işlemleri sırasında oluşan hataları temsil eden genel hata sınıfı

            LOGGER.error(
                "MYSQL health controller failed",
                daeErr
            );

            HealthResponse res = new HealthResponse(
                "DOWN",
                "DISCONNECTED",
                null
            );

            return ResponseEntity.status(503).body(res);
        }
    }
}
