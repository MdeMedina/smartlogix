import { render, screen, fireEvent } from '@testing-library/react';
import ProductoTable from '@/components/inventario/ProductoTable';
import { Producto } from '@/types/Producto';

// Mocking icons to avoid potential issues in test environment
jest.mock('lucide-react', () => ({
  Edit: () => <div data-testid="edit-icon" />,
  Trash2: () => <div data-testid="trash-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  Minus: () => <div data-testid="minus-icon" />,
  AlertCircle: () => <div data-testid="alert-icon" />,
  Package: () => <div data-testid="package-icon" />,
}));

const productosMock: Producto[] = [
  { id: 1, nombre: 'Mesa', descripcion: 'Madera', precio: 50000, stock: 10, stockMinimo: 5, activo: true },
  { id: 2, nombre: 'Silla', descripcion: 'Plástico', precio: 15000, stock: 2, stockMinimo: 5, activo: true },
];

describe('ProductoTable', () => {
  const mockProps = {
    productos: productosMock,
    onEditar: jest.fn(),
    onEliminar: jest.fn(),
    onAjustarStock: jest.fn(),
  };

  test('renderiza todos los productos', () => {
    render(<ProductoTable {...mockProps} />);
    expect(screen.getByText('Mesa')).toBeInTheDocument();
    expect(screen.getByText('Silla')).toBeInTheDocument();
  });

  test('badge de bajo stock aparece para Silla (stock 2 < stockMinimo 5)', () => {
    render(<ProductoTable {...mockProps} />);
    // Buscamos el stock '2' que debería tener el badge de alerta
    const stockBadge = screen.getByText('2');
    expect(stockBadge).toBeInTheDocument();
    expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
  });

  test('click en editar llama a onEditar con el producto correcto', () => {
    render(<ProductoTable {...mockProps} />);
    const editButtons = screen.getAllByTitle(/editar/i);
    fireEvent.click(editButtons[0]);
    expect(mockProps.onEditar).toHaveBeenCalledWith(productosMock[0]);
  });

  test('tabla con lista vacía muestra mensaje informativo', () => {
    render(<ProductoTable {...mockProps} productos={[]} />);
    expect(screen.getByText(/no hay productos/i)).toBeInTheDocument();
  });

  test('producto con precio 0 renderiza sin errores', () => {
    const productoRaro = [{ ...productosMock[0], precio: 0 }];
    expect(() => render(<ProductoTable {...mockProps} productos={productoRaro} />)).not.toThrow();
  });
});
