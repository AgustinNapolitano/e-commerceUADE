package com.uade.tpo.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.uade.tpo.e_commerce.dto.ProductoResponse;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.service.FavoritoService;

@RestController
@RequestMapping("/api/favoritos")
public class FavoritoController {

    @Autowired
    private FavoritoService favoritoService;

    @GetMapping
    public ResponseEntity<List<ProductoResponse>> getFavoritos(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(favoritoService.getFavoritosByUsuarioId(usuario.getId()));
    }

    @PostMapping
    public ResponseEntity<List<ProductoResponse>> addFavorito(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam Long productoId) {
        return ResponseEntity.ok(favoritoService.addFavorito(usuario.getId(), productoId));
    }

    @DeleteMapping("/{productoId}")
    public ResponseEntity<List<ProductoResponse>> removeFavorito(
            @AuthenticationPrincipal Usuario usuario,
            @PathVariable Long productoId) {
        return ResponseEntity.ok(favoritoService.removeFavorito(usuario.getId(), productoId));
    }
}
