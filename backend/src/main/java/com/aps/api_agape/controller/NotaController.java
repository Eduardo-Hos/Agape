package com.aps.api_agape.controller;

import java.util.Date;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aps.api_agape.DTOs.NotaRequest;
import com.aps.api_agape.model.Nota;
import com.aps.api_agape.model.Usuario;
import com.aps.api_agape.repository.NotaRepository;
import com.aps.api_agape.repository.UsuarioRepository;

@RestController
@RequestMapping("/nota")
public class NotaController {

    private final NotaRepository notaRepository;
    private final UsuarioRepository usuarioRepository;

    public NotaController(NotaRepository notaRepository, UsuarioRepository usuarioRepository) {
        this.notaRepository = notaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody NotaRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario()).orElse(null);
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuario nao encontrado");
        }

        Nota nota = new Nota();
        nota.setTexto(request.getTexto());
        nota.setDataCriacao(new Date());
        nota.setUsuario(usuario);

        Nota salva = notaRepository.save(nota);
        return ResponseEntity.ok(salva);
    }

    @GetMapping("/usuario/{id}")
    public List<Nota> listarPorUsuario(@PathVariable Long id) {
        return notaRepository.findByUsuarioIdOrderByDataCriacaoDesc(id);
    }
}
