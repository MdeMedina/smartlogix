import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SmartLogixProvider, useSmartLogix } from '@/context/SmartLogixContext';
import * as inventarioService from '@/services/inventarioService';
import * as pedidosService from '@/services/pedidosService';
import * as dashboardService from '@/services/dashboardService';

// Mocks de los servicios
jest.mock('@/services/inventarioService');
jest.mock('@/services/pedidosService');
jest.mock('@/services/dashboardService');

const ComponenteTest = () => {
  const { productos, loading, dashboard } = useSmartLogix();
  return (
    <div>
      <span data-testid="loading">{loading ? 'cargando' : 'listo'}</span>
      <span data-testid="count">{productos.length}</span>
      <span data-testid="parcial">{dashboard?.parcial ? 'si' : 'no'}</span>
    </div>
  );
};

describe('SmartLogixContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ TEST 1 — El context provee lista de productos al montar
  test('context carga productos al iniciar', async () => {
    (inventarioService.getProductos as jest.Mock).mockResolvedValue([
      { id: 1, nombre: 'Mesa', precio: 5000, stock: 10, stockMinimo: 2, activo: true }
    ]);
    (pedidosService.getPedidos as jest.Mock).mockResolvedValue([]);
    (dashboardService.getDashboardData as jest.Mock).mockResolvedValue({ parcial: false });

    render(<SmartLogixProvider><ComponenteTest /></SmartLogixProvider>);
    
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('1'));
  });

  // ✅ TEST 2 — loading es true al inicio y false cuando termina
  test('loading cambia de true a false al cargar', async () => {
    (inventarioService.getProductos as jest.Mock).mockResolvedValue([]);
    (pedidosService.getPedidos as jest.Mock).mockResolvedValue([]);
    (dashboardService.getDashboardData as jest.Mock).mockResolvedValue({});

    render(<SmartLogixProvider><ComponenteTest /></SmartLogixProvider>);
    
    expect(screen.getByTestId('loading').textContent).toBe('cargando');
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('listo'));
  });

  // ✅ TEST 3 — useSmartLogix lanza error si se usa fuera del provider
  test('useSmartLogix fuera de Provider lanza error', () => {
    const ComponenteSinProvider = () => { useSmartLogix(); return null; };
    // Silenciamos el error de consola de React por el throw
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => render(<ComponenteSinProvider />)).toThrow('SmartLogixProvider');
    
    console.error = originalError;
  });

  // ❌ TEST 4 — Fallo esperado: error en carga de productos mantiene lista vacía
  test('error en getProductos deja productos en array vacío', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (inventarioService.getProductos as jest.Mock).mockRejectedValue(new Error('sin conexión'));
    (pedidosService.getPedidos as jest.Mock).mockResolvedValue([]);
    (dashboardService.getDashboardData as jest.Mock).mockResolvedValue({});

    render(<SmartLogixProvider><ComponenteTest /></SmartLogixProvider>);
    
    await waitFor(() => expect(screen.getByTestId('count').textContent).toBe('0'));
    consoleSpy.mockRestore();
  });

  // ❌ TEST 5 — Fallo esperado: dashboardService caído marca como parcial
  test('error en getDashboardData marca como parcial', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (inventarioService.getProductos as jest.Mock).mockResolvedValue([]);
    (pedidosService.getPedidos as jest.Mock).mockResolvedValue([]);
    (dashboardService.getDashboardData as jest.Mock).mockRejectedValue(new Error('error'));

    render(<SmartLogixProvider><ComponenteTest /></SmartLogixProvider>);
    
    await waitFor(() => expect(screen.getByTestId('parcial').textContent).toBe('si'));
    consoleSpy.mockRestore();
  });
});
