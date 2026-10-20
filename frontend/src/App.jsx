import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/Login';
import Home from './components/Home';
import Pulseira from './components/Pulseira';
import Cadastro from './components/Cadastro';
import Notas from './components/Notas';
import Info from './components/Info';
import Historico from './components/Historico';

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/pulseira" element={<Pulseira />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/notas" element={<Notas />} />
        <Route path="/info" element={<Info />} />
        <Route path="/historico" element={<Historico />} />
      </Routes>
    </ErrorBoundary>
  );
}
