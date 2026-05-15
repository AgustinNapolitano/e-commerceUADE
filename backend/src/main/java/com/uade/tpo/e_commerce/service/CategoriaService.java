package com.uade.tpo.e_commerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.dto.CategoriaRequest;
import com.uade.tpo.e_commerce.dto.CategoriaResponse;
import com.uade.tpo.e_commerce.exception.RecursoNotFoundException;
import com.uade.tpo.e_commerce.model.Categoria;
import com.uade.tpo.e_commerce.repository.CategoriaRepository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<CategoriaResponse> getAllCategorias() {
        return categoriaRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CategoriaResponse getCategoriaById(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNotFoundException("Categoría no encontrada con id: " + id));

        return mapToResponse(categoria);
    }

    public CategoriaResponse createCategoria(CategoriaRequest request) {
        Categoria categoria = new Categoria();
        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());

        Categoria nueva = categoriaRepository.save(categoria);

        return mapToResponse(nueva);
    }

    public CategoriaResponse updateCategoria(Long id, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RecursoNotFoundException("Categoría no encontrada con id: " + id));

        categoria.setNombre(request.getNombre());
        categoria.setDescripcion(request.getDescripcion());

        Categoria actualizada = categoriaRepository.save(categoria);

        return mapToResponse(actualizada);
    }

    public void deleteCategoriaById(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RecursoNotFoundException("Categoría no encontrada con id: " + id);
        }

        categoriaRepository.deleteById(id);
    }

    private CategoriaResponse mapToResponse(Categoria categoria) {
        return new CategoriaResponse(
                categoria.getId(),
                categoria.getNombre(),
                categoria.getDescripcion()
        );
    }
}