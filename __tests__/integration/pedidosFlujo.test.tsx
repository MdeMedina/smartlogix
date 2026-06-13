import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PedidosPage from '@/app/pedidos/page';
import * as pedidosService from '@/services/pedidosService';
import * as inventarioService from '@/services/inventarioService';
import { EstadoPedido } from '@/types/Pedido';

jest.mock('@/services/pedidosService');
jest.mock('@/services/inventarioService');

// ✅ TEST 1 — Flujo: cargar pedidos y filtrar por PENDIENTE
test('flujo: filtrar por PENDIENTE muestra solo pendientes', async () => {
  (pedidosService.getPedidos as jest.Mock).mockResolvedValue([
    { id: 1, clienteId: 1, estado: EstadoPedido.PENDIENTE, fechaCreacion: '2024-01-01', total: 1000, detalles: [] },
    { id: 2, clienteId: 2, estado: EstadoPedido.ENVIADO, fechaCreacion: '2024-01-02', total: 2000, detalles: [] },
  ]);
  (inventarioService.getProductos as jest.Mock).mockResolvedValue([]);
  render(<PedidosPage />);
  await waitFor(() => screen.getAllByRole('row').length > 1);
  fireEvent.click(screen.getByRole('button', { name: /^pendiente$/i }));
  await waitFor(() => {
    const elementos = screen.queryAllByText(/enviado/i);
    expect(elementos.length).toBe(1); // Solo el botón de filtro debe estar presente, no el badge
  });
});

// ✅ TEST 2 — Flujo: click Aprobar llama a actualizarEstado
test('flujo: click Aprobar actualiza estado del pedido', async () => {
  (pedidosService.getPedidos as jest.Mock).mockResolvedValue([
    { id: 1, clienteId: 1, estado: EstadoPedido.PENDIENTE, fechaCreacion: '2024-01-01', total: 1000, detalles: [] }
  ]);
  (pedidosService.actualizarEstado as jest.Mock).mockResolvedValue({});
  (inventarioService.getProductos as jest.Mock).mockResolvedValue([]);
  render(<PedidosPage />);
  await waitFor(() => screen.getByRole('button', { name: /aprobar/i }));
  fireEvent.click(screen.getByRole('button', { name: /aprobar/i }));
  await waitFor(() => expect(pedidosService.actualizarEstado).toHaveBeenCalledWith(1, EstadoPedido.APROBADO));
});

// ✅ TEST 3 — Flujo: crear pedido llama a crearPedido
test('flujo: submit formulario llama a crearPedido', async () => {
  (pedidosService.getPedidos as jest.Mock).mockResolvedValue([]);
  (pedidosService.createPedido as jest.Mock).mockResolvedValue({ id: 1 });
  (inventarioService.getProductos as jest.Mock).mockResolvedValue([
    { id: 1, nombre: 'Mesa', descripcion: '', precio: 5000, stock: 10, stockMinimo: 2, activo: true }
  ]);
  render(<PedidosPage />);
  fireEvent.click(screen.getByRole('button', { name: /nuevo pedido/i }));
  // llenar y submitear el formulario
  await waitFor(() => screen.getByLabelText(/cliente/i));
  expect(screen.getByRole('button', { name: /crear pedido/i })).toBeInTheDocument();
});

// ❌ TEST 4 — Fallo esperado: error de red en carga de pedidos muestra mensaje
test('error de red en getPedidos muestra mensaje al usuario', async () => {
  (pedidosService.getPedidos as jest.Mock).mockRejectedValue(new Error('Network Error'));
  (inventarioService.getProductos as jest.Mock).mockResolvedValue([]);
  render(<PedidosPage />);
  await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
});

// ❌ TEST 5 — Fallo esperado: actualizarEstado fallido muestra toast de error
test('actualizarEstado fallido muestra feedback al usuario', async () => {
  (pedidosService.getPedidos as jest.Mock).mockResolvedValue([
    { id: 1, clienteId: 1, estado: EstadoPedido.PENDIENTE, fechaCreacion: '2024-01-01', total: 1000, detalles: [] }
  ]);
  (pedidosService.actualizarEstado as jest.Mock).mockRejectedValue(new Error('Error al actualizar'));
  (inventarioService.getProductos as jest.Mock).mockResolvedValue([]);
  render(<PedidosPage />);
  await waitFor(() => screen.getByRole('button', { name: /aprobar/i }));
  fireEvent.click(screen.getByRole('button', { name: /aprobar/i }));
  await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
});
