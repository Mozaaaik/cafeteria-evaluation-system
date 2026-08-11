package com.botas.yemekhane.evaluation.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.*;
import org.junit.jupiter.api.Test;
import com.botas.yemekhane.evaluation.dto.*;
import com.botas.yemekhane.evaluation.repository.MenuEvaluationRepository;
import com.botas.yemekhane.menu.domain.DailyMenu;
import com.botas.yemekhane.menu.repository.DailyMenuRepository;
import com.botas.yemekhane.user.domain.User;
import com.botas.yemekhane.user.service.UserService;

class EvaluationServiceTest {
    private final MenuEvaluationRepository evaluations = mock(MenuEvaluationRepository.class);
    private final DailyMenuRepository menus = mock(DailyMenuRepository.class);
    private final UserService users = mock(UserService.class);
    private final EvaluationService service = new EvaluationService(evaluations, menus, users);

    @Test void rejectsRatingForItemOutsideMenu() {
        DailyMenu menu = mock(DailyMenu.class);
        User user = mock(User.class);
        when(menu.getItems()).thenReturn(List.of());
        when(menus.findById(9L)).thenReturn(Optional.of(menu));
        when(users.getUserByUsername("personel")).thenReturn(user);
        var request = new UpsertEvaluationRequest(List.of(new RatingRequest(99L, 5)), "yorum");
        assertThrows(IllegalArgumentException.class, () -> service.upsert(9L, request, "personel"));
        verify(evaluations, never()).save(any());
    }
}
