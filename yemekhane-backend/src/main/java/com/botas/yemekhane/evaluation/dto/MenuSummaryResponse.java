package com.botas.yemekhane.evaluation.dto;
import java.util.List;
public record MenuSummaryResponse(Long menuId, List<MealSummaryResponse> meals) {}
