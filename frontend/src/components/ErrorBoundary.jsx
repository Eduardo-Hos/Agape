import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { erro: null };
  }

  static getDerivedStateFromError(error) {
    return { erro: error };
  }

  render() {
    if (this.state.erro) {
      return (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <h2>Algo deu errado</h2>
          <p style={{ color: '#888', marginTop: 8 }}>{this.state.erro.message}</p>
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>
            Recarregar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
