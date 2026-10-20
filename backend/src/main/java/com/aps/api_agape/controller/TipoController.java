package com.aps.api_agape.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aps.api_agape.model.Tipo;
import com.aps.api_agape.repository.TipoRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/tipo")
public class TipoController {
    private final TipoRepository repository;

    public TipoController(TipoRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Tipo criar(@RequestBody Tipo tipo) {
        return repository.save(tipo);
    }

    @GetMapping
    public List<Tipo> listar(@RequestParam(defaultValue = "50") int limite) {
        List<Tipo> todos = repository.findAll();
        if (limite <= 0 || limite >= todos.size()) {
            return todos;
        }
        return todos.subList(0, limite);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tipo> buscar(@PathVariable("id") Byte id_tipo) {
        Tipo tipo = repository.findById(id_tipo).orElse(null);
        if (tipo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tipo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tipo> atualizar(@PathVariable("id") Byte id_tipo,
                        @RequestBody Tipo novoTipo) {
        Tipo tipo = repository.findById(id_tipo).orElse(null);
        if (tipo == null) {
            return ResponseEntity.notFound().build();
        }
        tipo.setTipo(novoTipo.getTipo());
        return ResponseEntity.ok(repository.save(tipo));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable("id") Byte id_tipo) {
        repository.deleteById(id_tipo);
    }
}
