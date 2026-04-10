package com.uade.tpo.e_commerce.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "pedidos")
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Fecha en que se realizó el pedido (se asigna automáticamente)
    @Column(nullable = false)
    private LocalDateTime fecha;

    // Estado: PENDIENTE, CONFIRMADO, ENVIADO, ENTREGADO, CANCELADO
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPedido estado;

    // Muchos pedidos pertenecen a un usuario
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Un pedido tiene muchos items (líneas de pedido)
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<ItemPedido> items;

    // Total calculado del pedido
    private Double total;

    @PrePersist
    public void prePersist() {
        this.fecha = LocalDateTime.now();
        if (this.estado == null) {
            this.estado = EstadoPedido.PENDIENTE;
        }
    }
}
