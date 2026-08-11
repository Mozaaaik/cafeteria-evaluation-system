package com.botas.yemekhane.evaluation.dto;

import java.util.List;
import com.botas.yemekhane.evaluation.domain.MenuEvaluation;

public record EvaluationResponse(Long id, Long menuId, List<RatingRequest> ratings, String generalComment) {
    public static EvaluationResponse from(MenuEvaluation e) {
        return new EvaluationResponse(e.getId(), e.getMenu().getId(),
                e.getRatings().stream().map(r -> new RatingRequest(r.getMenuItem().getId(), r.getScore())).toList(),
                e.getGeneralComment());
    }
}
