package com.aps.api_agape.model;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(indexes = {
    @Index(name = "idx_registro_usuario", columnList = "id_usuario"),
    @Index(name = "idx_registro_timestamp", columnList = "timestamp")
})
public class Registro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timestamp;

    private Short bpm;
    private String uuidService;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    @JsonIgnoreProperties({"senha", "email", "telefone", "id_tipo"})
    private Usuario usuario;

    public Registro() {}

    public Registro(Short bpm, Date timestamp, Usuario usuario) {
        this.bpm = bpm;
        this.timestamp = timestamp;
        this.usuario = usuario;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Short getBpm() { return bpm; }
    public void setBpm(Short bpm) { this.bpm = bpm; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }

    public String getUuidService() { return uuidService; }
    public void setUuidService(String uuidService) { this.uuidService = uuidService; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
