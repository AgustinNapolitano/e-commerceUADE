package com.uade.tpo.e_commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CarritoResponse {
    private Long id;
    private String nombre;
    private Double precio;
    private String imagen;
    private Integer cantidad;
}
