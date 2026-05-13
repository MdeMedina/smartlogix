import axios from 'axios';
import { Producto, ProductoDTO } from '@/types/Producto';

const bffApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:8080',
});

export const getProductos = async (): Promise<Producto[]> => {
  try {
    const response = await bffApi.get<Producto[]>('/api/inventario/productos');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || 'Error al obtener productos');
  }
};

export const getProductoById = async (id: number): Promise<Producto> => {
  try {
    const response = await bffApi.get<Producto>(`/api/inventario/productos/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || `Error al obtener el producto ${id}`);
  }
};

export const createProducto = async (data: ProductoDTO): Promise<Producto> => {
  try {
    const response = await bffApi.post<Producto>('/api/inventario/productos', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || 'Error al crear el producto');
  }
};

export const updateProducto = async (id: number, data: ProductoDTO): Promise<Producto> => {
  try {
    const response = await bffApi.put<Producto>(`/api/inventario/productos/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || `Error al actualizar el producto ${id}`);
