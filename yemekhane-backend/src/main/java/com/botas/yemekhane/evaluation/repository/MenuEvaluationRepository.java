package com.botas.yemekhane.evaluation.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.botas.yemekhane.evaluation.domain.MenuEvaluation;

public interface MenuEvaluationRepository extends JpaRepository<MenuEvaluation, Long> {
    Optional<MenuEvaluation> findByMenuIdAndUserId(Long menuId, Long userId);
    List<MenuEvaluation> findAllByMenuId(Long menuId);
    List<MenuEvaluation> findAllByMenuMenuDateBetween(LocalDate start, LocalDate end);
}
