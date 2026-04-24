package com.uade.tpo.e_commerce.dto;


import java.time.LocalDateTime;
import java.util.List;

import com.uade.tpo.e_commerce.model.EstadoPedido;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PedidoResponse {
    private Long id;
    private Long usuarioId;
    private String emailUsuario;
    private EstadoPedido estado;
    private LocalDateTime fecha;
    private Double total;
    private List<ItemPedidoResponse> items;

    @Data
    @AllArgsConstructor
    public static class ItemPedidoResponse {
        private Long productoId;
        private String nombreProducto;
        private Integer cantidad;
        private Double precioUnitario;
        private Double subtotal;
    }
}
