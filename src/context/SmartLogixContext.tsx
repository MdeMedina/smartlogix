'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Producto } from '@/types/Producto';
import { Pedido, DashboardData } from '@/types/Pedido';
import * as inventarioService from '@/services/inventarioService';
import * as pedidosService from '@/services/pedidosService';
import * as dashboardService from '@/services/dashboardService';

interface SmartLogixContextType {
  productos: Producto[];
  pedidos: Pedido[];
  dashboard: DashboardData | null;
  loading: boolean;
  recargarProductos: () => Promise<void>;
  recargarPedidos: () => Promise<void>;
  recargarDashboard: () => Promise<void>;
}

const SmartLogixContext = createContext<SmartLogixContextType | undefined>(undefined);

export const SmartLogixProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const recargarProductos = useCallback(async () => {
    try {
      const data = await inventarioService.getProductos();
      setProductos(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const recargarPedidos = useCallback(async () => {
    try {
      const data = await pedidosService.getPedidos();
      setPedidos(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const recargarDashboard = useCallback(async () => {
    try {
      const data = await dashboardService.getDashboardData();
      setDashboard(data);
    } catch (error) {
      console.error(error);
      // En caso de error, podemos setear datos vacíos o parciales si el plan lo requiere
      setDashboard({
        totalProductos: 0,
        productosBajoStock: 0,
        totalPedidos: 0,
        pedidosPendientes: 0,
        parcial: true
      });
    }
  }, []);

  const cargarTodo = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      recargarProductos(),
      recargarPedidos(),
      recargarDashboard()
    ]);
    setLoading(false);
  }, [recargarProductos, recargarPedidos, recargarDashboard]);

  useEffect(() => {
    cargarTodo();
  }, [cargarTodo]);

  return (
    <SmartLogixContext.Provider value={{
      productos,
      pedidos,
      dashboard,
      loading,
      recargarProductos,
      recargarPedidos,
      recargarDashboard
    }}>
      {children}
    </SmartLogixContext.Provider>
  );
};

export const useSmartLogix = () => {
  const context = useContext(SmartLogixContext);
  if (context === undefined) {
    throw new Error('useSmartLogix debe ser usado dentro de un SmartLogixProvider');
  }
  return context;
};
