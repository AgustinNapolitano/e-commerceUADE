package com.uade.tpo.e_commerce.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.uade.tpo.e_commerce.dto.ProductoRequest;
import com.uade.tpo.e_commerce.dto.ProductoResponse;
import com.uade.tpo.e_commerce.exception.RecursoNotFoundException;
import com.uade.tpo.e_commerce.model.Categoria;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.repository.CategoriaRepository;
import com.uade.tpo.e_commerce.repository.ProductoRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<ProductoResponse> getAllProductos() {
        return productoRepository.findAll().stream()
                .map(ProductoResponse::fromEntity)
                .toList();
    }

    public ProductoResponse getProductoById(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNotFoundException("Producto no encontrado con id: " + id));
        return ProductoResponse.fromEntity(producto);
    }

    public ProductoResponse createProducto(ProductoRequest request) {
        Producto producto = new Producto();
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());

        if (request.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new RecursoNotFoundException(
                            "Categoría no encontrada con id: " + request.getCategoriaId()));
            producto.setCategoria(categoria);
        }

        return ProductoResponse.fromEntity(productoRepository.save(producto));
    }

    public ProductoResponse updateProducto(Long id, ProductoRequest request) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RecursoNotFoundException("Producto no encontrado con id: " + id));

        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setStock(request.getStock());

        if (request.getCategoriaId() != null) {
            Categoria categoria = categoriaRepository.findById(request.getCategoriaId())
                    .orElseThrow(() -> new RecursoNotFoundException(
                            "Categoría no encontrada con id: " + request.getCategoriaId()));
            producto.setCategoria(categoria);
        }

        return ProductoResponse.fromEntity(productoRepository.save(producto));
    }

    public void deleteProductoById(Long id) {
        productoRepository.deleteById(id);
    }
}
