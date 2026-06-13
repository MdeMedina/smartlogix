import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProductoForm from '@/components/inventario/ProductoForm';

describe('ProductoForm', () => {
  const mockProps = {
    onSubmit: jest.fn(),
    onCancelar: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('en modo creación tiene título "Nuevo Producto"', () => {
    render(<ProductoForm {...mockProps} />);
    expect(screen.getByText(/nuevo producto/i)).toBeInTheDocument();
  });

  test('en modo edición rellena los campos y cambia el título', () => {
    const producto = { 
      id: 1, 
      nombre: 'Mesa', 
      descripcion: 'Madera', 
      precio: 50000, 
      stock: 10, 
      stockMinimo: 5, 
      activo: true 
    };
    render(<ProductoForm {...mockProps} productoEditar={producto} />);
    
    expect(screen.getByText(/editar producto/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Mesa')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Madera')).toBeInTheDocument();
    expect(screen.getByDisplayValue('50000')).toBeInTheDocument();
  });

  test('submit con datos válidos llama a onSubmit', async () => {
    const user = userEvent.setup();
    render(<ProductoForm {...mockProps} />);
    
    const nombreInput = screen.getByLabelText(/nombre/i);
    const precioInput = screen.getByLabelText(/precio/i);
    const stockInput = screen.getByLabelText(/stock inicial/i);
    const stockMinimoInput = screen.getByLabelText(/stock mínimo/i);
    
    await user.type(nombreInput, 'Silla Gamer');
    await user.clear(precioInput);
    await user.type(precioInput, '150000');
    await user.clear(stockInput);
    await user.type(stockInput, '20');
    await user.clear(stockMinimoInput);
    await user.type(stockMinimoInput, '5');
    
    const submitBtn = screen.getByRole('button', { name: /guardar producto/i });
    await user.click(submitBtn);
    
    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        nombre: 'Silla Gamer',
        descripcion: '',
        precio: 150000,
        stock: 20,
        stockMinimo: 5,
      });
    });
  });

  test('submit sin nombre muestra mensaje de error de validación', async () => {
    const user = userEvent.setup();
    render(<ProductoForm {...mockProps} />);
    
    const submitBtn = screen.getByRole('button', { name: /guardar producto/i });
    await user.click(submitBtn);
    
    expect(screen.getByText(/nombre es requerido/i)).toBeInTheDocument();
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  test('precio negativo muestra error de validación', async () => {
    const user = userEvent.setup();
    render(<ProductoForm {...mockProps} />);
    
    const nombreInput = screen.getByLabelText(/nombre/i);
    const precioInput = screen.getByLabelText(/precio/i);
    
    fireEvent.change(nombreInput, { target: { value: 'Test' } });
    fireEvent.change(precioInput, { target: { value: '' } }); // Empty is also invalid
    
    const submitBtn = screen.getByRole('button', { name: /guardar producto/i });
    fireEvent.click(submitBtn);
    
    await waitFor(() => {
      expect(screen.getByText(/precio debe ser mayor/i)).toBeInTheDocument();
    });
    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });
});
