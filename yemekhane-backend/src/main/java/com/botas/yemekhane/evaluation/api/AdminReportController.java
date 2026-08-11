package com.botas.yemekhane.evaluation.api;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import com.botas.yemekhane.evaluation.dto.*;
import com.botas.yemekhane.evaluation.service.EvaluationService;
@RestController @RequestMapping("/api/admin/reports")
public class AdminReportController {
    private final EvaluationService service;
    public AdminReportController(EvaluationService service) { this.service = service; }
    @GetMapping("/menus/{menuId}/summary") public MenuSummaryResponse summary(@PathVariable Long menuId) { return service.summary(menuId); }
    @GetMapping("/menus/{menuId}/comments") public List<PersonnelCommentResponse> comments(@PathVariable Long menuId) { return service.comments(menuId); }
    @GetMapping("/weekly") public WeeklyReportResponse weekly(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate weekStart) { return service.weekly(weekStart); }
}
