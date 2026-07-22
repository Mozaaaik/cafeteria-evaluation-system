package com.botas.yemekhane.menu.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/*
 * Admin menü ekleme ekranından gelen bilgileri taşır.
 */
public record CreateMenuRequest(

        @NotNull(message = "Menü tarihi boş bırakılamaz.")
        LocalDate menuDate,

        @NotBlank(message = "Çorba adı boş bırakılamaz.")
        @Size(
                max = 100,
                message = "Çorba adı en fazla 100 karakter olabilir."
        )
        String soup,

        @NotBlank(message = "Ana yemek adı boş bırakılamaz.")
        @Size(
                max = 100,
                message = "Ana yemek adı en fazla 100 karakter olabilir."
        )
        String mainCourse,

        @NotBlank(message = "Yardımcı yemek adı boş bırakılamaz.")
        @Size(
                max = 100,
                message = "Yardımcı yemek adı en fazla 100 karakter olabilir."
        )
        String sideDish,

        @NotBlank(message = "Tatlı veya meyve boş bırakılamaz.")
        @Size(
                max = 100,
                message = "Tatlı veya meyve en fazla 100 karakter olabilir."
        )
        String dessertOrFruit

) {
}

/*
        Frontend bu jsonu döndürecek:
        {
        "menuDate": "2026-07-21",
        "soup": "Ezogelin",
        "mainCourse": "Et",
        "sideDish": "Makarna",
        "dessertOrFruit": "Karpuz"
        }
*/