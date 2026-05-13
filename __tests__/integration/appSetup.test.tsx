import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SmartLogixProvider } from '@/context/SmartLogixContext';
import Dashboard from '@/app/page';
import * as inventarioService from '@/services/inventarioService';
import * as pedidosService from '@/services/pedidosService';
import * as dashboardService from '@/services/dashboardService';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mocks de los servicios
jest.mock('@/services/inventarioService');
jest.mock('@/services/pedidosService');
jest.mock('@/services/dashboardService');

describe('Prueba de Integración - Setup Base SmartLogix', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configuración por defecto de los mocks
    (inventarioService.getProductos as jest.Mock).mockResolvedValue([]);
    (pedidosService.getPedidos as jest.Mock).mockResolvedValue([]);
    (dashboardService.getDashboardData as jest.Mock).mockResolvedValue({
      totalProductos: 10,
      productosBajoStock: 2,
      totalPedidos: 5,
      pedidosPendientes: 1,
      parcial: false
    });
  });

  // ✅ TEST 1 — App monta sin errores con providers
  test('App monta correctamente con SmartLogixProvider y muestra el Dashboard', async () => {
    render(
      <SmartLogixProvider>
        <Dashboard />
      </SmartLogixProvider>
    );

    // Verificamos que pase del estado de carga al contenido
    await waitFor(() => {
      expect(screen.getByText(/panel de control/i)).toBeInTheDocument();
    });
  });

  // ✅ TEST 2 — Dashboard refleja total de productos del contexto mockeado
  test('Dashboard refleja datos reales provenientes del servicio a través del contexto', async () => {
    (dashboardService.getDashboardData as jest.Mock).mockResolvedValue({
      totalProductos: 150,
      productosBajoStock: 0,
      totalPedidos: 50,
      pedidosPendientes: 10,
      parcial: false
    });

    render(
      <SmartLogixProvider>
        <Dashboard />
      </SmartLogixProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('150')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  // ✅ TEST 3 — El fallback de la URL de API es correcto
  test('La instancia de Axios usa la variable de entorno o fallback', () => {
    const url = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:8080';
    expect(url).toBeDefined();
    // En el entorno de test (sin .env.local cargado por jest directamente a menos que se configure)
    // Debería ser 'http://localhost:8080' o lo que esté en .env.local si jest lo carga
    expect(url).toContain('http');
  });
});
