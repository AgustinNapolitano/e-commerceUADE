package com.uade.tpo.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.e_commerce.model.Usuario;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Buscar usuario por email (útil para login)
    Optional<Usuario> findByEmail(String email);
}
