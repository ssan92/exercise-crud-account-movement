package com.upgrade.senior.exception;

public class GeneralException extends RuntimeException {
    private final int statusCode;

    public GeneralException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
