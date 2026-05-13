import axios from 'axios';

// Mock de Axios antes de cualquier importación del servicio
jest.mock('axios', () => {
  const mockInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  };
  return {
    create: jest.fn(() => mockInstance),
    // Exponemos la instancia para poder usarla en los tests
    __mockInstance: mockInstance,
  };
});

// Obtenemos la instancia mockeada desde el mock de axios
const mockAxiosInstance = (axios as any).__mockInstance;

// Ahora importamos el servicio
import * as inventarioService from '@/services/inventarioService';

describe('inventarioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getProductos retorna lista de productos', async () => {
    mockAxiosInstance.get.mockResolvedValue({
      data: [{ id: 1, nombre: 'Mesa', precio: 5000, stock: 10, stockMinimo: 2, activo: true }]
    });
    const result = await inventarioService.getProductos();
    expect(result[0].nombre).toBe('Mesa');
  });

  test('createProducto retorna producto creado con id', async () => {
    mockAxiosInstance.post.mockResolvedValue({
      data: { id: 5, nombre: 'Silla', precio: 3000, stock: 20, stockMinimo: 5, activo: true }
    });
    const result = await inventarioService.createProducto({
      nombre: 'Silla', descripcion: '', precio: 3000, stock: 20, stockMinimo: 5
    });
    expect(result.id).toBe(5);
  });

  test('deleteProducto resuelve correctamente', async () => {
    mockAxiosInstance.delete.mockResolvedValue({ data: null });
    await expect(inventarioService.deleteProducto(1)).resolves.toBeUndefined();
  });

  test('getProductoById con ID inexistente lanza error', async () => {
    mockAxiosInstance.get.mockRejectedValue({
      response: { status: 404, data: { mensaje: 'No encontrado' } }
    });
    await expect(inventarioService.getProductoById(999)).rejects.toThrow('No encontrado');
  });

  test('error de conexión lanza excepción controlada', async () => {
    mockAxiosInstance.get.mockRejectedValue(new Error('Network Error'));
    await expect(inventarioService.getProductos()).rejects.toThrow('Error al obtener productos');
  });
});
