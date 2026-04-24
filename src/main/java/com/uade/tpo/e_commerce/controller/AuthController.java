package com.uade.tpo.e_commerce.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.e_commerce.dto.AuthenticationResponse;
import com.uade.tpo.e_commerce.dto.LoginRequest;
import com.uade.tpo.e_commerce.dto.UsuarioRequest;
import com.uade.tpo.e_commerce.service.AuthenticationService;
import lombok.RequiredArgsConstructor;

// @RestController indica que esta clase responderá peticiones web (HTTP) devolviendo datos en formato JSON
@RestController
// @RequestMapping define que todas las rutas aquí adentro empezarán con "/api/auth"
@RequestMapping("/api/auth")
// Inyecta automáticamente los servicios que pongamos como "final"
@RequiredArgsConstructor
public class AuthController {

    // Llama a la capa de servicio que tiene la lógica del negocio
    private final AuthenticationService authenticationService;

    // Ruta pública para registrarse. Se accede con: POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody UsuarioRequest request) {
        // Ejecuta el registro y, si todo sale bien, devuelve un código 201 (CREATED) y el Token JWT generado
        return ResponseEntity.status(HttpStatus.CREATED).body(authenticationService.register(request));
    }

    // Ruta pública para iniciar sesión. Se accede con: POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody LoginRequest request) {
        // Ejecuta la validación de credenciales. Si está todo OK, devuelve 200 (OK) y el Token JWT
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}

