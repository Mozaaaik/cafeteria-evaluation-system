/*
 * Bu sınıf, MySQL'deki users tablosunda tutulacak
 * kullanıcı verisini temsil eder.
 *
 * Alanlar:
 * - id: MySQL tarafından oluşturulan benzersiz kimlik.
 * - fullName: Kullanıcının görünen ad ve soyadı.
 * - username: Kullanıcının sisteme girişte kullanacağı ad.
 * - passwordHash: Açık şifre değil, BCrypt ile hashlenmiş şifre.
 * - role: Kullanıcının ADMIN veya USER rolü.
 * - active: Hesabın kullanılabilir durumda olup olmadığı.
 * - createdAt: Kullanıcının oluşturulduğu UTC zamanı.
 * - updatedAt: Kullanıcının son güncellendiği UTC zamanı.
 *
 * Bu sınıf API DTO'su değildir.
 * Doğrudan MySQL'e kaydedilecek domain modelidir.
 */

package com.botas.yemekhane.user.domain;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private Long id;

    private String fullName;

    private String username;

    private String passwordHash;

    private Role role;

    private Boolean active;

    private Instant createdAt;

    private Instant updatedAt;
}
