// ===== CategoriaRepository.java =====
package com.uade.tpo.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.e_commerce.model.Categoria;
import java.util.Optional;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    // Buscar categoría por nombre
    Optional<Categoria> findByNombre(String nombre);
}
