package com.uade.tpo.e_commerce.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.e_commerce.dto.ProductoRequest;
import com.uade.tpo.e_commerce.dto.ProductoResponse;
import com.uade.tpo.e_commerce.service.ProductoService;

// @RestController marca esta clase como un despachador de respuestas JSON para el catálogo
@RestController
// @RequestMapping define que todos los métodos de aquí adentro responden a la URL base "/api/productos"
@RequestMapping("/api/productos")
public class ProductoController {

    // Inyecta el Servicio que contiene la lógica para manejar productos
    @Autowired
    private ProductoService productoService;

    // GET http://localhost:8080/api/productos
    // Devuelve la lista completa de todos los productos de la tienda (ordenados por el Repository)
    @GetMapping
    public List<ProductoResponse> getAllProductos() {
        return productoService.getAllProductos();
    }

    // GET http://localhost:8080/api/productos/1
    // Busca un producto puntual por su número de ID
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> getProductoById(@PathVariable Long id) {
        // Envolvemos la respuesta en un ResponseEntity para dar el código HTTP 200 (OK)
        return ResponseEntity.ok(productoService.getProductoById(id));
    }

    // POST http://localhost:8080/api/productos
    // (Requiere ADMIN) Recibe un JSON (ProductoRequest) y crea un producto nuevo
    @PostMapping
    public ResponseEntity<ProductoResponse> createProducto(@RequestBody ProductoRequest request) {
        ProductoResponse nuevo = productoService.createProducto(request);
        // Retornamos código 201 (CREATED) para avisar que se guardó exitosamente en MySQL
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    // PUT http://localhost:8080/api/productos/1
    // (Requiere ADMIN) Recibe un ID en la URL y un JSON en el cuerpo para sobrescribir los datos
    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponse> updateProducto(@PathVariable Long id, @RequestBody ProductoRequest request) {
        ProductoResponse actualizado = productoService.updateProducto(id, request);
        return ResponseEntity.ok(actualizado);
    }

    // DELETE http://localhost:8080/api/productos/1
    // (Requiere ADMIN) Elimina un producto definitivamente de la base de datos
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        productoService.deleteProductoById(id);
        // Retornamos 204 (NO CONTENT) porque la operación tuvo éxito pero ya no hay datos que devolver
        return ResponseEntity.noContent().build();
    }
}
