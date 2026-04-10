package com.uade.tpo.e_commerce.exception;

import org.springframework.http.HttpStatus;

public class ReglaNegocioException extends RuntimeException {

    private final HttpStatus status;

    public ReglaNegocioException(String message) {
        this(message, HttpStatus.BAD_REQUEST);
    }

    public ReglaNegocioException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
