package com.uade.tpo.e_commerce.exception;

import org.springframework.http.HttpStatus;

// Esta es una excepción (Error) personalizada. 
// Hereda de RuntimeException, lo que significa que el programa "choca" limpiamente cuando ocurre un problema de la lógica del negocio
// (Por ejemplo: intentar comprar algo sin stock, o poner una contraseña muy corta).
public class ReglaNegocioException extends RuntimeException {

    // Guarda el código de error HTTP que queremos devolverle al Frontend (ej: 400 Bad Request)
    private final HttpStatus status;

    // Constructor 1: Solo le pasamos el mensaje. Por defecto, asumirá que es un error 400 (Bad Request)
    public ReglaNegocioException(String message) {
        this(message, HttpStatus.BAD_REQUEST);
    }

    // Constructor 2: Le pasamos el mensaje y el código HTTP exacto que queremos devolver
    public ReglaNegocioException(String message, HttpStatus status) {
        super(message); // super() le pasa el mensaje a la clase padre (RuntimeException) para que lo guarde en los logs de Java
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
