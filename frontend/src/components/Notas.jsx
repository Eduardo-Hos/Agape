import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authFetch } from '../api';
import { IoMdClose, IoMdTrash } from 'react-icons/io';
import Header from './Header';

// Horarios uteis da agenda (06:00 ate 22:00)
const HORARIOS = [];
for (let h = 6; h <= 22; h++) {
  HORARIOS.push(String(h).padStart(2, '0') + ':00');
}

function paraISO(d) {
  // yyyy-MM-dd no fuso local
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export default function Notas() {
  const { user } = useAuth();
  const toast = useToast();
  const [notas, setNotas] = useState([]);
  const [textoNota, setTextoNota] = useState('');
  const [carregando, setCarregando] = useState(false);

  // ===== Agenda =====
  const [dataSelecionada, setDataSelecionada] = useState(paraISO(new Date()));
  const [compromissos, setCompromissos] = useState([]);
  const [horaAberta, setHoraAberta] = useState(null); // horario com o campo aberto
  const [textoCompromisso, setTextoCompromisso] = useState('');
  const [salvandoCompromisso, setSalvandoCompromisso] = useState(false);

  const dataAtual = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  async function carregarNotas() {
    if (!user) return;
    try {
      const resposta = await authFetch('/nota/usuario/' + user.id);
      const dados = await resposta.json();
      setNotas(dados);
    } catch {
      toast.erro('Erro ao carregar notas');
    }
  }

  async function carregarCompromissos() {
    if (!user) return;
    try {
      const resposta = await authFetch('/compromisso/usuario/' + user.id + '?data=' + dataSelecionada);
      const dados = await resposta.json();
      setCompromissos(Array.isArray(dados) ? dados : []);
    } catch {
      toast.erro('Erro ao carregar agenda');
    }
  }

  useEffect(() => {
    carregarNotas();
  }, [user]);

  useEffect(() => {
    carregarCompromissos();
  }, [user, dataSelecionada]);

  async function salvarNota() {
    if (!textoNota.trim()) {
      toast.erro('Digite algo para salvar');
      return;
    }
    if (!user) {
      toast.erro('Faça login primeiro');
      return;
    }
    setCarregando(true);
    try {
      const resposta = await authFetch('/nota', {
        method: 'POST',
        body: JSON.stringify({ texto: textoNota, idUsuario: user.id }),
      });
      if (resposta.ok) {
        setTextoNota('');
        toast.sucesso('Nota salva com sucesso!');
        carregarNotas();
      } else {
        toast.erro('Erro ao salvar nota');
      }
    } catch {
      toast.erro('Erro de conexão com o servidor');
    }
    setCarregando(false);
  }

  // Acha o compromisso de um horario (HH:00)
  function compromissoDaHora(hora) {
    return compromissos.find((c) => {
      const h = (c.hora || '').slice(0, 5);
      return h === hora;
    });
  }

  async function salvarCompromisso(hora) {
    if (!textoCompromisso.trim()) {
      toast.erro('Digite o compromisso');
      return;
    }
    if (!user) {
      toast.erro('Faça login primeiro');
      return;
    }
    setSalvandoCompromisso(true);
    try {
      const resposta = await authFetch('/compromisso', {
        method: 'POST',
        body: JSON.stringify({
          texto: textoCompromisso,
          data: dataSelecionada,
          hora,
          idUsuario: user.id,
        }),
      });
      if (resposta.ok) {
        setTextoCompromisso('');
        setHoraAberta(null);
        toast.sucesso('Compromisso salvo!');
        carregarCompromissos();
      } else {
        toast.erro('Erro ao salvar compromisso');
      }
    } catch {
      toast.erro('Erro de conexão com o servidor');
    }
    setSalvandoCompromisso(false);
  }

  async function apagarCompromisso(id) {
    try {
      const resposta = await authFetch('/compromisso/' + id, { method: 'DELETE' });
      if (resposta.ok) {
        toast.info('Compromisso removido');
        carregarCompromissos();
      } else {
        toast.erro('Erro ao remover');
      }
    } catch {
      toast.erro('Erro de conexão com o servidor');
    }
  }

  return (
    <div className="notas-container">
      <Header />
      <div className="notas-content">
        <h1 className="notas-title">Notas & Agenda</h1>
        <p className="notas-date">{dataAtual}</p>

        {/* ===== AGENDA ===== */}
        <div className="agenda-box">
          <div className="agenda-top">
            <span className="agenda-data-label">Agenda do dia</span>
            <input
              type="date"
              className="agenda-data-input"
              value={dataSelecionada}
              onChange={(e) => setDataSelecionada(e.target.value)}
            />
          </div>

          <div className="agenda-list">
            {HORARIOS.map((hora) => {
              const comp = compromissoDaHora(hora);
              const aberto = horaAberta === hora;
              return (
                <div key={hora} className={'agenda-linha' + (comp ? ' tem-compromisso' : '')}>
                  <span className="agenda-hora">{hora}</span>

                  {comp ? (
                    <div className="agenda-compromisso">
                      <span className="agenda-compromisso-texto">{comp.texto}</span>
                      <button
                        className="agenda-remover"
                        title="Remover"
                        onClick={() => apagarCompromisso(comp.id)}
                      >
                        <IoMdTrash size={16} />
                      </button>
                    </div>
                  ) : aberto ? (
                    <div className="agenda-add">
                      <input
                        type="text"
                        autoFocus
                        className="agenda-input"
                        placeholder="Ex: Consulta médica"
                        value={textoCompromisso}
                        onChange={(e) => setTextoCompromisso(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') salvarCompromisso(hora);
                          if (e.key === 'Escape') {
                            setHoraAberta(null);
                            setTextoCompromisso('');
                          }
                        }}
                      />
                      <button
                        className="btn-primary agenda-salvar"
                        onClick={() => salvarCompromisso(hora)}
                        disabled={salvandoCompromisso}
                      >
                        Salvar
                      </button>
                      <button
                        className="agenda-cancelar"
                        title="Cancelar"
                        onClick={() => {
                          setHoraAberta(null);
                          setTextoCompromisso('');
                        }}
                      >
                        <IoMdClose size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      className="agenda-livre"
                      onClick={() => {
                        setHoraAberta(hora);
                        setTextoCompromisso('');
                      }}
                    >
                      + adicionar
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== NOTAS ===== */}
        <div className="notas-write">
          <textarea
            className="notas-textarea"
            placeholder="Escreva sua nota aqui..."
            value={textoNota}
            onChange={(e) => setTextoNota(e.target.value)}
          />
          <button className="btn-primary" onClick={salvarNota} disabled={carregando}>
            {carregando ? 'Carregando...' : 'Salvar Nota'}
          </button>
        </div>
        <h2 className="notas-section-title">Minhas Notas</h2>
        {notas.length === 0 ? (
          <p className="notas-empty">Nenhuma nota ainda</p>
        ) : (
          notas.map((nota) => (
            <div key={nota.id} className="notas-card">
              <p>{nota.texto}</p>
              <span className="notas-date-info">
                {new Date(nota.dataCriacao).toLocaleString('pt-BR')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
