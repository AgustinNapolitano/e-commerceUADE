package com.uade.tpo.e_commerce.dto;

import lombok.Data;

@Data
public class UsuarioRequest {
    private String nombre;
    private String apellido;
    private String email;
    private String password;
}
