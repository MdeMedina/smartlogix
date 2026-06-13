import { render, screen, fireEvent } from '@testing-library/react';
import PedidoTable from '@/components/pedidos/PedidoTable';
import { EstadoPedido, Pedido } from '@/types/Pedido';

const pedidosMock: Pedido[] = [
  { id: 1, clienteId: 101, estado: EstadoPedido.PENDIENTE, fechaCreacion: '2024-01-01', total: 15000, detalles: [] },
  { id: 2, clienteId: 102, estado: EstadoPedido.ENVIADO, fechaCreacion: '2024-01-02', total: 8000, detalles: [] },
];

// ✅ TEST 1 — Tabla renderiza todos los pedidos
test('PedidoTable renderiza todos los pedidos', () => {
  render(<PedidoTable pedidos={pedidosMock} onCambiarEstado={jest.fn()} onVerDetalle={jest.fn()} />);
  expect(screen.getByText('101')).toBeInTheDocument();
  expect(screen.getByText('102')).toBeInTheDocument();
});

// ✅ TEST 2 — Pedido PENDIENTE muestra botón "Aprobar"
test('pedido PENDIENTE muestra botón Aprobar', () => {
  render(<PedidoTable pedidos={[pedidosMock[0]]} onCambiarEstado={jest.fn()} onVerDetalle={jest.fn()} />);
  expect(screen.getByRole('button', { name: /aprobar/i })).toBeInTheDocument();
});

// ✅ TEST 3 — Click en Aprobar llama a onCambiarEstado con APROBADO
test('click en Aprobar llama a onCambiarEstado', () => {
  const onCambiarEstado = jest.fn();
  render(<PedidoTable pedidos={[pedidosMock[0]]} onCambiarEstado={onCambiarEstado} onVerDetalle={jest.fn()} />);
  fireEvent.click(screen.getByRole('button', { name: /aprobar/i }));
  expect(onCambiarEstado).toHaveBeenCalledWith(1, EstadoPedido.APROBADO);
});

// ❌ TEST 4 — Fallo esperado: pedido ENVIADO no muestra botón Aprobar ni Enviar
test('pedido ENVIADO no tiene botones de transición hacia atrás', () => {
  render(<PedidoTable pedidos={[pedidosMock[1]]} onCambiarEstado={jest.fn()} onVerDetalle={jest.fn()} />);
  expect(screen.queryByRole('button', { name: /aprobar/i })).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /enviar/i })).not.toBeInTheDocument();
});

// ❌ TEST 5 — Fallo esperado: tabla vacía muestra mensaje sin pedidos
test('tabla vacía muestra mensaje informativo', () => {
  render(<PedidoTable pedidos={[]} onCambiarEstado={jest.fn()} onVerDetalle={jest.fn()} />);
  expect(screen.getByText(/no hay pedidos/i)).toBeInTheDocument();
});
