package com.uade.tpo.e_commerce.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class UsuarioRequest {
    private String nombreUsuario;
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private LocalDate fechaNacimiento;
    private String sexo;
}
