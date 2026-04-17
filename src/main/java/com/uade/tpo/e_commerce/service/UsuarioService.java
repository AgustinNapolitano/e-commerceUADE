package com.uade.tpo.e_commerce.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.uade.tpo.e_commerce.dto.UsuarioRequest;
import com.uade.tpo.e_commerce.exception.RecursoNotFoundException;
import com.uade.tpo.e_commerce.exception.ReglaNegocioException;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class UsuarioService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + email));
    }

    public List<Usuario> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public Usuario getUsuarioById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario createUsuario(UsuarioRequest request) {
        // Verificar que el email no esté en uso
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ReglaNegocioException(
                    "Ya existe un usuario con el email: " + request.getEmail(),
                    HttpStatus.CONFLICT);
        }

        Usuario usuario = new Usuario();
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        // En producción deberías hashear la password (BCrypt)
        usuario.setPassword(request.getPassword());
        usuario.setFechaNacimiento(request.getFechaNacimiento());
        usuario.setSexo(request.getSexo());

        return usuarioRepository.save(usuario);
    }

    public Usuario updateUsuario(Long id, UsuarioRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNotFoundException("Usuario no encontrado con id: " + id));

        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(request.getPassword());
        usuario.setFechaNacimiento(request.getFechaNacimiento());
        usuario.setSexo(request.getSexo());

        return usuarioRepository.save(usuario);
    }

    public void deleteUsuarioById(Long id) {
        usuarioRepository.deleteById(id);
    }
}
