import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const sucesso = useCallback((msg) => addToast(msg, 'sucesso'), [addToast]);
  const erro = useCallback((msg) => addToast(msg, 'erro'), [addToast]);
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);

  const remover = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ sucesso, erro, info }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span>{t.message}</span>
            <button className="toast-close" onClick={() => remover(t.id)}>&times;</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
