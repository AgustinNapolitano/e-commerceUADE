package com.uade.tpo.e_commerce.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

// @Service indica que esta clase contiene lógica central (crear y leer tokens)
@Service
public class JwtService {

    // Lee la clave secreta desde el archivo application.properties. ¡Con esta clave firmamos los tokens!
    @org.springframework.beans.factory.annotation.Value("${application.security.jwt.secret-key}")
    private String secretKey;

    // Método para sacar el email (username) que está escondido dentro del token JWT
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Método genérico para extraer cualquier "Claim" (dato) del token
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Método principal para generar un token nuevo solo pasándole los datos del usuario
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    // El corazón del JWT: Aquí se construye el token pedazo a pedazo
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts
                .builder()
                .setClaims(extraClaims) // Podemos guardar datos extra (como roles)
                .setSubject(userDetails.getUsername()) // El "dueño" del token (su email)
                .setIssuedAt(new Date(System.currentTimeMillis())) // Fecha de creación (AHORA)
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24)) // Fecha de vencimiento (Dura 24 horas)
                .signWith(getSignInKey(), SignatureAlgorithm.HS256) // Lo firmamos criptográficamente con nuestra clave secreta
                .compact(); // Lo comprimimos en el famoso formato "header.payload.signature"
    }

    // Verifica si un token es real, si pertenece al usuario que dice ser, y si no ha caducado
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // Comprueba si la fecha actual ya superó la fecha de vencimiento del token
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extrae la fecha de vencimiento escrita dentro del token
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Desencripta/Lee todos los datos (Claims) del token usando nuestra clave secreta
    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey()) // Solo quien tenga la clave secreta puede leerlo y confiar en él
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Transforma nuestro string de texto secreto en una clave criptográfica real de tipo HMAC-SHA256
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
