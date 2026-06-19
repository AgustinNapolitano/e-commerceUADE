package com.uade.tpo.e_commerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.dto.PedidoRequest;
import com.uade.tpo.e_commerce.dto.PedidoResponse;
import com.uade.tpo.e_commerce.exception.RecursoNotFoundException;
import com.uade.tpo.e_commerce.exception.ReglaNegocioException;
import org.springframework.http.HttpStatus;
import com.uade.tpo.e_commerce.model.ItemPedido;
import com.uade.tpo.e_commerce.model.Pedido;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.model.Role;
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

    public PedidoResponse createPedido(PedidoRequest request) {

        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);

        List<ItemPedido> items = request.getItems().stream().map(itemReq -> {

            Producto producto = productoRepository.findById(itemReq.getProductoId())
                    .orElseThrow(() -> new RecursoNotFoundException("Producto no encontrado con ID: " + itemReq.getProductoId()));

            if (producto.getStock() < itemReq.getCantidad()) {
                throw new ReglaNegocioException(
                        "Stock insuficiente para el producto: " + producto.getNombre() + " (Disponible: " + producto.getStock() + ")",
                        HttpStatus.BAD_REQUEST
                );
            }

            // Restar stock
            producto.setStock(producto.getStock() - itemReq.getCantidad());
            productoRepository.save(producto);

            ItemPedido item = new ItemPedido();
            item.setPedido(pedido);
            item.setProducto(producto);
            item.setCantidad(itemReq.getCantidad());
            item.setPrecioUnitario(producto.getPrecio());

            return item;

        }).collect(Collectors.toList());

        pedido.setItems(items);

        double total = items.stream()
                .mapToDouble(i -> i.getPrecioUnitario() * i.getCantidad())
                .sum();

        pedido.setTotal(total);

        Pedido nuevoPedido = pedidoRepository.save(pedido);

        return mapToResponse(nuevoPedido);
    }

    public List<PedidoResponse> getAllPedidos() {
        return pedidoRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PedidoResponse> getPedidosByUsuario(Usuario usuario) {
        List<Pedido> pedidos;
        if (usuario.getRole() == Role.ADMIN) {
            pedidos = pedidoRepository.findAll();
        } else {
            pedidos = pedidoRepository.findByUsuarioId(usuario.getId());
        }
        return pedidos.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PedidoResponse getPedidoById(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RecursoNotFoundException("No hay pedido con esa ID"));

        return mapToResponse(pedido);
    }

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
                                item.getPrecioUnitario() * item.getCantidad()
                        ))
                        .collect(Collectors.toList())
        );
    }
}