package com.uade.tpo.e_commerce.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.e_commerce.model.Categoria;
import com.uade.tpo.e_commerce.service.CategoriaService;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    // GET http://localhost:8080/api/categorias
    @GetMapping
    public List<Categoria> getAllCategorias() {
        return categoriaService.getAllCategorias();
    }

    // GET http://localhost:8080/api/categorias/1
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> getCategoriaById(@PathVariable Long id) {
        Categoria categoria = categoriaService.getCategoriaById(id);
        if (categoria == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(categoria);
    }

    // POST http://localhost:8080/api/categorias
    @PostMapping
    public ResponseEntity<Categoria> createCategoria(@RequestBody Categoria categoria) {
        Categoria nueva = categoriaService.createCategoria(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
    }

    // PUT http://localhost:8080/api/categorias/1
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> updateCategoria(@PathVariable Long id, @RequestBody Categoria categoria) {
        Categoria actualizada = categoriaService.updateCategoria(id, categoria);
        return ResponseEntity.ok(actualizada);
    }

    // DELETE http://localhost:8080/api/categorias/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategoria(@PathVariable Long id) {
        categoriaService.deleteCategoriaById(id);
        return ResponseEntity.noContent().build();
    }
}
