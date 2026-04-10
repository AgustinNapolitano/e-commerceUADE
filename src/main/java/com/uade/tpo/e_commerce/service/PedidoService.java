package com.uade.tpo.e_commerce.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.dto.PedidoRequest;
import com.uade.tpo.e_commerce.model.EstadoPedido;
import com.uade.tpo.e_commerce.model.ItemPedido;
import com.uade.tpo.e_commerce.model.Pedido;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.PedidoRepository;
import com.uade.tpo.e_commerce.repository.ProductoRepository;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<Pedido> getAllPedidos() {
        return pedidoRepository.findAll();
    }

    public Pedido getPedidoById(Long id) {
        return pedidoRepository.findById(id).orElse(null);
    }

    // Buscar todos los pedidos de un usuario específico
    public List<Pedido> getPedidosByUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    public Pedido createPedido(PedidoRequest request) {
        // Verificar que el usuario existe
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + request.getUsuarioId()));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);

        List<ItemPedido> items = new ArrayList<>();
        double total = 0.0;

        for (PedidoRequest.ItemPedidoRequest itemRequest : request.getItems()) {
            Producto producto = productoRepository.findById(itemRequest.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + itemRequest.getProductoId()));

            // Verificar stock disponible
            if (producto.getStock() < itemRequest.getCantidad()) {
                throw new RuntimeException("Stock insuficiente para el producto: " + producto.getNombre());
            }

            // Descontar stock
            producto.setStock(producto.getStock() - itemRequest.getCantidad());
            productoRepository.save(producto);

            // Crear item del pedido
            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProducto(producto);
            item.setCantidad(itemRequest.getCantidad());
            item.setPrecioUnitario(producto.getPrecio()); // guarda el precio actual

            total += producto.getPrecio() * itemRequest.getCantidad();
            items.add(item);
        }

        pedido.setItems(items);
        pedido.setTotal(total);

        return pedidoRepository.save(pedido);
    }

    // Cambiar estado del pedido (ej: PENDIENTE -> CONFIRMADO)
    public Pedido updateEstado(Long id, EstadoPedido nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado con id: " + id));
        pedido.setEstado(nuevoEstado);
        return pedidoRepository.save(pedido);
    }

    public void deletePedidoById(Long id) {
        pedidoRepository.deleteById(id);
    }
}
