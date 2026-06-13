import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PedidosPage from '@/app/pedidos/page';
import { usePedidos } from '@/hooks/usePedidos';
import { useInventario } from '@/hooks/useInventario';
import { EstadoPedido } from '@/types/Pedido';

jest.mock('@/hooks/usePedidos');
jest.mock('@/hooks/useInventario');

const mockPedidosHook = {
  pedidos: [{ id: 1, clienteId: 1, estado: EstadoPedido.PENDIENTE, fechaCreacion: '2024-01-01', total: 5000, detalles: [] }],
  pedidosFiltrados: [{ id: 1, clienteId: 101, estado: EstadoPedido.PENDIENTE, fechaCreacion: '2024-01-01', total: 5000, detalles: [] }],
  filtroEstado: 'TODOS',
  loading: false,
  error: null,
  crearPedido: jest.fn(),
  actualizarEstado: jest.fn(),
  setFiltroEstado: jest.fn(),
};

const mockInventarioHook = {
  productos: [{ id: 1, nombre: 'Mesa', descripcion: '', precio: 5000, stock: 10, stockMinimo: 2, activo: true }],
  loading: false, error: null,
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ✅ TEST 1 — Página renderiza la tabla con pedidos
test('PedidosPage muestra pedidos en tabla', () => {
  (usePedidos as jest.Mock).mockReturnValue(mockPedidosHook);
  (useInventario as jest.Mock).mockReturnValue(mockInventarioHook);
  render(<PedidosPage />);
  expect(screen.getByText('101') || screen.getByText('1')).toBeInTheDocument();
});

// ✅ TEST 2 — Botones de filtro de estado están presentes
test('botones de filtro por estado están presentes', () => {
  (usePedidos as jest.Mock).mockReturnValue(mockPedidosHook);
  (useInventario as jest.Mock).mockReturnValue(mockInventarioHook);
  render(<PedidosPage />);
  expect(screen.getByRole('button', { name: /pendiente/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /enviado/i })).toBeInTheDocument();
});

// ✅ TEST 3 — Click en filtro PENDIENTE llama a setFiltroEstado
test('click en filtro PENDIENTE llama a setFiltroEstado', () => {
  (usePedidos as jest.Mock).mockReturnValue(mockPedidosHook);
  (useInventario as jest.Mock).mockReturnValue(mockInventarioHook);
  render(<PedidosPage />);
  fireEvent.click(screen.getByRole('button', { name: /^pendiente$/i }));
  expect(mockPedidosHook.setFiltroEstado).toHaveBeenCalledWith(EstadoPedido.PENDIENTE);
});

// ❌ TEST 4 — Fallo esperado: error en hook muestra mensaje visible
test('error en hook muestra mensaje al usuario', () => {
  (usePedidos as jest.Mock).mockReturnValue({ ...mockPedidosHook, error: 'Error de conexión' });
  (useInventario as jest.Mock).mockReturnValue(mockInventarioHook);
  render(<PedidosPage />);
  expect(screen.getByText(/error de conexión/i)).toBeInTheDocument();
});

// ❌ TEST 5 — Fallo esperado: botón Nuevo Pedido sin productos disponibles muestra aviso
test('Nuevo Pedido sin productos disponibles muestra aviso', () => {
  (usePedidos as jest.Mock).mockReturnValue(mockPedidosHook);
  (useInventario as jest.Mock).mockReturnValue({ ...mockInventarioHook, productos: [] });
  render(<PedidosPage />);
  fireEvent.click(screen.getByRole('button', { name: /nuevo pedido/i }));
  expect(screen.getByText(/no hay productos disponibles/i)).toBeInTheDocument();
});
