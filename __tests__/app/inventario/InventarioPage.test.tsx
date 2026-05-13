import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InventarioPage from '@/app/inventario/page';
import { useInventario } from '@/hooks/useInventario';

// Mock del hook useInventario
jest.mock('@/hooks/useInventario');

const mockProductos = [
  { id: 1, nombre: 'Mesa', descripcion: 'Madera', precio: 50000, stock: 10, stockMinimo: 5, activo: true }
];

const mockHookReturn = {
  productos: mockProductos,
  loading: false,
  error: null,
  cargarProductos: jest.fn(),
  crearProducto: jest.fn(),
  actualizarProducto: jest.fn(),
  eliminarProducto: jest.fn(),
  ajustarStock: jest.fn(),
};

describe('InventarioPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza la tabla con productos', () => {
    (useInventario as jest.Mock).mockReturnValue(mockHookReturn);
    render(<InventarioPage />);
    expect(screen.getByText('Mesa')).toBeInTheDocument();
  });

  test('botón "Nuevo Producto" abre el formulario en un modal', () => {
    (useInventario as jest.Mock).mockReturnValue(mockHookReturn);
    render(<InventarioPage />);
    
    const btnNuevo = screen.getByRole('button', { name: /nuevo producto/i });
    fireEvent.click(btnNuevo);
    
    // El título del modal debería estar presente
    expect(screen.getAllByText(/nuevo producto/i).length).toBeGreaterThan(1);
    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
  });

  test('muestra LoadingSpinner cuando loading es true', () => {
    (useInventario as jest.Mock).mockReturnValue({
      ...mockHookReturn,
      loading: true,
      productos: [],
    });
    render(<InventarioPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('muestra mensaje de error cuando error no es null', () => {
    (useInventario as jest.Mock).mockReturnValue({
      ...mockHookReturn,
      error: 'Sin conexión al servidor',
      productos: [],
    });
    render(<InventarioPage />);
    expect(screen.getByText(/error de conexión/i)).toBeInTheDocument();
    expect(screen.getByText(/sin conexión/i)).toBeInTheDocument();
  });

  test('cancelar en el modal lo cierra', async () => {
    (useInventario as jest.Mock).mockReturnValue(mockHookReturn);
    render(<InventarioPage />);
    
    fireEvent.click(screen.getByRole('button', { name: /nuevo producto/i }));
    expect(screen.getAllByText(/nuevo producto/i).length).toBeGreaterThan(1);
    
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    
    await waitFor(() => {
      // Debería quedar solo 1 (el botón), el título del modal debería desaparecer
      expect(screen.getAllByText(/nuevo producto/i).length).toBe(1);
    });
  });
});
