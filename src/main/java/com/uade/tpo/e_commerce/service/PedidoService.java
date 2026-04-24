package com.uade.tpo.e_commerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.dto.PedidoRequest;
import com.uade.tpo.e_commerce.dto.PedidoResponse;
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

    public PedidoResponse createPedido(PedidoRequest request) {

        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);

        List<ItemPedido> items = request.getItems().stream().map(itemReq -> {

            Producto producto = productoRepository.findById(itemReq.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

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