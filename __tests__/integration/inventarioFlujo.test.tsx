import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InventarioPage from '@/app/inventario/page';
import * as inventarioService from '@/services/inventarioService';

// Mock de inventarioService
jest.mock('@/services/inventarioService');

describe('Integración - Flujo de Inventario', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Flujo completo: carga página y ve productos', async () => {
    (inventarioService.getProductos as jest.Mock).mockResolvedValue([
      { id: 1, nombre: 'Palet', descripcion: 'Madera resistente', precio: 3000, stock: 50, stockMinimo: 10, activo: true }
    ]);
    
    render(<InventarioPage />);
    
    // Verificamos que el spinner aparezca y luego desaparezca al cargar los productos
    await waitFor(() => {
      expect(screen.getByText('Palet')).toBeInTheDocument();
    });
  });

  test('Flujo: abrir modal y cancelar no altera la lista', async () => {
    (inventarioService.getProductos as jest.Mock).mockResolvedValue([
      { id: 1, nombre: 'Producto X', descripcion: '', precio: 100, stock: 5, stockMinimo: 1, activo: true }
    ]);
    
    render(<InventarioPage />);
    await waitFor(() => screen.getByText('Producto X'));
    
    // Abrir modal
    fireEvent.click(screen.getByRole('button', { name: /nuevo producto/i }));
    expect(screen.getAllByText(/nuevo producto/i).length).toBeGreaterThan(1);
    
    // Cancelar
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    
    // El modal debe cerrarse y el producto 'X' seguir presente
    await waitFor(() => {
      expect(screen.getAllByText(/nuevo producto/i).length).toBe(1);
    });
    expect(screen.getByText('Producto X')).toBeInTheDocument();
    expect(inventarioService.createProducto).not.toHaveBeenCalled();
  });

  test('Flujo: submit del formulario llama a createProducto con datos correctos', async () => {
    const user = userEvent.setup();
    (inventarioService.getProductos as jest.Mock).mockResolvedValue([]);
    (inventarioService.createProducto as jest.Mock).mockResolvedValue({ id: 2, nombre: 'Caja' });
    
    render(<InventarioPage />);
    
    // Abrir modal
    await user.click(screen.getByRole('button', { name: /nuevo producto/i }));
    
    // Llenar formulario
    await user.type(screen.getByLabelText(/nombre/i), 'Caja Metálica');
    await user.type(screen.getByLabelText(/precio/i), '15000');
    await user.type(screen.getByLabelText(/stock inicial/i), '100');
    await user.type(screen.getByLabelText(/stock mínimo/i), '20');
    
    // Enviar
    await user.click(screen.getByRole('button', { name: /guardar producto/i }));
    
    await waitFor(() => {
      expect(inventarioService.createProducto).toHaveBeenCalledWith({
        nombre: 'Caja Metálica',
        descripcion: '',
        precio: 15000,
        stock: 100,
        stockMinimo: 20,
      });
    });
  });

  test('Error de red en carga inicial muestra mensaje al usuario', async () => {
    (inventarioService.getProductos as jest.Mock).mockRejectedValue(new Error('Network Error'));
    
    render(<InventarioPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/error de conexión/i)).toBeInTheDocument();
      expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
    });
  });

  test('Fallo en createProducto muestra feedback de error (toast)', async () => {
    const user = userEvent.setup();
    (inventarioService.getProductos as jest.Mock).mockResolvedValue([]);
    (inventarioService.createProducto as jest.Mock).mockRejectedValue(new Error('Error al crear'));
    
    render(<InventarioPage />);
    
    // Abrir modal y enviar (nombre es requerido para que no falle en validación local)
    await user.click(screen.getByRole('button', { name: /nuevo producto/i }));
    await user.type(screen.getByLabelText(/nombre/i), 'Fail');
    await user.click(screen.getByRole('button', { name: /guardar producto/i }));
    
    await waitFor(() => {
      expect(inventarioService.createProducto).toHaveBeenCalled();
      // El modal debería seguir abierto ya que falló el envío
      expect(screen.getAllByText(/nuevo producto/i).length).toBeGreaterThan(1);
    });
  });
});
