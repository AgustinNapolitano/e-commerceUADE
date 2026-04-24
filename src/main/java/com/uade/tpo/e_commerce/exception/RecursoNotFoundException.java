package com.uade.tpo.e_commerce.exception;

// Esta es una Excepción personalizada súper simple. 
// Se usa (se lanza con "throw new") cuando buscamos en la base de datos por ID (un producto, usuario o categoría) y MySQL no encuentra nada.
// Al lanzarla, nuestro GlobalExceptionHandler la atrapará y devolverá un 404.
public class RecursoNotFoundException extends RuntimeException {

    // El constructor recibe el mensaje (ej: "Producto no encontrado") y se lo pasa a la clase base
    public RecursoNotFoundException(String message) {
        super(message);
    }
}
