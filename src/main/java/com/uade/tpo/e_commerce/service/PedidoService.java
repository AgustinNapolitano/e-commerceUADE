package com.uade.tpo.e_commerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.dto.PedidoRequest;
import com.uade.tpo.e_commerce.dto.PedidoResponse;
import com.uade.tpo.e_commerce.exception.RecursoNotFoundException;
import com.uade.tpo.e_commerce.model.ItemPedido;
import com.uade.tpo.e_commerce.model.Pedido;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.PedidoRepository;
import com.uade.tpo.e_commerce.repository.ProductoRepository;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

// @Service indica que esta clase maneja la lógica central de las compras
@Service
// @Transactional ES CLAVE: Si alguna parte de la compra falla (ej. error de base de datos), 
// deshace todos los cambios (rollback) para evitar que se cobre o se modifique el stock a medias.
@Transactional
public class PedidoService {

    // Inyectamos las herramientas para comunicarnos con las tablas de MySQL
    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    // Método principal: Procesa la creación de una factura/compra
    public PedidoResponse createPedido(PedidoRequest request) {

        // 1. Buscamos en la base de datos al usuario que quiere comprar. Si no existe, tiramos error.
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 2. Creamos la factura (Pedido) y le asignamos su dueño (el Usuario)
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);

        // 3. Recorremos cada producto que el usuario metió en su carrito
        List<ItemPedido> items = request.getItems().stream().map(itemReq -> {

            // Buscamos el producto real en la base de datos para saber su precio actual
            Producto producto = productoRepository.findById(itemReq.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            // IMPORTANTE: En un E-commerce real, aquí debería haber un "if (producto.getStock() < itemReq.getCantidad())"
            // para validar que haya stock antes de seguir, y luego restar el stock.

            // Creamos el renglón de la factura (ItemPedido)
            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProducto(producto);
            item.setCantidad(itemReq.getCantidad());
            item.setPrecioUnitario(producto.getPrecio()); // Guardamos el precio al que lo compró (por si luego cambia)

            return item;

        }).collect(Collectors.toList());

        // 4. Adjuntamos los renglones a la factura
        pedido.setItems(items);

        // 5. Calculamos el Total sumando (Precio * Cantidad) de cada renglón
        double total = items.stream()
                .mapToDouble(i -> i.getPrecioUnitario() * i.getCantidad())
                .sum();

        pedido.setTotal(total);

        // 6. Guardamos la factura completa en la base de datos
        Pedido nuevoPedido = pedidoRepository.save(pedido);

        // 7. Convertimos el pedido a un DTO de respuesta para no exponer objetos internos de la BD
        return mapToResponse(nuevoPedido);
    }

    // Método para traer todas las facturas de la base de datos
    public List<PedidoResponse> getAllPedidos() {
        return pedidoRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Método para buscar una factura específica por su ID
    public PedidoResponse getPedidoById(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNotFoundException("No hay pedido con esa ID"));

        return mapToResponse(pedido);
    }

    // Método utilitario: Transforma la Entidad (MySQL) en un DTO limpio para mandarlo por JSON al frontend
    private PedidoResponse mapToResponse(Pedido pedido) {
        return new PedidoResponse(
                pedido.getId(),
                pedido.getUsuario().getId(),
                pedido.getUsuario().getEmail(),
                pedido.getEstado(),
                pedido.getFecha(),
                pedido.getTotal(),
                pedido.getItems().stream()
                        .map(item -> new PedidoResponse.ItemPedidoResponse(
                                item.getProducto().getId(),
                                item.getProducto().getNombre(),
                                item.getCantidad(),
                                item.getPrecioUnitario(),
                                item.getPrecioUnitario() * item.getCantidad() // Calculamos subtotal
                        ))
                        .collect(Collectors.toList())
        );
    }
}