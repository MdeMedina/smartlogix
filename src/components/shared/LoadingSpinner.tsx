'use client';

import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full" data-testid="loading-spinner">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-b-indigo-400 rounded-full animate-spin-slow opacity-50"></div>
      </div>
      <p className="mt-4 text-slate-500 font-medium animate-pulse text-sm tracking-wide uppercase">
        Cargando Inventario...
      </p>
    </div>
  );
};

export default LoadingSpinner;
