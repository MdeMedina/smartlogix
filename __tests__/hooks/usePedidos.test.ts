import { renderHook, act, waitFor } from '@testing-library/react';
import { usePedidos } from '@/hooks/usePedidos';
import * as pedidosService from '@/services/pedidosService';
import { EstadoPedido } from '@/types/Pedido';

jest.mock('@/services/pedidosService');

const pedidosMock = [
  { id: 1, clienteId: 1, estado: EstadoPedido.PENDIENTE, fechaCreacion: '2024-01-01', total: 5000, detalles: [] },
  { id: 2, clienteId: 2, estado: EstadoPedido.ENVIADO, fechaCreacion: '2024-01-02', total: 3000, detalles: [] },
];

beforeEach(() => {
  jest.clearAllMocks();
});

// ✅ TEST 1 — Hook carga pedidos al montar
test('usePedidos carga pedidos al iniciar', async () => {
  (pedidosService.getPedidos as jest.Mock).mockResolvedValue(pedidosMock);
  const { result } = renderHook(() => usePedidos());
  await waitFor(() => expect(result.current.pedidos).toHaveLength(2));
});

// ✅ TEST 2 — setFiltroEstado filtra sin llamar al servidor
test('setFiltroEstado filtra pedidos reactivamente', async () => {
  (pedidosService.getPedidos as jest.Mock).mockResolvedValue(pedidosMock);
  const { result } = renderHook(() => usePedidos());
  await waitFor(() => expect(result.current.pedidos.length).toBeGreaterThan(0));
  act(() => result.current.setFiltroEstado(EstadoPedido.PENDIENTE));
  expect(result.current.pedidosFiltrados).toHaveLength(1);
  expect(result.current.pedidosFiltrados[0].estado).toBe(EstadoPedido.PENDIENTE);
  expect(pedidosService.getPedidos).toHaveBeenCalledTimes(1); // no llamó de nuevo
});

// ✅ TEST 3 — actualizarEstado con transición válida llama al servicio
test('actualizarEstado válida llama a pedidosService', async () => {
  (pedidosService.getPedidos as jest.Mock).mockResolvedValue(pedidosMock);
  (pedidosService.actualizarEstado as jest.Mock).mockResolvedValue({ ...pedidosMock[0], estado: EstadoPedido.APROBADO });
  const { result } = renderHook(() => usePedidos());
  await waitFor(() => expect(result.current.pedidos.length).toBeGreaterThan(0));
  await act(async () => { await result.current.actualizarEstado(1, EstadoPedido.APROBADO); });
  expect(pedidosService.actualizarEstado).toHaveBeenCalledWith(1, EstadoPedido.APROBADO);
});

// ❌ TEST 4 — Fallo esperado: error en carga asigna estado error
test('error en getPedidos asigna mensaje de error', async () => {
  (pedidosService.getPedidos as jest.Mock).mockRejectedValue(new Error('error'));
  const { result } = renderHook(() => usePedidos());
  await waitFor(() => expect(result.current.error).not.toBeNull());
});

// ❌ TEST 5 — Fallo esperado: transición ENVIADO → PENDIENTE es bloqueada en cliente
test('transición inválida es rechazada antes de llamar al servicio', async () => {
  (pedidosService.getPedidos as jest.Mock).mockResolvedValue(pedidosMock);
  const { result } = renderHook(() => usePedidos());
  await waitFor(() => expect(result.current.pedidos.length).toBeGreaterThan(0));
  await act(async () => { await result.current.actualizarEstado(2, EstadoPedido.PENDIENTE); }); // 2 es ENVIADO
  expect(pedidosService.actualizarEstado).not.toHaveBeenCalled();
  expect(result.current.error).not.toBeNull();
});
