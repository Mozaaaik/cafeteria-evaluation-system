package com.botas.yemekhane.user.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.botas.yemekhane.common.exception.InvalidCredentialsException;
import com.botas.yemekhane.user.domain.User;
import com.botas.yemekhane.user.repository.UserRepository;

class UserServiceTest {
    @Test void passwordChangeVerifiesCurrentPasswordAndHashesNewPassword() {
        UserRepository repository = mock(UserRepository.class);
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        User user = User.builder().username("personel").passwordHash("old-hash").build();
        when(repository.findByUsername("personel")).thenReturn(Optional.of(user));
        when(encoder.matches("old-password", "old-hash")).thenReturn(true);
        when(encoder.encode("new-password")).thenReturn("new-hash");
        new UserService(repository, encoder).changePassword("PERSONEL", "old-password", "new-password");
        assertEquals("new-hash", user.getPasswordHash());
    }

    @Test void passwordChangeRejectsWrongCurrentPassword() {
        UserRepository repository = mock(UserRepository.class);
        PasswordEncoder encoder = mock(PasswordEncoder.class);
        User user = User.builder().username("personel").passwordHash("old-hash").build();
        when(repository.findByUsername("personel")).thenReturn(Optional.of(user));
        assertThrows(InvalidCredentialsException.class,
                () -> new UserService(repository, encoder).changePassword("personel", "wrong", "new-password"));
    }
}
