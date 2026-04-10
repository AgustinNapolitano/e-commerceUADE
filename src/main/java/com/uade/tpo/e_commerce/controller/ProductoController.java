package com.uade.tpo.e_commerce.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.e_commerce.dto.ProductoRequest;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.service.ProductoService;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    // GET http://localhost:8080/api/productos
    @GetMapping
    public List<Producto> getAllProductos() {
        return productoService.getAllProductos();
    }

    // GET http://localhost:8080/api/productos/1
    @GetMapping("/{id}")
    public ResponseEntity<Producto> getProductoById(@PathVariable Long id) {
        Producto producto = productoService.getProductoById(id);
        if (producto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(producto);
    }

    // POST http://localhost:8080/api/productos
    @PostMapping
    public ResponseEntity<Producto> createProducto(@RequestBody ProductoRequest request) {
        Producto nuevo = productoService.createProducto(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    // PUT http://localhost:8080/api/productos/1
    @PutMapping("/{id}")
    public ResponseEntity<Producto> updateProducto(@PathVariable Long id, @RequestBody ProductoRequest request) {
        Producto actualizado = productoService.updateProducto(id, request);
        return ResponseEntity.ok(actualizado);
    }

    // DELETE http://localhost:8080/api/productos/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        productoService.deleteProductoById(id);
        return ResponseEntity.noContent().build();
    }
}
