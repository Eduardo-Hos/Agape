package com.aps.api_agape.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aps.api_agape.model.Nota;

public interface NotaRepository extends JpaRepository<Nota, Long> {
    List<Nota> findByUsuarioIdOrderByDataCriacaoDesc(Long idUsuario);
}
