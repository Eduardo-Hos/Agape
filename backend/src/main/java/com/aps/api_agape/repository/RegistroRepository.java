package com.aps.api_agape.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aps.api_agape.model.Registro;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
    List<Registro> findByUuidService(String uuidService);
    List<Registro> findByUuidServiceContaining(String parteDoUuid);

    // Busca todos os registros de batimentos de um usuario
    List<Registro> findByUsuarioIdOrderByTimestampDesc(Long idUsuario);
}
