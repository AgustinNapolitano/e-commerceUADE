package com.uade.tpo.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.e_commerce.dto.CarritoRequest;
import com.uade.tpo.e_commerce.dto.CarritoResponse;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.service.CarritoService;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    @GetMapping
    public ResponseEntity<List<CarritoResponse>> getCarrito(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(carritoService.getCarritoByUsuarioId(usuario.getId()));
    }

    @PostMapping
    public ResponseEntity<List<CarritoResponse>> saveCarrito(
            @AuthenticationPrincipal Usuario usuario,
            @RequestBody CarritoRequest request) {
        return ResponseEntity.ok(carritoService.saveCarrito(usuario.getId(), request));
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCarrito(@AuthenticationPrincipal Usuario usuario) {
        carritoService.clearCarrito(usuario.getId());
        return ResponseEntity.noContent().build();
    }
}
