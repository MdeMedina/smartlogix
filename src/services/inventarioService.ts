import axios from 'axios';
import { Producto, ProductoDTO } from '../types/Producto';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:8080',
});

export const getProductos = async (): Promise<Producto[]> => {
  try {
    const response = await api.get('/api/inventario/productos');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || 'Error al obtener productos');
  }
};

export const getProductoById = async (id: number): Promise<Producto> => {
  try {
    const response = await api.get(`/api/inventario/productos/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || 'Error al obtener el producto');
  }
};

export const createProducto = async (data: ProductoDTO): Promise<Producto> => {
  try {
    const response = await api.post('/api/inventario/productos', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || 'Error al crear el producto');
  }
};

export const updateProducto = async (id: number, data: ProductoDTO): Promise<Producto> => {
  try {
    const response = await api.put(`/api/inventario/productos/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || 'Error al actualizar el producto');
  }
};

export const deleteProducto = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/inventario/productos/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || 'Error al eliminar el producto');
  }
};

export const ajustarStock = async (id: number, cantidad: number): Promise<Producto> => {
  try {
    const response = await api.patch(`/api/inventario/productos/${id}/stock`, { cantidad });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || 'Error al ajustar el stock');
  }
};
