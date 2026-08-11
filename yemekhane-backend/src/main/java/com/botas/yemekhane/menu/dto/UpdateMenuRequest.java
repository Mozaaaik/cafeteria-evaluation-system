package com.botas.yemekhane.menu.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateMenuRequest(
        @NotNull LocalDate menuDate,
        @NotBlank @Size(max = 100) String soup,
        @NotBlank @Size(max = 100) String mainCourse,
        @NotBlank @Size(max = 100) String sideDish,
        @NotBlank @Size(max = 100) String dessertOrFruit
) {}
