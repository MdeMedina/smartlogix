import '@testing-library/jest-dom';
import React from 'react';

// Mock de lucide-react usando React.createElement para evitar errores de sintaxis JSX en archivo .ts
jest.mock('lucide-react', () => ({
  Package: (props: any) => React.createElement('div', { ...props, 'data-testid': 'package-icon' }),
  Plus: (props: any) => React.createElement('div', { ...props, 'data-testid': 'plus-icon' }),
  Minus: (props: any) => React.createElement('div', { ...props, 'data-testid': 'minus-icon' }),
  RefreshCw: (props: any) => React.createElement('div', { ...props, 'data-testid': 'refresh-icon' }),
  AlertCircle: (props: any) => React.createElement('div', { ...props, 'data-testid': 'alert-icon' }),
  X: (props: any) => React.createElement('div', { ...props, 'data-testid': 'close-icon' }),
  Save: (props: any) => React.createElement('div', { ...props, 'data-testid': 'save-icon' }),
  Edit: (props: any) => React.createElement('div', { ...props, 'data-testid': 'edit-icon' }),
  Trash2: (props: any) => React.createElement('div', { ...props, 'data-testid': 'trash-icon' }),
  AlertTriangle: (props: any) => React.createElement('div', { ...props, 'data-testid': 'alert-triangle-icon' }),
}));