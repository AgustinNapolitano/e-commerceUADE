package com.uade.tpo.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.e_commerce.model.Pedido;
import java.util.List;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    // Buscar todos los pedidos de un usuario
    List<Pedido> findByUsuarioId(Long usuarioId);
}
