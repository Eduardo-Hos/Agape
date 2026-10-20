import React from 'react';

export default function ThemeToggle({ dark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={dark ? 'Modo claro' : 'Modo escuro'}
      className="header-user"
      style={{ fontSize: 16 }}
    >
      {dark ? '\u2600\uFE0F Claro' : '\uD83C\uDF19 Escuro'}
    </button>
  );
}
