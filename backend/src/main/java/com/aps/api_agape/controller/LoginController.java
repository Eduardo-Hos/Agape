package com.aps.api_agape.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.aps.api_agape.DTOs.LoginDTO;
import com.aps.api_agape.model.Usuario;
import com.aps.api_agape.repository.UsuarioRepository;
import com.aps.api_agape.security.JwtUtil;

@RestController
public class LoginController {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public LoginController(UsuarioRepository usuarioRepository, BCryptPasswordEncoder encoder, JwtUtil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.encoder = encoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        Usuario usuario = usuarioRepository.findByEmail(loginDTO.getEmail());

        if (usuario != null && encoder.matches(loginDTO.getSenha(), usuario.getSenha())) {
            String token = jwtUtil.gerarToken(usuario.getId(), usuario.getEmail());
            return ResponseEntity.ok(Map.of(
                "token", token,
                "id", usuario.getId(),
                "email", usuario.getEmail(),
                "telefone", usuario.getTelefone() != null ? usuario.getTelefone() : "",
                "id_tipo", usuario.getId_tipo()
            ));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou senha invalidos");
        }
    }
}
