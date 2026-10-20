package com.aps.api_agape.DTOs;

public class CompromissoRequest {
    private String texto;
    private String data; // formato ISO: yyyy-MM-dd
    private String hora; // formato: HH:mm
    private Long idUsuario;

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public String getData() { return data; }
    public void setData(String data) { this.data = data; }

    public String getHora() { return hora; }
    public void setHora(String hora) { this.hora = hora; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
}
