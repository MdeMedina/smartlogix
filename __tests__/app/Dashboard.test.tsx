import { render, screen } from '@testing-library/react';
import Navbar from '@/components/shared/Navbar';
import Dashboard from '@/app/page';
import { useSmartLogix } from '@/context/SmartLogixContext';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock del context
jest.mock('@/context/SmartLogixContext');

describe('Componentes Globales (M-04)', () => {
  
  describe('Navbar', () => {
    test('Navbar muestra los links principales', () => {
      render(<Navbar />);
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
      expect(screen.getByText(/inventario/i)).toBeInTheDocument();
      expect(screen.getByText(/pedidos/i)).toBeInTheDocument();
    });
  });

  describe('Dashboard', () => {
    test('Dashboard muestra spinner mientras carga', () => {
      (useSmartLogix as jest.Mock).mockReturnValue({ 
        dashboard: null, 
        loading: true 
      });
      render(<Dashboard />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    test('Dashboard muestra métricas correctamente cuando carga termina', () => {
      (useSmartLogix as jest.Mock).mockReturnValue({ 
        dashboard: {
          totalProductos: 100,
          productosBajoStock: 5,
          totalPedidos: 20,
          pedidosPendientes: 3,
          parcial: false
        }, 
        loading: false 
      });
      render(<Dashboard />);
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    test('Dashboard muestra banner si los datos son parciales', () => {
      (useSmartLogix as jest.Mock).mockReturnValue({ 
        dashboard: {
          totalProductos: 0,
          productosBajoStock: 0,
          totalPedidos: 0,
          pedidosPendientes: 0,
          parcial: true
        }, 
        loading: false 
      });
      render(<Dashboard />);
      expect(screen.getByText(/servicio parcialmente disponible/i)).toBeInTheDocument();
    });
  });
});
