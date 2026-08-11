package com.botas.yemekhane.evaluation.dto;
import java.time.LocalDate;
public record WeeklyReportResponse(LocalDate weekStart, LocalDate weekEnd, long totalVotes, double averageStars) {}
