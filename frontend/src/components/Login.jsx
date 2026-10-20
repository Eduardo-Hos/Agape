import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdCheckbox, IoMdSquareOutline } from 'react-icons/io';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import logo from './img/logoagape.png';
import google from './img/google.png';
import facebook from './img/Facebook.png';
import API_URL from '../api';

export default function Login() {
  const navigate = useNavigate();
  const { login, logado } = useAuth();
  const toast = useToast();
  const [lembrar, setLembrar] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (logado) navigate('/home');
    const emailSalvo = localStorage.getItem('emailLembrado');
    if (emailSalvo) {
      setEmail(emailSalvo);
      setLembrar(true);
    }
  }, [navigate, logado]);

  async function handleLogin(e) {
    e.preventDefault();
    if (!email || !senha) {
      toast.erro('Preencha todos os campos');
      return;
    }
    setCarregando(true);
    try {
      const response = await fetch(API_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data);
        if (lembrar) {
          localStorage.setItem('emailLembrado', email);
        } else {
          localStorage.removeItem('emailLembrado');
        }
        toast.sucesso('Login realizado com sucesso!');
        navigate('/home');
      } else {
        toast.erro(data || 'Email ou senha inválidos');
      }
    } catch {
      toast.erro('Erro de conexão com o servidor');
    }
    setCarregando(false);
  }

  async function entrarSemLogin() {
    setCarregando(true);
    try {
      // Faz login numa conta "visitante" real do banco, para que
      // Notas/Historico/Pulseira funcionem sem dar erro.
      const response = await fetch(API_URL + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'visitante@agape.com', senha: 'visitante' }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data);
        navigate('/home');
      } else {
        toast.erro('Erro ao entrar como visitante');
      }
    } catch {
      toast.erro('Erro de conexão com o servidor');
    }
    setCarregando(false);
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logo} alt="Logo" className="login-logo" />
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleLogin}>
          <label className="login-label">E-mail</label>
          <input
            className="login-input"
            placeholder="Digite seu e-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="login-label">Senha</label>
          <input
            className="login-input"
            placeholder="Digite sua senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <div className="login-options">
            <label className="login-checkbox" onClick={() => setLembrar(!lembrar)}>
              {lembrar ? <IoMdCheckbox size={20} color="#1e50ff" /> : <IoMdSquareOutline size={20} />}
              Lembrar meu email
            </label>
            <button type="button" className="login-link" onClick={() => toast.info('Funcionalidade em breve')}>
              Esqueci minha senha
            </button>
          </div>
          <div className="login-buttons">
            <button type="submit" className="btn-primary" disabled={carregando}>
              {carregando ? 'Carregando...' : 'Acessar'}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/cadastro')}>
              Cadastrar
            </button>
          </div>
        </form>
        <div className="login-divider">
          <span className="login-divider-line" />
          <span className="login-divider-text">Ou continue com</span>
          <span className="login-divider-line" />
        </div>
        <div className="login-social">
          <button className="login-social-btn" onClick={() => toast.info('Funcionalidade em breve')}>
            <img src={google} alt="Google" />
          </button>
          <button className="login-social-btn" onClick={() => toast.info('Funcionalidade em breve')}>
            <img src={facebook} alt="Facebook" className="login-facebook-img" />
          </button>
        </div>
        <button className="btn-secondary" style={{ width: '100%', marginTop: 12 }} onClick={entrarSemLogin}>
          Acessar sem login (provisorio)
        </button>
      </div>
    </div>
  );
}
