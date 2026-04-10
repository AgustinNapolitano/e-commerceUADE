package com.uade.tpo.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.uade.tpo.e_commerce.model.Producto;


public interface ProductoRepository extends JpaRepository<Producto, Long> {
    //findAll() ya esta implementado en JpaRepository, no es necesario definir aqui 
    // select * from productos;
    
}
