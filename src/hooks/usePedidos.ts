import { useState, useEffect, useCallback } from 'react';
import { Pedido, PedidoDTO, EstadoPedido } from '@/types/Pedido';
import * as pedidosService from '@/services/pedidosService';

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState<Pedido[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<EstadoPedido | 'TODOS'>('TODOS');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const cargarPedidos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await pedidosService.getPedidos();
      setPedidos(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarPedidos();
  }, [cargarPedidos]);

  useEffect(() => {
    if (filtroEstado === 'TODOS') {
      setPedidosFiltrados(pedidos);
    } else {
      setPedidosFiltrados(pedidos.filter((p) => p.estado === filtroEstado));
    }
  }, [pedidos, filtroEstado]);

  const crearPedido = async (data: PedidoDTO) => {
    setLoading(true);
    setError(null);
    try {
      const nuevoPedido = await pedidosService.createPedido(data);
      setPedidos((prev) => [...prev, nuevoPedido]);
      return nuevoPedido;
    } catch (err: any) {
      setError(err.message || 'Error al crear el pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarEstado = async (id: number, nuevoEstado: EstadoPedido) => {
    setError(null);
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) {
      setError('Pedido no encontrado');
      return;
    }

    // Validación de transiciones válidas
    const validTransitions: Record<EstadoPedido, EstadoPedido[]> = {
      [EstadoPedido.PENDIENTE]: [EstadoPedido.APROBADO, EstadoPedido.CANCELADO],
      [EstadoPedido.APROBADO]: [EstadoPedido.ENVIADO, EstadoPedido.CANCELADO],
      [EstadoPedido.ENVIADO]: [],
      [EstadoPedido.CANCELADO]: [],
    };

    if (!validTransitions[pedido.estado].includes(nuevoEstado)) {
      setError(`Transición inválida de ${pedido.estado} a ${nuevoEstado}`);
      return;
    }

    setLoading(true);
    try {
      const pedidoActualizado = await pedidosService.actualizarEstado(id, nuevoEstado);
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? pedidoActualizado : p))
      );
      return pedidoActualizado;
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estado');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    pedidos,
    pedidosFiltrados,
    filtroEstado,
    loading,
    error,
    cargarPedidos,
    crearPedido,
    actualizarEstado,
    setFiltroEstado,
  };
};
