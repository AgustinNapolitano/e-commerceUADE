package com.uade.tpo.e_commerce.dto;

import lombok.Data;

// Un DTO (Data Transfer Object) es un objeto simple que sirve como "molde" 
// para recibir los datos en formato JSON que el Frontend (Postman/Web) envía al Backend.
// Usamos DTOs en lugar de usar directamente la clase "Producto" por razones de seguridad
// (para evitar que un hacker intente inyectar IDs o datos sensibles).
@Data
public class ProductoRequest {
    // Estos son exactamente los campos que esperamos recibir cuando alguien hace un POST a /api/productos
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private Long categoriaId; // Solo pedimos el ID de la categoría, no todo el objeto Categoria entero
    private String imageUrl;
}
