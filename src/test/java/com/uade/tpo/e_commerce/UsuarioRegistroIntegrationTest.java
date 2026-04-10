package com.uade.tpo.e_commerce;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.uade.tpo.e_commerce.dto.UsuarioRequest;
import com.uade.tpo.e_commerce.model.Usuario;
import com.uade.tpo.e_commerce.repository.UsuarioRepository;

@SpringBootTest
@AutoConfigureMockMvc
class UsuarioRegistroIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Test
    void registroUsuario_persisteFechaNacimientoYSexoEnDb() throws Exception {
        String email = "nuevo.usuario.integration@test.local";
        UsuarioRequest req = new UsuarioRequest();
        req.setNombre("Ana");
        req.setApellido("López");
        req.setEmail(email);
        req.setPassword("pass123");
        req.setFechaNacimiento(LocalDate.of(2001, 3, 20));
        req.setSexo("F");

        mockMvc.perform(post("/api/usuarios")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.fechaNacimiento").value("2001-03-20"))
                .andExpect(jsonPath("$.sexo").value("F"));

        Optional<Usuario> guardado = usuarioRepository.findByEmail(email);
        assertThat(guardado).isPresent();
        assertThat(guardado.get().getFechaNacimiento()).isEqualTo(LocalDate.of(2001, 3, 20));
        assertThat(guardado.get().getSexo()).isEqualTo("F");
    }
}
