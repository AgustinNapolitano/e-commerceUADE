package com.uade.tpo.e_commerce.model;

import jakarta.persistence.*;
import lombok.Data;

// @Data es de Lombok. Crea todos los "Getters", "Setters" y el Constructor automáticamente para no escribir código basura
@Data
// @Entity le dice a Spring que esta clase no es normal, sino que representa una tabla en MySQL
@Entity
// @Table especifica el nombre exacto que tendrá la tabla en MySQL
@Table(name = "productos")
public class Producto {

    // @Id le dice a MySQL que esta es la "Llave Primaria" (Primary Key)
    @Id
    // @GeneratedValue hace que MySQL invente el ID automáticamente (Auto-Incremental) 1, 2, 3...
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // @Column define que este campo es una columna que no puede estar vacía (NOT NULL)
    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private Integer stock;

    private String imageUrl;

    // @ManyToOne indica que "Muchos" productos pueden pertenecer "A Una" misma categoría
    @ManyToOne
    // @JoinColumn crea la columna que guarda el número de ID de la categoría (Llave Foránea)
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
}
