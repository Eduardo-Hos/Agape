// Em desenvolvimento, usamos o proxy do Vite (/api -> API Spring),
// evitando bloqueio de mixed content (https -> http). O proxy esta
// configurado no vite.config.js.
const API_URL = import.meta.env.VITE_API_URL || '/api';

export function authFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  return fetch(API_URL + path, { ...options, headers });
}

export default API_URL;
