package com.aps.api_agape.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.aps.api_agape.model.Tipo;

// O id de Tipo e Byte (tinyint), entao o tipo da chave precisa ser Byte
public interface TipoRepository extends JpaRepository<Tipo, Byte> {
}
