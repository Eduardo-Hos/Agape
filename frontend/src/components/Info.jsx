import React from 'react';
import Header from './Header';
import informacao from './img/informacao.png';

export default function Info() {
  return (
    <div className="info-container">
      <Header />
      <div className="info-content">
        <h1 className="info-title">Sobre o Autismo</h1>
        <img src={informacao} alt="Informação" className="info-img" />
        <div className="info-card">
          <p>
            <br />• O que é o TEA?<br />O Transtorno do Espectro Autista (TEA) é uma condição
            neurológica e do neurodesenvolvimento que afeta principalmente:<br /><br />• Comunicação
            (verbal e não verbal)<br />• Interação social<br />• Comportamento e interesses
            (geralmente restritos ou repetitivos)<br /><br />O termo "espectro" é usado porque as
            características variam muito de pessoa para pessoa, desde quadros leves até mais
            intensos.<br /><br />• Quando aparece?<br />Os sinais geralmente surgem antes dos 3
            anos de idade, mas o diagnóstico pode ser feito em qualquer momento da vida. Algumas
            crianças já são perceptíveis na primeira infância.<br /><br />• Tratamento e apoio:<br />O
            TEA não tem cura, mas há muitas formas de apoio e intervenção que ajudam a melhorar a
            qualidade de vida.<br /><br />• Terapias comportamentais (ex: ABA)<br />• Fonoaudiologia
            (trabalho com linguagem e comunicação)<br />• Terapia ocupacional (habilidades sociais e
            motoras)<br />• Psicoterapia<br />• Apoio educacional e social adaptado<br /><br />É
            essencial respeitar a individualidade da pessoa e potencializar suas habilidades.
          </p>
        </div>
      </div>
    </div>
  );
}
