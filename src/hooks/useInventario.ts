'use client';

import { useState, useEffect, useCallback } from 'react';
import { Producto, ProductoDTO } from '../types/Producto';
import * as inventarioService from '../services/inventarioService';

export const useInventario = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarProductos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventarioService.getProductos();
      setProductos(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  }, []);

  const crearProducto = async (data: ProductoDTO) => {
    try {
      setError(null);
      await inventarioService.createProducto(data);
      await cargarProductos(); // Recargar la lista después de crear
    } catch (err: any) {
      setError(err.message || 'Error al crear el producto');
      throw err;
    }
  };

  const actualizarProducto = async (id: number, data: ProductoDTO) => {
    try {
      setError(null);
      await inventarioService.updateProducto(id, data);
      await cargarProductos(); // Recargar la lista después de actualizar
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el producto');
      throw err;
    }
  };

  const eliminarProducto = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) return;
    
    try {
      setError(null);
      await inventarioService.deleteProducto(id);
      await cargarProductos(); // Recargar la lista después de eliminar
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el producto');
      throw err;
    }
  };

  const ajustarStock = async (id: number, cantidad: number) => {
    try {
      setError(null);
      await inventarioService.ajustarStock(id, cantidad);
      await cargarProductos(); // Recargar la lista después de ajustar
    } catch (err: any) {
      setError(err.message || 'Error al ajustar el stock');
      throw err;
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  return {
    productos,
    loading,
    error,
    cargarProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    ajustarStock,
  };
};
