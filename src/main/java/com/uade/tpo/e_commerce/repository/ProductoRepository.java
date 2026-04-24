package com.uade.tpo.e_commerce.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.uade.tpo.e_commerce.model.Producto;

// La interfaz Repository es como el "puente" entre nuestro código de Java y la base de datos MySQL.
// Al heredar de "JpaRepository", Spring Boot nos regala mágicamente funciones como "save()", "findById()", "delete()", sin tener que escribir código SQL a mano.
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Este es un "Query Method". Spring lee el nombre del método en inglés ("findAllByOrderByNombreAsc") 
    // y lo traduce automáticamente a una consulta SQL que trae todos los productos ordenados alfabéticamente por la A a la Z.
    List<Producto> findAllByOrderByNombreAsc();
}
