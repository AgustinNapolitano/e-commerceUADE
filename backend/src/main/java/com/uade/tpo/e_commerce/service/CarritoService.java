package com.uade.tpo.e_commerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import com.uade.tpo.e_commerce.dto.CarritoRequest;
import com.uade.tpo.e_commerce.dto.CarritoResponse;
import com.uade.tpo.e_commerce.model.ItemCarrito;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.ItemCarritoRepository;
import com.uade.tpo.e_commerce.repository.ProductoRepository;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

@Service
@Transactional
public class CarritoService {

    @Autowired
    private ItemCarritoRepository itemCarritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<CarritoResponse> getCarritoByUsuarioId(Long usuarioId) {
        return itemCarritoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<CarritoResponse> saveCarrito(Long usuarioId, CarritoRequest request) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Eliminar items previos del usuario
        itemCarritoRepository.deleteByUsuarioId(usuarioId);

        if (request.getItems() != null) {
            List<ItemCarrito> newItems = request.getItems().stream().map(itemReq -> {
                Producto producto = productoRepository.findById(itemReq.getProductoId())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + itemReq.getProductoId()));

                ItemCarrito item = new ItemCarrito();
                item.setUsuario(usuario);
                item.setProducto(producto);
                item.setCantidad(itemReq.getCantidad());
                return item;
            }).collect(Collectors.toList());

            itemCarritoRepository.saveAll(newItems);
        }

        return getCarritoByUsuarioId(usuarioId);
    }

    public void clearCarrito(Long usuarioId) {
        itemCarritoRepository.deleteByUsuarioId(usuarioId);
    }

    private CarritoResponse mapToResponse(ItemCarrito item) {
        Producto p = item.getProducto();
        return new CarritoResponse(
                p.getId(),
                p.getNombre(),
                p.getPrecio(),
                p.getImageUrl(),
                item.getCantidad()
        );
    }
}
