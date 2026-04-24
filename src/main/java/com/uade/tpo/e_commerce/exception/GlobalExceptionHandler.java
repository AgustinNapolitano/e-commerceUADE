package com.uade.tpo.e_commerce.exception;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.uade.tpo.e_commerce.dto.ErrorResponse;

// @RestControllerAdvice es como un "Malla de seguridad" que envuelve a todos los controladores (Controller).
// Si algún controlador de tu programa "falla" o lanza una Exception, esta clase la atrapa antes de que le llegue un error feo al usuario
// y lo transforma en un JSON bonito (ErrorResponse).
@RestControllerAdvice
public class GlobalExceptionHandler {

    // @ExceptionHandler le dice a Spring: "Si alguien lanza un RecursoNotFoundException en CUALQUIER parte del programa, ven a ejecutar este método"
    @ExceptionHandler(RecursoNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(RecursoNotFoundException ex) {
        // Armamos el JSON de error con la fecha actual, el código 404 y el mensaje personalizado
        ErrorResponse body = new ErrorResponse(
                Instant.now(),
                HttpStatus.NOT_FOUND.value(),
                HttpStatus.NOT_FOUND.getReasonPhrase(),
                ex.getMessage()
        );

        // Devolvemos el error HTTP 404 (Not Found)
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    // Atrapa los errores de negocio (ReglaNegocioException) como "Sin stock" o "Email ya registrado"
    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<ErrorResponse> handleReglaNegocio(ReglaNegocioException ex) {
        HttpStatus status = ex.getStatus();

        ErrorResponse body = new ErrorResponse(
                Instant.now(),
                status.value(),
                status.getReasonPhrase(),
                ex.getMessage()
        );

        return ResponseEntity.status(status).body(body);
    }

    // El último escudo: Si falla algo que no teníamos previsto (Ejemplo: se cae la base de datos MySQL, un error interno), 
    // lo atrapamos aquí (Exception.class) para que el servidor no explote y le devolvemos un 500 elegante.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        ErrorResponse body = new ErrorResponse(
                Instant.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                ex.getMessage()
        );

        // Devolvemos el error HTTP 500 (Internal Server Error)
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}