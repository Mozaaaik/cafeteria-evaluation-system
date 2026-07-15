package com.botas.yemekhane.user.domain;

/*
 * Bu enum, yemekhane sisteminde kullanılabilecek kullanıcı
 * rollerini sınırlandırır.
 *
 * ADMIN:
 * - Menü oluşturabilir, güncelleyebilir ve silebilir.
 * - Haftalık raporları görüntüleyebilir.
 *
 * USER:
 * - Menüleri görüntüleyebilir.
 * - Yemeklere puan verebilir.
 */

public enum Role {
    ADMIN,
    USER
}
