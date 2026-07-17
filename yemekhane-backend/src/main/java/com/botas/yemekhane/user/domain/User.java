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

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users") // User sınıfının MySQL’de hangi tabloya karşılık geldiğini belirtir.
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class User {

    @Id // Bu alanın tablonun primary key alanı olduğunu belirtir.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // MySQL tarafından otomatik artırılan kimlik
    private Long id;


    @Column(
        name = "full_name",
        nullable = false,   // Bu alan boş bırakılamaz.
        length = 100        // Bu alanın maksimum karakter uzunluğu 100'dür.
    )
    private String fullName;


    @Column(
        name = "username",
        nullable = false,
        length = 50,
        unique = true
    )
    private String username;


    @Column(
        name = "password_hash",
        nullable = false,
        length = 255
    )
    private String passwordHash;


    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(
        name = "role",
        nullable = false,
        length = 20
    )
    private Role role = Role.USER; // Varsayılan olarak USER rolü


    @Builder.Default
    @Column(
        name = "active",
        nullable = false
    )
    private Boolean active = true; // Varsayılan olarak aktif


    @CreationTimestamp
    @Column(
        name = "created_at",
        nullable = false,
        updatable = false
    )
    @Setter(AccessLevel.NONE)
    private Instant createdAt;


    @UpdateTimestamp
    @Column(
        name = "updated_at",
        nullable = false
    )
    @Setter(AccessLevel.NONE)
    private Instant updatedAt;
}


/*
    Java tarafında:

User user = User.builder()
        .fullName("Furkan Elidolu")
        .username("furkan")
        .passwordHash("HASH")
        .build();

oluşturduğunda Hibernate bunu MySQL’de yaklaşık olarak şu satıra dönüştürür:

INSERT INTO users (
    full_name,
    username,
    password_hash,
    role,
    active,
    created_at,
    updated_at
)
VALUES (?, ?, ?, ?, ?, ?, ?);
*/