package com.upgrade.senior.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import lombok.extern.log4j.Log4j2;

@Log4j2
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ClienteNotFoundException.class)
    public ResponseStatusException handleClienteNotFound(ClienteNotFoundException ex) {
        log.error("ClienteNotFoundException: {}", ex.getMessage(), ex);
        return new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(CuentaNotFoundException.class)
    public ResponseStatusException handleCuentaNotFound(CuentaNotFoundException ex) {
        log.error("CuentaNotFoundException: {}", ex.getMessage(), ex);
        return new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseStatusException handleGenericException(Exception ex) {
        log.error("Generic Exception: {}", ex.getMessage(), ex);
        return new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor: " + ex.getMessage());
    }

    @ExceptionHandler(GeneralException.class)
    public ResponseStatusException handleMovimientoException(GeneralException ex) {
        log.error("MovimientoException: {}", ex.getMessage(), ex);
        return new ResponseStatusException(HttpStatus.valueOf(ex.getStatusCode()), ex.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseStatusException handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        log.error("DataIntegrityViolationException: {}", ex.getMessage(), ex);
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
    }


}
