package com.aps.api_agape.DTOs;

// Classe simples pra receber os dados da pulseira enviados pelo app
public class DadosPulseiraRequest {
    private Short bpm;
    private Long idUsuario;

    public Short getBpm() { return bpm; }
    public void setBpm(Short bpm) { this.bpm = bpm; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
}
