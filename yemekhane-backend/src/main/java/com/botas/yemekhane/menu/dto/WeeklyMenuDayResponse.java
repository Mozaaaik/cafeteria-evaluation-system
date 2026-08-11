package com.botas.yemekhane.menu.dto;

import java.time.LocalDate;

public record WeeklyMenuDayResponse(LocalDate date, MenuResponse menu) {}
