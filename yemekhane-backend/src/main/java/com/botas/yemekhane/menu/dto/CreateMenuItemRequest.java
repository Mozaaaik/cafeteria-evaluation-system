package com.botas.yemekhane.menu.dto;

import com.botas.yemekhane.menu.domain.MenuCategory;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Yeni bir günlük menü eklenirken menü içindeki her bir yemeğe ait bilgileri taşıyan DTO record'u.
 *
 * @param category     Yemek kategorisi (SOUP, MAIN_COURSE, SIDE_DISH, DESSERT_OR_FRUIT)
 * @param name         Yemeğin adı (Örn: "Mercimek Çorbası")
 * @param displayOrder Ekranda gösterim sırası (1, 2, 3, 4)
 */
public record CreateMenuItemRequest(

        @NotNull(message = "Yemek kategorisi boş bırakılamaz.")
        MenuCategory category,

        @NotBlank(message = "Yemek adı boş bırakılamaz.")
        @Size(min = 2, max = 100, message = "Yemek adı en az 2, en fazla 100 karakter olmalıdır.")
        String name,

        @NotNull(message = "Gösterim sırası boş bırakılamaz.")
        @Min(value = 1, message = "Gösterim sırası en az 1 olmalıdır.")
        Integer displayOrder
) {
}
