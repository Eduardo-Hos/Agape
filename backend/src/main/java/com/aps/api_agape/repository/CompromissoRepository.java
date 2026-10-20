package com.aps.api_agape.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aps.api_agape.model.Compromisso;

public interface CompromissoRepository extends JpaRepository<Compromisso, Long> {
    List<Compromisso> findByUsuarioIdAndDataOrderByHoraAsc(Long idUsuario, LocalDate data);
}
