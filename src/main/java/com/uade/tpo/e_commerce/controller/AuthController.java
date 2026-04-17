package com.uade.tpo.e_commerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.e_commerce.dto.UsuarioRequest;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.service.AuthenticationService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<Usuario> register(@RequestBody UsuarioRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authenticationService.register(request));
    }
}
