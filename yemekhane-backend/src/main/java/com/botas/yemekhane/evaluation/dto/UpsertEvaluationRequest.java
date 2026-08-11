package com.botas.yemekhane.evaluation.dto;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record UpsertEvaluationRequest(
        @NotEmpty @Size(max = 4) List<@Valid RatingRequest> ratings,
        @Size(max = 500) String generalComment
) {}
