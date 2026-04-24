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

// @Service indica que esta clase contiene lógica de negocio (Capa Service)
@Service
// @RequiredArgsConstructor genera un constructor automáticamente para inyectar las dependencias (`final`)
@RequiredArgsConstructor
public class AuthenticationService {

    // Repositorio para interactuar con la base de datos de usuarios
    private final UsuarioRepository usuarioRepository;
    // Encriptador para hashear la contraseña
    private final PasswordEncoder passwordEncoder;
    // Administrador de autenticación nativo de Spring Security
    private final AuthenticationManager authenticationManager;
    // Servicio que se encarga de crear y validar los tokens JWT
    private final JwtService jwtService;

    // Método que registra a un usuario nuevo en el sistema
    public AuthenticationResponse register(UsuarioRequest request) {
        // Creamos un nuevo objeto Usuario vacío
        Usuario usuario = new Usuario();
        
        // Empezamos a llenar sus datos con la información que vino del Frontend (el 'request')
        usuario.setNombreUsuario(request.getNombreUsuario());
        usuario.setNombre(request.getNombre());
        usuario.setApellido(request.getApellido());
        usuario.setEmail(request.getEmail());
        
        // ¡MUY IMPORTANTE! Encriptamos la contraseña plana ANTES de guardarla
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setFechaNacimiento(request.getFechaNacimiento());
        usuario.setSexo(request.getSexo());
        
        // Medida de Seguridad: Forzamos a que todo nuevo usuario tenga el rol 'USER' por defecto
        usuario.setRole(Role.USER);

        // Guardamos al usuario en la base de datos MySQL
        usuarioRepository.save(usuario);
        
        // Una vez guardado, generamos un Token JWT para devolvérselo, así no tiene que loguearse de nuevo
        var jwtToken = jwtService.generateToken(usuario);
        
        // Devolvemos el token envuelto en un objeto AuthenticationResponse
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    // Método para iniciar sesión (Login)
    public AuthenticationResponse authenticate(LoginRequest request) {
        // Le pasamos el email y la clave a Spring Security. Si la clave es incorrecta, arrojará un error aquí mismo.
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );
        
        // Si la línea anterior no dio error, significa que las credenciales son correctas.
        // Ahora buscamos al usuario en la base de datos por su email.
        var user = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(); // Si por algún motivo extraño no existe, lanza error
                
        // Generamos un nuevo Token JWT para esta sesión
        var jwtToken = jwtService.generateToken(user);
        
        // Le entregamos el token al frontend
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}

