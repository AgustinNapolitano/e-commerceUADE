package com.uade.tpo.e_commerce.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.uade.tpo.e_commerce.dto.PedidoRequest;
import com.uade.tpo.e_commerce.model.EstadoPedido;
import com.uade.tpo.e_commerce.model.Pedido;
import com.uade.tpo.e_commerce.service.PedidoService;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    // GET http://localhost:8080/api/pedidos
    @GetMapping
    public List<Pedido> getAllPedidos() {
        return pedidoService.getAllPedidos();
    }

    // GET http://localhost:8080/api/pedidos/1
    @GetMapping("/{id}")
    public ResponseEntity<Pedido> getPedidoById(@PathVariable Long id) {
        Pedido pedido = pedidoService.getPedidoById(id);
        if (pedido == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(pedido);
    }

    // GET http://localhost:8080/api/pedidos/usuario/1  --> todos los pedidos del usuario 1
    @GetMapping("/usuario/{usuarioId}")
    public List<Pedido> getPedidosByUsuario(@PathVariable Long usuarioId) {
        return pedidoService.getPedidosByUsuario(usuarioId);
    }

    // POST http://localhost:8080/api/pedidos
    @PostMapping
    public ResponseEntity<Pedido> createPedido(@RequestBody PedidoRequest request) {
        Pedido nuevo = pedidoService.createPedido(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    // PATCH http://localhost:8080/api/pedidos/1/estado?nuevoEstado=CONFIRMADO
    @PatchMapping("/{id}/estado")
    public ResponseEntity<Pedido> updateEstado(@PathVariable Long id,
                                               @RequestParam EstadoPedido nuevoEstado) {
        Pedido actualizado = pedidoService.updateEstado(id, nuevoEstado);
        return ResponseEntity.ok(actualizado);
    }

    // DELETE http://localhost:8080/api/pedidos/1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable Long id) {
        pedidoService.deletePedidoById(id);
        return ResponseEntity.noContent().build();
    }
}
