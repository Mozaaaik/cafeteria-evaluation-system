package com.botas.yemekhane.menu.exception;

public class MenuNotFoundException extends RuntimeException {
    public MenuNotFoundException(Long id) {
        super("Menü bulunamadı: " + id);
    }
}
