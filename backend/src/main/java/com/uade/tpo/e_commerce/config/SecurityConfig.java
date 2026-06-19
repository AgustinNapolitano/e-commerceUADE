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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Configuración de Seguridad - Tarea del Integrante 1
 * Define quién puede acceder a qué y configura los permisos de CORS para el Frontend.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Habilitar configuración de CORS definida más abajo
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // 2. Deshabilitar CSRF ya que usamos Tokens JWT (Stateless)
            .csrf(csrf -> csrf.disable())
            
            // 3. Definición de permisos por carpetas/endpoints
            .authorizeHttpRequests(auth -> auth
                // Recursos estáticos y Auth son públicos
                .requestMatchers("/", "/index.html", "/*.html", "/css/**", "/js/**", "/images/**", "/favicon.ico").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                
                // Lectura de productos, categorías y pedidos es pública
                .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categorias/**").permitAll()
                
                // Acciones de administración requieren rol ADMIN (Tarea Integrante 4)
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/productos").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasRole("ADMIN")
                
                // Cualquier otra petición debe estar autenticada
                .anyRequest().authenticated()
            )
            
            // 4. Configurar manejo de sesión como Stateless (sin estado en el servidor)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 5. Configurar proveedor de autenticación y filtros de JWT
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }

    /**
     * Configuración de CORS (Cross-Origin Resource Sharing)
     * Permite que el Frontend en React (puerto 5173) consuma la API.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permitir el origen del Frontend (Vite)
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:5174"));
        // Métodos HTTP permitidos
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Headers permitidos (necesario para enviar el Token de Authorization)
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        // Permitir envío de credenciales (cookies/auth headers)
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
