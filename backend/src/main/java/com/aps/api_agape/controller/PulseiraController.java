package com.aps.api_agape.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aps.api_agape.model.Pulseira;
import com.aps.api_agape.repository.PulseiraRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/pulseira")
public class PulseiraController {
    private final PulseiraRepository repository;

    public PulseiraController(PulseiraRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Pulseira criar(@RequestBody Pulseira pulseira) {
        return repository.save(pulseira);
    }

    @GetMapping
    public List<Pulseira> listar(@RequestParam(defaultValue = "50") int limite) {
        List<Pulseira> todas = repository.findAll();
        if (limite <= 0 || limite >= todas.size()) {
            return todas;
        }
        return todas.subList(0, limite);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pulseira> buscar(@PathVariable Long id) {
        Pulseira pulseira = repository.findById(id).orElse(null);
        if (pulseira == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pulseira);
    }

    @GetMapping("/usuario/{id}")
    public List<Pulseira> listarPorUsuario(@PathVariable Long id) {
        return repository.findByUsuarioId(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pulseira> atualizar(@PathVariable Long id, @RequestBody Pulseira novaPulseira) {
        Pulseira pulseira = repository.findById(id).orElse(null);
        if (pulseira == null) {
            return ResponseEntity.notFound().build();
        }
        pulseira.setNome(novaPulseira.getNome());
        pulseira.setUuid(novaPulseira.getUuid());
        pulseira.setUuidService(novaPulseira.getUuidService());
        pulseira.setUuidCharacteristics(novaPulseira.getUuidCharacteristics());
        pulseira.setUsuario(novaPulseira.getUsuario());
        return ResponseEntity.ok(repository.save(pulseira));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
