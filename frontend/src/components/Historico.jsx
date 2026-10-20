import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authFetch } from '../api';

export default function Historico() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);

  async function carregarHistorico() {
    if (!user) return;
    setCarregando(true);
    try {
      const response = await authFetch('/dados-pulseira/usuario/' + user.id);
      const data = await response.json();
      setHistorico(data);
    } catch {
      toast.erro('Erro ao carregar histórico');
    }
    setCarregando(false);
  }

  useEffect(() => {
    carregarHistorico();
  }, [user]);

  return (
    <div className="historico-container">
      <h1 className="historico-title">Histórico da Pulseira</h1>
      <button className="btn-primary historico-btn" onClick={carregarHistorico}>
        Atualizar
      </button>
      {carregando ? (
        <p className="historico-loading">Carregando...</p>
      ) : historico.length === 0 ? (
        <p className="historico-empty">Nenhum batimento registrado ainda</p>
      ) : (
        <div className="historico-list">
          {historico.map((item) => {
            const ts = new Date(item.timestamp).toLocaleString('pt-BR');
            return (
              <div key={item.id} className="historico-item">
                <span className="historico-bpm">BPM: {item.bpm}</span>
                <span className="historico-ts">{ts}</span>
                <span className="historico-user">Usuário ID: {item.usuario?.id}</span>
              </div>
            );
          })}
        </div>
      )}
      <button className="btn-secondary historico-voltar" onClick={() => navigate('/pulseira')}>
        Voltar
      </button>
    </div>
  );
}
