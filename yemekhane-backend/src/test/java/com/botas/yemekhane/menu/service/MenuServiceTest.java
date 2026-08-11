package com.botas.yemekhane.menu.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;
import com.botas.yemekhane.menu.repository.DailyMenuRepository;
import com.botas.yemekhane.user.service.UserService;

class MenuServiceTest {
    private final DailyMenuRepository repository = mock(DailyMenuRepository.class);
    private final MenuService service = new MenuService(repository, mock(UserService.class));

    @Test void weeklyResponseAlwaysContainsMondayThroughFriday() {
        LocalDate monday = LocalDate.of(2026, 7, 20);
        when(repository.findAllByMenuDateBetweenOrderByMenuDateAsc(monday, monday.plusDays(4))).thenReturn(List.of());
        var result = service.getWeek(monday);
        assertEquals(5, result.size());
        assertEquals(monday, result.getFirst().date());
        assertNull(result.getFirst().menu());
        assertEquals(monday.plusDays(4), result.getLast().date());
    }

    @Test void weekStartMustBeMonday() {
        assertThrows(IllegalArgumentException.class, () -> service.getWeek(LocalDate.of(2026, 7, 21)));
    }
}
