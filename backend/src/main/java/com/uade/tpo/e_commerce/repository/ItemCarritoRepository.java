package com.uade.tpo.e_commerce.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.e_commerce.model.ItemCarrito;

public interface ItemCarritoRepository extends JpaRepository<ItemCarrito, Long> {
    List<ItemCarrito> findByUsuarioId(Long usuarioId);
    void deleteByUsuarioId(Long usuarioId);
}
