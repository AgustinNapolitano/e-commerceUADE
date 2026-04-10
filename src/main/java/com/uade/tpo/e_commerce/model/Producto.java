package com.uade.tpo.e_commerce.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private Integer stock;

    // Muchos productos pertenecen a una categoría
    @ManyToOne
    @JoinColumn(name = "categoria_id")
    private Categoria categoria;
}
