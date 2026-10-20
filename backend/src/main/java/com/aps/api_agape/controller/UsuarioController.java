package com.aps.api_agape.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.aps.api_agape.model.Usuario;
import com.aps.api_agape.repository.UsuarioRepository;
import com.aps.api_agape.security.JwtUtil;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {

    private final UsuarioRepository repository;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public UsuarioController(UsuarioRepository repository, BCryptPasswordEncoder encoder, JwtUtil jwtUtil) {
        this.repository = repository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Usuario usuario) {
        if (repository.findByEmail(usuario.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Email ja cadastrado");
        }
        usuario.setSenha(encoder.encode(usuario.getSenha()));
        Usuario salvo = repository.save(usuario);
        String token = jwtUtil.gerarToken(salvo.getId(), salvo.getEmail());
        return ResponseEntity.ok(Map.of(
            "token", token,
            "id", salvo.getId(),
            "email", salvo.getEmail(),
            "telefone", salvo.getTelefone() != null ? salvo.getTelefone() : "",
            "id_tipo", salvo.getId_tipo()
        ));
    }

    @GetMapping
    public List<Usuario> listar(@RequestParam(defaultValue = "50") int limite) {
        List<Usuario> todos = repository.findAll();
        todos.forEach(u -> u.setSenha(null));
        if (limite <= 0 || limite >= todos.size()) {
            return todos;
        }
        return todos.subList(0, limite);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> buscar(@PathVariable("id") Long id_usuario) {
        Usuario usuario = repository.findById(id_usuario).orElse(null);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        usuario.setSenha(null);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> atualizar(@PathVariable("id") Long id_usuario,
                             @RequestBody Usuario novoUsuario) {
        Usuario usuario = repository.findById(id_usuario).orElse(null);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        usuario.setEmail(novoUsuario.getEmail());
        if (novoUsuario.getSenha() != null && !novoUsuario.getSenha().isEmpty()) {
            usuario.setSenha(encoder.encode(novoUsuario.getSenha()));
        }
        usuario.setTelefone(novoUsuario.getTelefone());
        usuario.setId_tipo(novoUsuario.getId_tipo());
        Usuario atualizado = repository.save(usuario);
        atualizado.setSenha(null);
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    public void excluir(@PathVariable("id") Long id_usuario) {
        repository.deleteById(id_usuario);
    }
}
