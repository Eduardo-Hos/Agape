import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdMenu, IoMdPerson } from 'react-icons/io';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import logo from './img/logoagape.png';
import pulseiraIcon from './img/pulseira.png';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('darkMode', dark);
  }, [dark]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-top">
          <IoMdMenu size={28} />
          <button className="header-user" onClick={handleLogout} title="Sair">
            <IoMdPerson size={22} />
            <span>{user?.email || 'Usuário'}</span>
          </button>
          <div className="header-theme-right">
            <ThemeToggle dark={dark} onToggle={() => setDark((d) => !d)} />
          </div>
        </div>
        <div className="header-bottom">
          <img src={logo} alt="Logo" className="header-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/home')} />
          <button className="header-pulseira-btn" onClick={() => navigate('/pulseira')}>
            <span>Pulseira</span>
            <img src={pulseiraIcon} alt="Pulseira" className="header-pulseira-img" />
          </button>
        </div>
      </div>
    </header>
  );
}
