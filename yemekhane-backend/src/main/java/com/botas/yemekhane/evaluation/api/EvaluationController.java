package com.botas.yemekhane.evaluation.api;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.botas.yemekhane.evaluation.dto.*;
import com.botas.yemekhane.evaluation.service.EvaluationService;
import jakarta.validation.Valid;
@RestController @RequestMapping("/api/evaluations/menus")
public class EvaluationController {
    private final EvaluationService service;
    public EvaluationController(EvaluationService service) { this.service = service; }
    @PutMapping("/{menuId}")
    public EvaluationResponse upsert(@PathVariable Long menuId, @Valid @RequestBody UpsertEvaluationRequest request,
                                     Authentication authentication) {
        return service.upsert(menuId, request, authentication.getName());
    }
}
