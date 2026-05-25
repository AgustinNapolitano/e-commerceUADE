package com.uade.tpo.e_commerce;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.uade.tpo.e_commerce.model.Categoria;
import com.uade.tpo.e_commerce.model.EstadoPedido;
import com.uade.tpo.e_commerce.model.ItemPedido;
import com.uade.tpo.e_commerce.model.Pedido;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Role;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.CategoriaRepository;
import com.uade.tpo.e_commerce.repository.PedidoRepository;
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

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (categoriaRepository.count() == 0) {

            // Categorías
            Categoria electronica = new Categoria();
            electronica.setNombre("Electrónica");
            electronica.setDescripcion("Productos electrónicos y tecnología");
            categoriaRepository.save(electronica);

            Categoria ropa = new Categoria();
            ropa.setNombre("Ropa");
            ropa.setDescripcion("Indumentaria y accesorios");
            categoriaRepository.save(ropa);

            Categoria hogar = new Categoria();
            hogar.setNombre("Hogar");
            hogar.setDescripcion("Productos para el hogar");
            categoriaRepository.save(hogar);

            Categoria gaming = new Categoria();
            gaming.setNombre("Gaming");
            gaming.setDescripcion("Productos y accesorios gamer");
            categoriaRepository.save(gaming);

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

            Producto p4 = new Producto();
            p4.setNombre("Mouse Logitech");
            p4.setDescripcion("Mouse inalámbrico ergonómico");
            p4.setPrecio(35000.0);
            p4.setStock(40);
            p4.setCategoria(electronica);
            productoRepository.save(p4);

            Producto p5 = new Producto();
            p5.setNombre("Teclado Mecánico Redragon");
            p5.setDescripcion("Teclado mecánico RGB");
            p5.setPrecio(75000.0);
            p5.setStock(20);
            p5.setCategoria(gaming);
            productoRepository.save(p5);

            Producto p6 = new Producto();
            p6.setNombre("Silla Gamer");
            p6.setDescripcion("Silla gamer ergonómica color negro");
            p6.setPrecio(220000.0);
            p6.setStock(8);
            p6.setCategoria(gaming);
            productoRepository.save(p6);

            Producto p7 = new Producto();
            p7.setNombre("Buzo Nike");
            p7.setDescripcion("Buzo deportivo talle L");
            p7.setPrecio(55000.0);
            p7.setStock(30);
            p7.setCategoria(ropa);
            productoRepository.save(p7);

            Producto p8 = new Producto();
            p8.setNombre("Pantalón Jean");
            p8.setDescripcion("Jean azul clásico");
            p8.setPrecio(42000.0);
            p8.setStock(35);
            p8.setCategoria(ropa);
            productoRepository.save(p8);

            Producto p9 = new Producto();
            p9.setNombre("Lámpara de Escritorio");
            p9.setDescripcion("Lámpara LED regulable para escritorio");
            p9.setPrecio(28000.0);
            p9.setStock(18);
            p9.setCategoria(hogar);
            productoRepository.save(p9);

            Producto p10 = new Producto();
            p10.setNombre("Cafetera Philips");
            p10.setDescripcion("Cafetera eléctrica para café de filtro");
            p10.setPrecio(95000.0);
            p10.setStock(12);
            p10.setCategoria(hogar);
            productoRepository.save(p10);

            // Usuarios
            Usuario u1 = new Usuario();
            u1.setNombreUsuario("juanp");
            u1.setNombre("Juan");
            u1.setApellido("Pérez");
            u1.setEmail("juan@mail.com");
            u1.setPassword(passwordEncoder.encode("1234"));
            u1.setFechaNacimiento(LocalDate.of(1990, 5, 15));
            u1.setSexo("M");
            u1.setRole(Role.USER);
            usuarioRepository.save(u1);

            Usuario u2 = new Usuario();
            u2.setNombreUsuario("mariag");
            u2.setNombre("María");
            u2.setApellido("García");
            u2.setEmail("maria@mail.com");
            u2.setPassword(passwordEncoder.encode("1234"));
            u2.setFechaNacimiento(LocalDate.of(1992, 8, 22));
            u2.setSexo("F");
            u2.setRole(Role.ADMIN);
            usuarioRepository.save(u2);

            Usuario u3 = new Usuario();
            u3.setNombreUsuario("lucasm");
            u3.setNombre("Lucas");
            u3.setApellido("Martínez");
            u3.setEmail("lucas@mail.com");
            u3.setPassword(passwordEncoder.encode("1234"));
            u3.setFechaNacimiento(LocalDate.of(1998, 3, 10));
            u3.setSexo("M");
            u3.setRole(Role.USER);
            usuarioRepository.save(u3);

            Usuario u4 = new Usuario();
            u4.setNombreUsuario("sofiar");
            u4.setNombre("Sofía");
            u4.setApellido("Rodríguez");
            u4.setEmail("sofia@mail.com");
            u4.setPassword(passwordEncoder.encode("1234"));
            u4.setFechaNacimiento(LocalDate.of(1996, 11, 4));
            u4.setSexo("F");
            u4.setRole(Role.USER);
            usuarioRepository.save(u4);

            // Pedidos
            Pedido pedido1 = new Pedido();
            pedido1.setUsuario(u1);
            pedido1.setEstado(EstadoPedido.PENDIENTE);

            ItemPedido item1 = new ItemPedido();
            item1.setPedido(pedido1);
            item1.setProducto(p2);
            item1.setCantidad(3);
            item1.setPrecioUnitario(p2.getPrecio());

            ItemPedido item2 = new ItemPedido();
            item2.setPedido(pedido1);
            item2.setProducto(p4);
            item2.setCantidad(1);
            item2.setPrecioUnitario(p4.getPrecio());

            pedido1.setItems(List.of(item1, item2));
            pedido1.setTotal((p2.getPrecio() * 3) + p4.getPrecio());
            pedidoRepository.save(pedido1);

            Pedido pedido2 = new Pedido();
            pedido2.setUsuario(u2);
            pedido2.setEstado(EstadoPedido.CONFIRMADO);

            ItemPedido item3 = new ItemPedido();
            item3.setPedido(pedido2);
            item3.setProducto(p1);
            item3.setCantidad(1);
            item3.setPrecioUnitario(p1.getPrecio());

            pedido2.setItems(List.of(item3));
            pedido2.setTotal(p1.getPrecio());
            pedidoRepository.save(pedido2);

            Pedido pedido3 = new Pedido();
            pedido3.setUsuario(u3);
            pedido3.setEstado(EstadoPedido.ENVIADO);

            ItemPedido item4 = new ItemPedido();
            item4.setPedido(pedido3);
            item4.setProducto(p3);
            item4.setCantidad(2);
            item4.setPrecioUnitario(p3.getPrecio());

            ItemPedido item5 = new ItemPedido();
            item5.setPedido(pedido3);
            item5.setProducto(p7);
            item5.setCantidad(1);
            item5.setPrecioUnitario(p7.getPrecio());

            pedido3.setItems(List.of(item4, item5));
            pedido3.setTotal((p3.getPrecio() * 2) + p7.getPrecio());
            pedidoRepository.save(pedido3);

            Pedido pedido4 = new Pedido();
            pedido4.setUsuario(u4);
            pedido4.setEstado(EstadoPedido.ENTREGADO);

            ItemPedido item6 = new ItemPedido();
            item6.setPedido(pedido4);
            item6.setProducto(p5);
            item6.setCantidad(1);
            item6.setPrecioUnitario(p5.getPrecio());

            ItemPedido item7 = new ItemPedido();
            item7.setPedido(pedido4);
            item7.setProducto(p6);
            item7.setCantidad(1);
            item7.setPrecioUnitario(p6.getPrecio());

            pedido4.setItems(List.of(item6, item7));
            pedido4.setTotal(p5.getPrecio() + p6.getPrecio());
            pedidoRepository.save(pedido4);

            System.out.println(" Datos de prueba cargados correctamente.");
        } else {
            System.out.println(" La base de datos ya tiene datos, se omite la carga inicial.");
        }
    }
}