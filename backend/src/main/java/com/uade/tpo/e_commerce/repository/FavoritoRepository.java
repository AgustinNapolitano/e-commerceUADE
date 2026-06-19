package com.uade.tpo.e_commerce.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.e_commerce.model.Favorito;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {
    List<Favorito> findByUsuarioId(Long usuarioId);
    Optional<Favorito> findByUsuarioIdAndProductoId(Long usuarioId, Long productoId);
}
