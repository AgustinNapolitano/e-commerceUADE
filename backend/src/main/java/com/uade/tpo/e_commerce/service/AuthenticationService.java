package com.uade.tpo.e_commerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.uade.tpo.e_commerce.dto.AuthenticationResponse;
import com.uade.tpo.e_commerce.dto.LoginRequest;
import com.uade.tpo.e_commerce.dto.UsuarioRequest;
import com.uade.tpo.e_commerce.model.Role;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

/**
 * Servicio de Autenticación.
 * Gestiona el registro y login de usuarios generando tokens JWT.
 */
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    /**
     * Registra un nuevo usuario en la base de datos.
     */
    public AuthenticationResponse register(UsuarioRequest request) {
        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(request.getNombreUsuario());
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setFechaNacimiento(request.getFechaNacimiento());
        usuario.setSexo(request.getSexo());
        usuario.setRole(Role.USER); // Por defecto se registra como USER

        usuarioRepository.save(usuario);
        
        // Generar token y responder con datos enriquecidos para el frontend
        var jwtToken = jwtService.generateToken(usuario);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(usuario.getRole().name())
                .nombre(usuario.getNombre())
                .id(usuario.getId())
                .build();
    }

    /**
     * Autentica un usuario existente y devuelve su token y rol.
     */
    public AuthenticationResponse authenticate(LoginRequest request) {
        // Validar credenciales con Spring Security
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );
        
        // Buscar el usuario para obtener sus datos
        var user = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow();
                
        // Generar token y responder
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name())
                .nombre(user.getNombre())
                .id(user.getId())
                .build();
    }
}
