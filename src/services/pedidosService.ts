import axios from 'axios';
import { Pedido, PedidoDTO, EstadoPedido } from '@/types/Pedido';

const bffApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:8080',
});

export const getPedidos = async (): Promise<Pedido[]> => {
  try {
    const response = await bffApi.get<Pedido[]>('/api/pedidos');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || 'Error al obtener pedidos');
  }
};

export const getPedidoById = async (id: number): Promise<Pedido> => {
  try {
    const response = await bffApi.get<Pedido>(`/api/pedidos/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || `Error al obtener el pedido ${id}`);
  }
};

export const createPedido = async (data: PedidoDTO): Promise<Pedido> => {
  try {
    const response = await bffApi.post<Pedido>('/api/pedidos', data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || 'Error al crear el pedido');
  }
};

export const actualizarEstado = async (id: number, estado: EstadoPedido): Promise<Pedido> => {
  try {
    const response = await bffApi.put<Pedido>(`/api/pedidos/${id}/estado`, { estado });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || `Error al actualizar estado del pedido ${id}`);
  }
};

export const getPedidosPorCliente = async (clienteId: number): Promise<Pedido[]> => {
  try {
    const response = await bffApi.get<Pedido[]>(`/api/pedidos/cliente/${clienteId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || `Error al obtener pedidos del cliente ${clienteId}`);
  }
};

export const getPedidosPorEstado = async (estado: EstadoPedido): Promise<Pedido[]> => {
  try {
    const response = await bffApi.get<Pedido[]>(`/api/pedidos/estado/${estado}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || `Error al obtener pedidos en estado ${estado}`);
  }
};
