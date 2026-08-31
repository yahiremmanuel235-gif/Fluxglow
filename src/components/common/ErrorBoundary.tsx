import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FluxGlow ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-[400px] flex items-center justify-center p-6 bg-brand-sand-50">
          <div className="bg-white border border-red-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center shadow-lg animate-in fade-in duration-200">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-2">
              {this.props.fallbackTitle || 'Hubo un inconveniente al cargar esta sección'}
            </h3>
            
            <p className="text-xs sm:text-sm text-stone-600 mb-6 leading-relaxed">
              Detectamos un problema temporal al procesar los datos de este módulo. No te preocupes, tus datos principales están seguros.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="w-full sm:w-auto bg-[#548c71] hover:bg-[#43705a] text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reintentar carga</span>
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto bg-stone-100 hover:bg-stone-200 text-stone-800 px-5 py-2.5 rounded-full text-xs font-bold transition-all border border-stone-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Recargar página</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
