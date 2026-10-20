import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import pulseiraIcon from './img/pulseira.png';
import caderno from './img/caderno.png';
import puzzle from './img/puzzle.png';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Header />
      <div className="home-hero">
        <div className="home-hero-content">
          <div className="home-hero-text">
            <h1>Ágape</h1>
            <p>
              Site especializado em auxiliar famílias e cuidadores de pessoas com TEA
            </p>
            <button className="home-hero-btn" onClick={() => navigate('/pulseira')}>
              COMEÇAR AGORA
            </button>
          </div>
        </div>
      </div>
      <div className="home-section">
        <h2>
          Estratégias e métodos que o ajudarão a lidar e cuidar melhor de um
          filho portador de TEA
        </h2>
        <p>
          A utilização de nosso site terá como benefício uma melhor organização
          e um auxílio a mais para ajudar famílias com filhos autistas.
        </p>
      </div>
      <div className="home-cards">
        <div className="home-card">
          <img src={pulseiraIcon} alt="Pulseira" />
          <h3>PULSEIRA</h3>
          <p>
            A partir do exame foi diagnosticado TEA, e a pulseira auxilia na
            identificação e prevenção em casos de emergência.
          </p>
          <button className="btn-primary" onClick={() => navigate('/pulseira')}>
            Exibir
          </button>
        </div>
        <div className="home-card">
          <img src={caderno} alt="Notas" />
          <h3>NOTAS/AGENDA</h3>
          <p>
            Uma forma organizada de anotar atividades, consultas e informações
            importantes sobre o dia do seu filho.
          </p>
          <button className="btn-primary" onClick={() => navigate('/notas')}>
            Exibir
          </button>
        </div>
        <div className="home-card">
          <img src={puzzle} alt="Informacoes" />
          <h3>INFORMAÇÕES</h3>
          <p>
            Você saberá tudo que está incluso nesta ferramenta, com dicas e
            orientações sobre TEA.
          </p>
          <button className="btn-primary" onClick={() => navigate('/info')}>
            Exibir
          </button>
        </div>
      </div>
    </div>
  );
}
