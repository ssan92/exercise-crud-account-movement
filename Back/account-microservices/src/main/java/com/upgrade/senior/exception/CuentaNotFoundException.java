package com.upgrade.senior.exception;

public class CuentaNotFoundException extends RuntimeException {
    public CuentaNotFoundException(Long id) {
        super("Cuenta no encontrada con id: " + id);
    }
}
