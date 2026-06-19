package com.uade.tpo.e_commerce.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import com.uade.tpo.e_commerce.dto.ProductoResponse;
import com.uade.tpo.e_commerce.model.Favorito;
import com.uade.tpo.e_commerce.model.Producto;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.FavoritoRepository;
import com.uade.tpo.e_commerce.repository.ProductoRepository;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

@Service
@Transactional
public class FavoritoService {

    @Autowired
    private FavoritoRepository favoritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<ProductoResponse> getFavoritosByUsuarioId(Long usuarioId) {
        return favoritoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(fav -> ProductoResponse.fromEntity(fav.getProducto()))
                .collect(Collectors.toList());
    }

    public List<ProductoResponse> addFavorito(Long usuarioId, Long productoId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Optional<Favorito> existente = favoritoRepository.findByUsuarioIdAndProductoId(usuarioId, productoId);
        if (existente.isEmpty()) {
            Favorito fav = new Favorito();
            fav.setUsuario(usuario);
            fav.setProducto(producto);
            favoritoRepository.save(fav);
        }

        return getFavoritosByUsuarioId(usuarioId);
    }

    public List<ProductoResponse> removeFavorito(Long usuarioId, Long productoId) {
        Optional<Favorito> existente = favoritoRepository.findByUsuarioIdAndProductoId(usuarioId, productoId);
        existente.ifPresent(favoritoRepository::delete);
        return getFavoritosByUsuarioId(usuarioId);
    }
}
