package com.aps.api_agape.DTOs;

public class NotaRequest {
    private String texto;
    private Long idUsuario;

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
}
