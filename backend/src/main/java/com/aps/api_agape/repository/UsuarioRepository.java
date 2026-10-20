package com.aps.api_agape.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aps.api_agape.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Busca usuario pelo email (usado no login)
    Usuario findByEmail(String email);

    // Busca usuarios que contenham parte do email
    List<Usuario> findByEmailContaining(String parteDoEmail);
}
