package com.uade.tpo.e_commerce;

import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.uade.tpo.e_commerce.model.Categoria;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.CategoriaRepository;
import com.uade.tpo.e_commerce.repository.ProductoRepository;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) throws Exception {

        // Categorías
        Categoria electronica = new Categoria();
        electronica.setNombre("Electrónica");
        electronica.setDescripcion("Productos electrónicos y tecnología");
        categoriaRepository.save(electronica);

        Categoria ropa = new Categoria();
        ropa.setNombre("Ropa");
        ropa.setDescripcion("Indumentaria y accesorios");
        categoriaRepository.save(ropa);

        // Productos
        Producto p1 = new Producto();
        p1.setNombre("Notebook Lenovo");
        p1.setDescripcion("Notebook 15 pulgadas, 16GB RAM, 512GB SSD");
        p1.setPrecio(850000.0);
        p1.setStock(10);
        p1.setCategoria(electronica);
        productoRepository.save(p1);

        Producto p2 = new Producto();
        p2.setNombre("Auriculares Sony");
        p2.setDescripcion("Auriculares inalámbricos con cancelación de ruido");
        p2.setPrecio(120000.0);
        p2.setStock(25);
        p2.setCategoria(electronica);
        productoRepository.save(p2);

        Producto p3 = new Producto();
        p3.setNombre("Remera Adidas");
        p3.setDescripcion("Remera deportiva talle M");
        p3.setPrecio(15000.0);
        p3.setStock(50);
        p3.setCategoria(ropa);
        productoRepository.save(p3);

        // Usuarios
        Usuario u1 = new Usuario();
        u1.setNombre("Juan");
        u1.setApellido("Pérez");
        u1.setEmail("juan@mail.com");
        u1.setPassword("1234");
        u1.setFechaNacimiento(LocalDate.of(1990, 5, 15));
        u1.setSexo("M");
        usuarioRepository.save(u1);

        Usuario u2 = new Usuario();
        u2.setNombre("María");
        u2.setApellido("García");
        u2.setEmail("maria@mail.com");
        u2.setPassword("1234");
        u2.setFechaNacimiento(LocalDate.of(1992, 8, 22));
        u2.setSexo("F");
        usuarioRepository.save(u2);

        System.out.println("✅ Datos de prueba cargados correctamente.");
    }
}
