package com.aps.api_agape.controller;

import java.util.Date;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aps.api_agape.DTOs.DadosPulseiraRequest;
import com.aps.api_agape.model.Registro;
import com.aps.api_agape.model.Usuario;
import com.aps.api_agape.repository.RegistroRepository;
import com.aps.api_agape.repository.UsuarioRepository;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/registro")
public class RegistroController {
    private final RegistroRepository repository;
    private final UsuarioRepository usuarioRepository;

    public RegistroController(RegistroRepository repository,
                              UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody DadosPulseiraRequest request) {
        if (request.getIdUsuario() == null) {
            return ResponseEntity.badRequest().body("idUsuario e obrigatorio");
        }
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario()).orElse(null);
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuario nao encontrado");
        }

        Registro registro = new Registro();
        registro.setBpm(request.getBpm());
        registro.setTimestamp(new Date());
        registro.setUsuario(usuario);

        return ResponseEntity.ok(repository.save(registro));
    }

    @GetMapping
    public List<Registro> listar(@RequestParam(defaultValue = "50") int limite) {
        List<Registro> todos = repository.findAll();
        if (limite <= 0 || limite >= todos.size()) {
            return todos;
        }
        return todos.subList(0, limite);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Registro> buscar(@PathVariable Long id) {
        Registro registro = repository.findById(id).orElse(null);
        if (registro == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(registro);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Registro> atualizar(@PathVariable Long id,
                        @RequestBody Registro novoRegistro) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Registro registro = repository.findById(id).get();
        registro.setTimestamp(novoRegistro.getTimestamp());
        registro.setBpm(novoRegistro.getBpm());
        return ResponseEntity.ok(repository.save(registro));
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
