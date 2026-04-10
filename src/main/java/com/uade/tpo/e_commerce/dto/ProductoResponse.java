package com.uade.tpo.e_commerce.dto;

import com.uade.tpo.e_commerce.model.Producto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoResponse {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private Long categoriaId;
    private String categoriaNombre;

    public static ProductoResponse fromEntity(Producto p) {
        if (p == null) {
            return null;
        }
        Long catId = p.getCategoria() != null ? p.getCategoria().getId() : null;
        String catNombre = p.getCategoria() != null ? p.getCategoria().getNombre() : null;
        return new ProductoResponse(
                p.getId(),
                p.getNombre(),
                p.getDescripcion(),
                p.getPrecio(),
                p.getStock(),
                catId,
                catNombre);
    }
}
