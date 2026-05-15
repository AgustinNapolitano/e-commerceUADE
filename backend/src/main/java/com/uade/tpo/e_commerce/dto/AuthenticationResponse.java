package com.uade.tpo.e_commerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de respuesta para la autenticación.
 * Contiene el Token JWT y datos básicos del usuario para el Frontend.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthenticationResponse {
    
    // El token que el frontend guardará en localStorage
    private String token;
    
    // Rol del usuario (USER o ADMIN) para controlar qué ve en el frontend
    private String role;
    
    // Nombre del usuario para mostrarlo en el Navbar
    private String nombre;
}
