package com.botas.yemekhane.evaluation.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.botas.yemekhane.evaluation.domain.*;
import com.botas.yemekhane.evaluation.dto.*;
import com.botas.yemekhane.evaluation.repository.MenuEvaluationRepository;
import com.botas.yemekhane.evaluation.exception.EvaluationAlreadyExistsException;
import com.botas.yemekhane.menu.dto.MenuItemResponse;
import com.botas.yemekhane.menu.dto.MenuResponse;
import com.botas.yemekhane.menu.domain.DailyMenu;
import com.botas.yemekhane.menu.domain.MenuItem;
import com.botas.yemekhane.menu.exception.MenuNotFoundException;
import com.botas.yemekhane.menu.repository.DailyMenuRepository;
import com.botas.yemekhane.user.domain.User;
import com.botas.yemekhane.user.service.UserService;

@Service
public class EvaluationService {
    private final MenuEvaluationRepository repository;
    private final DailyMenuRepository menuRepository;
    private final UserService userService;
    public EvaluationService(MenuEvaluationRepository repository, DailyMenuRepository menuRepository, UserService userService) {
        this.repository = repository; this.menuRepository = menuRepository; this.userService = userService;
    }

    @Transactional
    public EvaluationResponse upsert(Long menuId, UpsertEvaluationRequest request, String username) {
        DailyMenu menu = menuRepository.findById(menuId).orElseThrow(() -> new MenuNotFoundException(menuId));
        User user = userService.getUserByUsername(username);
        Map<Long, MenuItem> menuItems = new HashMap<>();
        menu.getItems().forEach(i -> menuItems.put(i.getId(), i));
        Set<Long> seen = new HashSet<>();
        List<MealRating> ratings = request.ratings().stream().map(r -> {
            if (!seen.add(r.menuItemId())) throw new IllegalArgumentException("Aynı yemek birden fazla puanlanamaz.");
            MenuItem item = menuItems.get(r.menuItemId());
            if (item == null) throw new IllegalArgumentException("Puanlanan yemek bu menüye ait değil: " + r.menuItemId());
            return MealRating.create(item, r.score());
        }).toList();
        if (repository.findByMenuIdAndUserId(menuId, user.getId()).isPresent()) {
            throw new EvaluationAlreadyExistsException();
        }
        MenuEvaluation evaluation = MenuEvaluation.create(menu, user);
        evaluation.update(request.generalComment(), ratings);
        return EvaluationResponse.from(repository.save(evaluation));
    }

    @Transactional(readOnly = true)
    public MenuResponse menuWithRatings(Long menuId, String username) {
        DailyMenu menu = menuRepository.findById(menuId).orElseThrow(() -> new MenuNotFoundException(menuId));
        User user = userService.getUserByUsername(username);
        List<MenuEvaluation> evaluations = repository.findAllByMenuId(menuId);
        Map<Long, Integer> ownRatings = repository.findByMenuIdAndUserId(menuId, user.getId())
                .map(e -> e.getRatings().stream().collect(java.util.stream.Collectors.toMap(
                        r -> r.getMenuItem().getId(), MealRating::getScore)))
                .orElseGet(Map::of);
        List<MenuItemResponse> items = menu.getItems().stream().map(item -> {
            IntSummaryStatistics stats = evaluations.stream().flatMap(e -> e.getRatings().stream())
                    .filter(r -> r.getMenuItem().getId().equals(item.getId()))
                    .mapToInt(MealRating::getScore).summaryStatistics();
            return MenuItemResponse.withRatings(item, round(stats.getAverage()), stats.getCount(), ownRatings.get(item.getId()));
        }).toList();
        return MenuResponse.of(menu, items);
    }

    @Transactional(readOnly = true)
    public MenuSummaryResponse summary(Long menuId) {
        DailyMenu menu = menuRepository.findById(menuId).orElseThrow(() -> new MenuNotFoundException(menuId));
        List<MealRating> ratings = repository.findAllByMenuId(menuId).stream().flatMap(e -> e.getRatings().stream()).toList();
        List<MealSummaryResponse> meals = menu.getItems().stream().map(item -> {
            IntSummaryStatistics stats = ratings.stream().filter(r -> r.getMenuItem().getId().equals(item.getId()))
                    .mapToInt(MealRating::getScore).summaryStatistics();
            return new MealSummaryResponse(
                    item.getId(),
                    item.getName(),
                    item.getCategory(),
                    stats.getCount(),
                    round(stats.getAverage())
            );
        }).toList();
        return new MenuSummaryResponse(menuId, meals);
    }

    @Transactional(readOnly = true)
    public List<PersonnelCommentResponse> comments(Long menuId) {
        if (!menuRepository.existsById(menuId)) throw new MenuNotFoundException(menuId);
        return repository.findAllByMenuId(menuId).stream().map(e -> new PersonnelCommentResponse(
                e.getUser().getFullName(),
                e.getRatings().stream().map(r -> new CommentRatingResponse(r.getMenuItem().getId(), r.getMenuItem().getName(), r.getScore())).toList(),
                round(e.getRatings().stream().mapToInt(MealRating::getScore).average().orElse(0)), e.getGeneralComment())).toList();
    }

    @Transactional(readOnly = true)
    public WeeklyReportResponse weekly(LocalDate weekStart) {
        requireMonday(weekStart);
        LocalDate end = weekStart.plusDays(4);
        List<MealRating> ratings = repository.findAllByMenuMenuDateBetween(weekStart, end).stream()
                .flatMap(e -> e.getRatings().stream()).toList();
        return new WeeklyReportResponse(weekStart, end, ratings.size(),
                round(ratings.stream().mapToInt(MealRating::getScore).average().orElse(0)));
    }

    private static void requireMonday(LocalDate date) {
        if (date.getDayOfWeek() != DayOfWeek.MONDAY) throw new IllegalArgumentException("weekStart pazartesi olmalıdır.");
    }
    private static double round(double value) { return Math.round(value * 100.0) / 100.0; }
}
