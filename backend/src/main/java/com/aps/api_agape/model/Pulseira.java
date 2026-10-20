package com.aps.api_agape.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(indexes = {
    @Index(name = "idx_pulseira_usuario", columnList = "id_usuario"),
    @Index(name = "idx_pulseira_uuid", columnList = "uuid")
})
public class Pulseira {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String uuid;
    private String uuidService;
    private String uuidCharacteristics;
    private String tipo;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnoreProperties({"senha", "email", "telefone", "id_tipo"})
    private Usuario usuario;

    public Pulseira() {}

    public Pulseira(String nome, String uuid, String uuidService, String uuidCharacteristics, String tipo, Usuario usuario) {
        this.nome = nome;
        this.uuid = uuid;
        this.uuidService = uuidService;
        this.uuidCharacteristics = uuidCharacteristics;
        this.tipo = tipo;
        this.usuario = usuario;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getUuid() { return uuid; }
    public void setUuid(String uuid) { this.uuid = uuid; }

    public String getUuidService() { return uuidService; }
    public void setUuidService(String uuidService) { this.uuidService = uuidService; }

    public String getUuidCharacteristics() { return uuidCharacteristics; }
    public void setUuidCharacteristics(String uuidCharacteristics) { this.uuidCharacteristics = uuidCharacteristics; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}
