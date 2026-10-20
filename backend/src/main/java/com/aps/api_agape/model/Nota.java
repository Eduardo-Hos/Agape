package com.aps.api_agape.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
public class Nota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String texto;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dataCriacao;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @JsonIgnoreProperties({"senha", "email", "telefone", "id_tipo"})
    private Usuario usuario;

    public Nota() {}

    public Nota(String texto, Date dataCriacao, Usuario usuario) {
        this.texto = texto;
        this.dataCriacao = dataCriacao;
        this.usuario = usuario;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public Date getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(Date dataCriacao) { this.dataCriacao = dataCriacao; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
