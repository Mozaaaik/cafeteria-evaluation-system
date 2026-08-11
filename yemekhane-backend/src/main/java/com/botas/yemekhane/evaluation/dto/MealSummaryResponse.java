package com.botas.yemekhane.evaluation.dto;

import com.botas.yemekhane.menu.domain.MenuCategory;

public record MealSummaryResponse(
        Long menuItemId,
        String mealName,
        MenuCategory category,
        long totalVotes,
        double averageStars
) {}
