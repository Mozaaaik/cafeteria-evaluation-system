package com.botas.yemekhane.menu.api;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import com.botas.yemekhane.evaluation.service.EvaluationService;
import com.botas.yemekhane.menu.dto.MenuResponse;
import com.botas.yemekhane.menu.dto.WeeklyMenuDayResponse;
import com.botas.yemekhane.menu.service.MenuService;

class MenuControllerTest {

    private final MenuService menuService = mock(MenuService.class);
    private final EvaluationService evaluationService = mock(EvaluationService.class);
    private final MenuController controller = new MenuController(menuService, evaluationService);

    @Test
    void getWeekReturnsResponseEntityWithList() {
        LocalDate monday = LocalDate.of(2026, 7, 20);
        List<WeeklyMenuDayResponse> expected = List.of(new WeeklyMenuDayResponse(monday, null));
        when(menuService.getWeek(monday)).thenReturn(expected);

        ResponseEntity<List<WeeklyMenuDayResponse>> response = controller.getWeek(monday);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expected, response.getBody());
        verify(menuService).getWeek(monday);
    }

    @Test
    void getMenuWithAuthenticationReturnsMenuWithRatings() {
        Long menuId = 1L;
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("testuser");
        MenuResponse expected = mock(MenuResponse.class);
        when(evaluationService.menuWithRatings(menuId, "testuser")).thenReturn(expected);

        ResponseEntity<MenuResponse> response = controller.getMenu(menuId, authentication);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expected, response.getBody());
        verify(evaluationService).menuWithRatings(menuId, "testuser");
    }

    @Test
    void getMenuWithoutAuthenticationReturnsBasicMenu() {
        Long menuId = 1L;
        MenuResponse expected = mock(MenuResponse.class);
        when(menuService.getMenu(menuId)).thenReturn(expected);

        ResponseEntity<MenuResponse> response = controller.getMenu(menuId, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(expected, response.getBody());
        verify(menuService).getMenu(menuId);
    }
}
