import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdRemove } from 'react-icons/io';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authFetch } from '../api';
import { conectarPulseira, temSuporteBluetooth } from '../bluetooth';
import Header from './Header';
import pulseiraIcon from './img/pulseira.png';

export default function Pulseira() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [bpm, setBpm] = useState(75);
  const [statusBluetooth, setStatusBluetooth] = useState('');
  const [simulacao, setSimulacao] = useState(
    () => localStorage.getItem('modoSimulacao') === 'true'
  );

  function toggleSimulacao() {
    const novo = !simulacao;
    setSimulacao(novo);
    localStorage.setItem('modoSimulacao', novo);
  }
  const [conectado, setConectado] = useState(false);
  const conexaoRef = useRef(null);
  const ultimoEnvioRef = useRef(0);

  useEffect(() => {
    async function buscarUltimo() {
      if (!user) return;
      try {
        const response = await authFetch('/dados-pulseira/usuario/' + user.id);
        const data = await response.json();
        if (data.length > 0) setBpm(data[0].bpm);
      } catch {
        toast.erro('Erro ao buscar dados da pulseira');
      }
    }
    buscarUltimo();
  }, [user]);

  async function enviarBpm(novoBpm) {
    if (!user) return;
    try {
      const response = await authFetch('/dados-pulseira', {
        method: 'POST',
        body: JSON.stringify({ bpm: novoBpm, idUsuario: user.id }),
      });
      if (!response.ok) toast.erro('Erro ao salvar batimento');
    } catch {
      toast.erro('Erro de conexão com o servidor');
    }
  }

  // Recebe um BPM vindo do Bluetooth (ESP32)
  function receberBpmBluetooth(novoBpm) {
    setBpm(novoBpm);
    // Salva no banco no maximo 1x a cada 10 segundos (evita excesso de requisicoes)
    const agora = Date.now();
    if (agora - ultimoEnvioRef.current > 10000) {
      ultimoEnvioRef.current = agora;
      enviarBpm(novoBpm);
    }
  }

  async function conectarBluetooth(tipo) {
    try {
      setStatusBluetooth('Procurando...');
      const conexao = await conectarPulseira(
        tipo,
        receberBpmBluetooth,
        (msg) => setStatusBluetooth(msg)
      );
      conexaoRef.current = conexao;
      setConectado(true);
      toast.sucesso('Conectado em ' + conexao.nome);
    } catch (e) {
      setConectado(false);
      setStatusBluetooth('');
      toast.erro(e.message || 'Não foi possível conectar');
    }
  }

  function desconectarBluetooth() {
    if (conexaoRef.current) {
      conexaoRef.current.desconectar();
      conexaoRef.current = null;
    }
    setConectado(false);
    setStatusBluetooth('');
    toast.info('Desconectado');
  }

  useEffect(() => {
    return () => {
      if (conexaoRef.current) conexaoRef.current.desconectar();
    };
  }, []);

  function aumentar() {
    const novo = Math.min(bpm + 5, 200);
    setBpm(novo);
    enviarBpm(novo);
  }

  function diminuir() {
    const novo = Math.max(bpm - 5, 40);
    setBpm(novo);
    enviarBpm(novo);
  }

  function corStatus() {
    if (bpm < 80) return '#00ff00';
    if (bpm < 100) return '#ffff00';
    if (bpm < 120) return '#800080';
    return '#ff0000';
  }

  function textoStatus() {
    if (bpm < 80) return 'Estável';
    if (bpm < 100) return 'Moderado';
    if (bpm < 120) return 'Alerta';
    return 'Grave';
  }

  return (
    <div className="pulseira-container">
      <Header />
      <div className="pulseira-card">
        <h2 style={{ fontWeight: 'normal' }}>Monitor de Batimentos</h2>
        <img src={pulseiraIcon} alt="Pulseira" className="pulseira-img" />
        <p className="pulseira-bpm-label">BPM:</p>
        <div className="pulseira-bpm">
          <span className="pulseira-bpm-num">{bpm}</span>
          <span className="pulseira-bpm-unit">BPM</span>
        </div>
        {simulacao && (
          <div className="pulseira-controls">
            <button className="pulseira-btn-control" onClick={diminuir}>
              <IoMdRemove size={24} color="#fff" />
            </button>
            <button className="pulseira-btn-control" onClick={aumentar}>
              <IoMdAdd size={24} color="#fff" />
            </button>
          </div>
        )}
        <div className="pulseira-status">
          <p>Situação atual:</p>
          <div className="pulseira-status-indicator">
            <span className="pulseira-dot" style={{ backgroundColor: corStatus() }} />
            <span>{textoStatus()}</span>
          </div>
        </div>
        <div style={{ marginTop: 16, marginBottom: 8 }}>
          {!temSuporteBluetooth() ? (
            <p style={{ fontSize: 13, color: '#888', textAlign: 'center' }}>
              Este navegador não tem Bluetooth. Use o Chrome no celular Android.
            </p>
          ) : conectado ? (
            <button className="btn-secondary" style={{ width: '100%' }} onClick={desconectarBluetooth}>
              Desconectar pulseira
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={() => conectarBluetooth('pulseira')}>
                Conectar Pulseira
              </button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => conectarBluetooth('hub')}>
                Conectar Hub
              </button>
            </div>
          )}
          {statusBluetooth && (
            <p style={{ fontSize: 13, color: '#555', textAlign: 'center', marginTop: 8 }}>
              {statusBluetooth}
            </p>
          )}
        </div>
        <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => navigate('/historico')}>
          Histórico da pulseira
        </button>
      </div>
      <button
        className={'pulseira-simulacao' + (simulacao ? ' ativo' : '')}
        onClick={toggleSimulacao}
      >
        Modo simulação: {simulacao ? 'LIGADO' : 'DESLIGADO'}
      </button>
      <div className="pulseira-info">
        <h3>Como funciona?</h3>
        <p>
          O projeto utiliza duas pulseiras com funções diferentes: a pulseira 1 é destinada ao
          cuidador de TEA e a pulseira 2 ao responsável pelo acompanhamento. Ambas possuem um
          sensor de batimentos cardíacos (MAX30102) que mede continuamente os BPM (batimentos por
          minuto) da pessoa que a utiliza.
        </p>
        <p>
          O objetivo é ajudar a identificar crises de ansiedade antes que elas se agravem. Quando
          uma pessoa entra em crise, o coração acelera antes dos outros sintomas aparecerem.
          Assim, ao perceber a aceleração dos batimentos, a pulseira emite um alerta luminoso,
          permitindo que o cuidador aja com antecedência.
        </p>
        <p>
          Conforme os BPM medidos, os LEDs acendem com cores diferentes, indicando o estado atual:
        </p>
        <div className="pulseira-legend">
          <p>VERDE = até 80 &rarr; Estável (batimento normal)</p>
          <p>AMARELO = 80 ~ 100 &rarr; Moderado (leve elevação)</p>
          <p>ROXO = 100 ~ 120 &rarr; Alerta (possível início de crise)</p>
          <p>VERMELHO = 120 ou mais &rarr; Grave (crise em andamento)</p>
        </div>
        <p>
          Além das cores, quando os batimentos atingem 120 BPM ou mais, a pulseira também aciona
          um aviso sonoro (buzzer) e envia o alerta para o aplicativo, permitindo que o responsável
          seja notificado mesmo estando em outro ambiente.
        </p>
        <p>
          É importante destacar que a frequência cardíaca normal em repouso varia conforme a
          idade: crianças têm batimentos naturalmente mais altos que adultos. Por isso, o
          dispositivo é indicado apenas a partir dos 8 anos, e as faixas de referência adotadas
          neste projeto são:
        </p>
        <div className="pulseira-legend">
          <p>8 a 12 anos &rarr; 70 ~ 110 bpm</p>
          <p>12 a 18 anos &rarr; 60 ~ 100 bpm</p>
          <p>18 a 30 anos &rarr; 60 ~ 100 bpm</p>
        </div>
        <p>
          Dessa forma, a pulseira não substitui nenhum diagnóstico médico: ela serve como uma
          ferramenta de apoio para o cuidado e o acompanhamento no dia a dia, oferecendo mais
          segurança e tranquilidade para as famílias e cuidadores.
        </p>
      </div>
    </div>
  );
}
