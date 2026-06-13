import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PedidoForm from '@/components/pedidos/PedidoForm';
import { Producto } from '@/types/Producto';

const productosMock: Producto[] = [
  { id: 1, nombre: 'Mesa', descripcion: '', precio: 5000, stock: 10, stockMinimo: 2, activo: true },
  { id: 2, nombre: 'Silla', descripcion: '', precio: 2000, stock: 5, stockMinimo: 1, activo: true },
];

// ✅ TEST 1 — Formulario renderiza campo de clienteId
test('PedidoForm renderiza campo clienteId', () => {
  render(<PedidoForm onSubmit={jest.fn()} onCancelar={jest.fn()} productosDisponibles={productosMock} />);
  expect(screen.getByLabelText(/cliente/i)).toBeInTheDocument();
});

// ✅ TEST 2 — Botón "Agregar producto" añade una línea de detalle
test('botón agregar producto añade línea al formulario', () => {
  render(<PedidoForm onSubmit={jest.fn()} onCancelar={jest.fn()} productosDisponibles={productosMock} />);
  fireEvent.click(screen.getByRole('button', { name: /agregar producto/i }));
  expect(screen.getAllByRole('combobox')).toHaveLength(1);
});

// ✅ TEST 3 — Total se calcula al seleccionar producto y cantidad
test('total se actualiza al seleccionar producto y cantidad', async () => {
  render(<PedidoForm onSubmit={jest.fn()} onCancelar={jest.fn()} productosDisponibles={productosMock} />);
  fireEvent.click(screen.getByRole('button', { name: /agregar producto/i }));
  await userEvent.selectOptions(screen.getByRole('combobox'), '1'); // Mesa
  await userEvent.type(screen.getByRole('spinbutton'), '2');
  await waitFor(() => expect(screen.getByText(/\$10\.000/)).toBeInTheDocument()); // 5000 × 2
});

// ❌ TEST 4 — Fallo esperado: cantidad mayor al stock muestra error
test('cantidad mayor al stock disponible muestra validación', async () => {
  render(<PedidoForm onSubmit={jest.fn()} onCancelar={jest.fn()} productosDisponibles={productosMock} />);
  fireEvent.click(screen.getByRole('button', { name: /agregar producto/i }));
  await userEvent.selectOptions(screen.getByRole('combobox'), '2'); // Silla stock=5
  await userEvent.type(screen.getByRole('spinbutton'), '99');
  fireEvent.click(screen.getByRole('button', { name: /crear pedido/i }));
  await waitFor(() => expect(screen.getByText(/stock insuficiente/i)).toBeInTheDocument());
});

// ❌ TEST 5 — Fallo esperado: submit sin detalles muestra error
test('submit sin líneas de detalle muestra error', async () => {
  render(<PedidoForm onSubmit={jest.fn()} onCancelar={jest.fn()} productosDisponibles={productosMock} />);
  await userEvent.type(screen.getByLabelText(/cliente/i), '1');
  fireEvent.click(screen.getByRole('button', { name: /crear pedido/i }));
  await waitFor(() => expect(screen.getByText(/agregar al menos un producto/i)).toBeInTheDocument());
});
