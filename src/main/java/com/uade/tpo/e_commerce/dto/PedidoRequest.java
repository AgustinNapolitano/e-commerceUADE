package com.uade.tpo.e_commerce.dto;

import lombok.Data;
import java.util.List;

@Data
public class PedidoRequest {
    private Long usuarioId;
    private List<ItemPedidoRequest> items;

    @Data
    public static class ItemPedidoRequest {
        private Long productoId;
        private Integer cantidad;
    }
}
