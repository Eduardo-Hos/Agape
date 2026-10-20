package com.aps.api_agape.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aps.api_agape.DTOs.CompromissoRequest;
import com.aps.api_agape.model.Compromisso;
import com.aps.api_agape.model.Usuario;
import com.aps.api_agape.repository.CompromissoRepository;
import com.aps.api_agape.repository.UsuarioRepository;

@RestController
@RequestMapping("/compromisso")
public class CompromissoController {

    private final CompromissoRepository compromissoRepository;
    private final UsuarioRepository usuarioRepository;

    public CompromissoController(CompromissoRepository compromissoRepository, UsuarioRepository usuarioRepository) {
        this.compromissoRepository = compromissoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody CompromissoRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario()).orElse(null);
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuario nao encontrado");
        }
        if (request.getTexto() == null || request.getTexto().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Texto obrigatorio");
        }

        Compromisso compromisso = new Compromisso();
        compromisso.setTexto(request.getTexto().trim());
        compromisso.setData(request.getData() != null ? LocalDate.parse(request.getData()) : LocalDate.now());
        compromisso.setHora(request.getHora() != null ? LocalTime.parse(request.getHora()) : LocalTime.now());
        compromisso.setUsuario(usuario);

        Compromisso salvo = compromissoRepository.save(compromisso);
        return ResponseEntity.ok(salvo);
    }

    @GetMapping("/usuario/{id}")
    public List<Compromisso> listarPorUsuarioEData(
            @PathVariable Long id,
            @RequestParam(required = false) String data) {
        LocalDate dia = (data != null && !data.isEmpty()) ? LocalDate.parse(data) : LocalDate.now();
        return compromissoRepository.findByUsuarioIdAndDataOrderByHoraAsc(id, dia);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        if (!compromissoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        compromissoRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
