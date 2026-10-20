package com.aps.api_agape.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Index;

@Entity
@Table(indexes = {
    @Index(name = "idx_usuario_email", columnList = "email", unique = true)
})
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String senha;
    private String telefone;
    private Byte id_tipo;

    public Usuario() {}

    public Usuario(String email, String senha, String telefone, Byte id_tipo) {
        this.email = email;
        this.senha = senha;
        this.telefone = telefone;
        this.id_tipo = id_tipo;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public Byte getId_tipo() { return id_tipo; }
    public void setId_tipo(Byte id_tipo) { this.id_tipo = id_tipo; }
}
