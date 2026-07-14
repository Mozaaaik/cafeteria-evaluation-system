package com.botas.yemekhane_backend.controller;

import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.botas.yemekhane_backend.dto.HealthResponse;

// REST controller sınıfı olduğunu belirtir
@RestController
// Tüm endpoint'ler için "/api" ön ekini tanımlar
@RequestMapping("/api")
public class HealthController {
    // Spring Data MongoDB şablonunu enjekte etmek için kullanılan alan
    private final MongoTemplate mongoTemplate;

    // Constructor tabanlı bağımlılık enjeksiyonu (Dependency Injection)
    public HealthController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    // GET /api/health isteğini karşılayan endpoint
    @GetMapping("/health")
    public ResponseEntity<HealthResponse> health() {
        try {
            // MongoDB bağlantısını test etmek için 'ping' komutu gönderir
            mongoTemplate
                    .getDb()
                    .runCommand(new Document("ping", 1));
            // Bağlantı başarılıysa başarılı durum bilgisini döner
            HealthResponse res = new HealthResponse(
                    "UP",
                    "CONNECTED",
                    mongoTemplate.getDb().getName());
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            // Bağlantı başarısızsa hata durum bilgisini ve 500 hatasını döner
            HealthResponse res = new HealthResponse(
                    "DOWN",
                    "DISCONNECTED",
                    mongoTemplate.getDb().getName());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(res);
        }
    }
}
