package com.uade.tpo.e_commerce.dto;

import lombok.Data;
import java.util.List;

@Data
public class CarritoRequest {
    private List<ItemCarritoRequest> items;

    @Data
    public static class ItemCarritoRequest {
        private Long productoId;
        private Integer cantidad;
    }
}
