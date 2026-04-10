package com.uade.tpo.e_commerce.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "items_pedido")
public class ItemPedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // El pedido al que pertenece este item
    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    // El producto que se pidió
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    // Precio al momento de la compra (puede diferir del precio actual)
    @Column(nullable = false)
    private Double precioUnitario;
}
