package com.uade.tpo.e_commerce.config;

import com.uade.tpo.e_commerce.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// @Component le dice a Spring que este es un componente de la aplicación y debe instanciarlo
@Component
// @RequiredArgsConstructor inyecta automáticamente JwtService y UserDetailsService
@RequiredArgsConstructor
// Heredamos de OncePerRequestFilter para asegurar que este filtro se ejecute exactamente UNA VEZ por cada petición HTTP
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    // Este es el método central del filtro. Intercepta TODA petición antes de que llegue al Controller
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        // 1. Extraemos la cabecera "Authorization" de la petición HTTP
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        
        // 2. Si no hay cabecera o no empieza con "Bearer ", ignoramos el token y dejamos que siga la petición
        // (Probablemente sea una ruta pública como el login o el registro)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // 3. Recortamos los primeros 7 caracteres ("Bearer ") para quedarnos solo con el token JWT
        jwt = authHeader.substring(7);
        // 4. Usamos nuestro JwtService para leer el email escondido dentro del token
        userEmail = jwtService.extractUsername(jwt);
        
        // 5. Verificamos que tengamos un email y que el usuario NO esté autenticado todavía en este request
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            // Buscamos los datos reales del usuario en la base de datos usando el email
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
            
            // 6. Validamos que el token sea correcto, no haya expirado y pertenezca a este usuario
            if (jwtService.isTokenValid(jwt, userDetails)) {
                
                // 7. Creamos un "Pasaporte" de Spring Security (UsernamePasswordAuthenticationToken)
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // No necesitamos la contraseña porque ya confiamos en el token JWT
                        userDetails.getAuthorities() // Cargamos sus roles (ej. ROLE_ADMIN)
                );
                
                // Guardamos detalles adicionales de la petición web (IP, sesión, etc.)
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                
                // 8. ¡LO MÁS IMPORTANTE! Le decimos a Spring Security: "Este usuario ya está autenticado. Déjalo pasar."
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        // 9. Pasamos la petición al siguiente filtro en la cadena para que continúe su camino hacia el Controller
        filterChain.doFilter(request, response);
    }
}
