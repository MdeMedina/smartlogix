import axios from 'axios';
import { DashboardData } from '@/types/Pedido';

const bffApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:8080',
});

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await bffApi.get<DashboardData>('/api/dashboard');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.mensaje || 'Error al obtener datos del dashboard');
  }
};
