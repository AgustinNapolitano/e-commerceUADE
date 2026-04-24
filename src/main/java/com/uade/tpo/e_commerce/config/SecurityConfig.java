package com.uade.tpo.e_commerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// Indica que esta es una clase de configuración de Spring
@Configuration
// Habilita la seguridad web (Spring Security) en el proyecto
@EnableWebSecurity
// Constructor automático de Lombok para inyectar dependencias (jwtAuthFilter y authenticationProvider)
@RequiredArgsConstructor
public class SecurityConfig {

    // Filtro personalizado que intercepta cada petición para validar el token JWT
    private final JwtAuthenticationFilter jwtAuthFilter;
    
    // Proveedor que tiene la lógica de buscar el usuario y verificar la contraseña
    private final AuthenticationProvider authenticationProvider;

    // Bean principal que configura las reglas de acceso a las rutas (endpoints)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilita CSRF porque al usar JWT (tokens) y APIs REST, no somos vulnerables a ataques CSRF clásicos
            .csrf(csrf -> csrf.disable())
            
            // Configuración de permisos por ruta
            .authorizeHttpRequests(auth -> auth
                // Rutas PÚBLICAS: HTML, CSS, JS, imágenes (Cualquiera puede ver la web)
                .requestMatchers("/", "/index.html", "/*.html", "/css/**", "/js/**", "/images/**", "/favicon.ico").permitAll()
                
                // Rutas PÚBLICAS: Registro e inicio de sesión
                .requestMatchers("/api/auth/**").permitAll()
                
                // Rutas PÚBLICAS: Ver productos y categorías (solo lectura GET)
                .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                
                // Rutas RESTRINGIDAS: Todo lo que empiece con /api/admin requiere rol ADMIN
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // Rutas RESTRINGIDAS: Crear, actualizar y borrar productos es exclusivo de ADMIN
                .requestMatchers(HttpMethod.POST, "/api/productos").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/pedidos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasRole("ADMIN")
                
                // Todas las demás peticiones (ej. realizar un pedido) exigen estar autenticado (USER o ADMIN)
                .anyRequest().authenticated()
            )
            
            // Configuración de Sesión: STATELESS significa que Spring no guardará la sesión en memoria. 
            // Confiamos 100% en que cada petición traerá su propio JWT válido.
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // Le decimos a Spring que use nuestro proveedor configurado
            .authenticationProvider(authenticationProvider)
            
            // Ejecutamos nuestro Filtro JWT ANTES del filtro estándar de Spring (para leer el token a tiempo)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }
}

