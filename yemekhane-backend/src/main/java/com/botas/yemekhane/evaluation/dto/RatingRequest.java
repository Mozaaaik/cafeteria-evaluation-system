package com.botas.yemekhane.evaluation.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RatingRequest(@NotNull Long menuItemId, @Min(1) @Max(5) int score) {}
