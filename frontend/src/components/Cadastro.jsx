import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import logo from './img/logoagape.png';
import API_URL from '../api';

export default function Cadastro() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [id_tipo, setIdTipo] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function handleCadastro(e) {
    e.preventDefault();
    if (!email || !senha || !telefone || !id_tipo) {
      toast.erro('Preencha todos os campos');
      return;
    }
    if (!email.includes('@')) {
      toast.erro('Digite um email válido');
      return;
    }
    if (senha.length < 4) {
      toast.erro('A senha deve ter pelo menos 4 caracteres');
      return;
    }
    setCarregando(true);
    try {
      const response = await fetch(API_URL + '/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, telefone, id_tipo: Number(id_tipo) }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data);
        toast.sucesso('Cadastro realizado com sucesso!');
        navigate('/');
      } else {
        toast.erro(data || 'Erro ao cadastrar usuário');
      }
    } catch {
      toast.erro('Erro de conexão com o servidor');
    }
    setCarregando(false);
  }

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <img src={logo} alt="Logo" className="cadastro-logo" />
        <h1 className="cadastro-title">Cadastro</h1>
        <form onSubmit={handleCadastro}>
          <label className="cadastro-label">E-mail</label>
          <input
            className="cadastro-input"
            placeholder="Digite seu e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="cadastro-label">Senha</label>
          <input
            className="cadastro-input"
            placeholder="Digite sua senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <label className="cadastro-label">Telefone</label>
          <input
            className="cadastro-input"
            placeholder="Digite seu telefone"
            type="text"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          <label className="cadastro-label">Tipo de Usuário</label>
          <select
            className="cadastro-input"
            value={id_tipo}
            onChange={(e) => setIdTipo(e.target.value)}
          >
            <option value="">Selecione...</option>
            <option value="1">Portador</option>
            <option value="2">Cuidador</option>
          </select>
          <button type="submit" className="btn-primary cadastro-btn" disabled={carregando}>
            {carregando ? 'Carregando...' : 'Cadastrar'}
          </button>
          <button type="button" className="btn-secondary cadastro-btn" onClick={() => navigate('/')}>
            Voltar para Login
          </button>
        </form>
      </div>
    </div>
  );
}
