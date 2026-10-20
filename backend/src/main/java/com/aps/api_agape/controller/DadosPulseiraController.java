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
@RequestMapping("/dados-pulseira")
public class DadosPulseiraController {

    private final RegistroRepository registroRepository;
    private final UsuarioRepository usuarioRepository;

    public DadosPulseiraController(RegistroRepository registroRepository,
                                    UsuarioRepository usuarioRepository) {
        this.registroRepository = registroRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping
    public ResponseEntity<?> salvarBatimento(@RequestBody DadosPulseiraRequest request) {
        Usuario usuario = usuarioRepository.findById(request.getIdUsuario()).orElse(null);
        if (usuario == null) {
            return ResponseEntity.badRequest().body("Usuario nao encontrado");
        }

        Registro registro = new Registro();
        registro.setBpm(request.getBpm());
        registro.setTimestamp(new Date());
        registro.setUsuario(usuario);

        Registro salvo = registroRepository.save(registro);
        return ResponseEntity.ok(salvo);
    }

    @GetMapping("/usuario/{id}")
    public List<Registro> listarPorUsuario(@PathVariable Long id) {
        return registroRepository.findByUsuarioIdOrderByTimestampDesc(id);
    }
}
