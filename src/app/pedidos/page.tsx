"use client";

import React, { useState } from 'react';
import { usePedidos } from '@/hooks/usePedidos';
import { useInventario } from '@/hooks/useInventario';
import PedidoTable from '@/components/pedidos/PedidoTable';
import PedidoForm from '@/components/pedidos/PedidoForm';
import { EstadoPedido, PedidoDTO } from '@/types/Pedido';

export default function PedidosPage() {
  const { 
    pedidosFiltrados, 
    filtroEstado, 
    setFiltroEstado, 
    crearPedido, 
    actualizarEstado, 
    error: errorPedidos 
  } = usePedidos();
  
  const { productos, error: errorInventario } = useInventario();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCambiarEstado = async (id: number, nuevoEstado: EstadoPedido) => {
    try {
      await actualizarEstado(id, nuevoEstado);
      showToast('Estado actualizado correctamente');
    } catch (err: any) {
      showToast(err.message || 'Error al actualizar estado');
    }
  };

  const handleCrearPedido = async (data: PedidoDTO) => {
    try {
      await crearPedido(data);
      setIsModalOpen(false);
      showToast('Pedido creado correctamente');
    } catch (err: any) {
      showToast(err.message || 'Error al crear pedido');
    }
  };

  const errorGlobal = errorPedidos || errorInventario;

  return (
    <div style={{ padding: '24px' }}>
      <h1>Gestión de Pedidos</h1>

      {errorGlobal && errorGlobal !== toastMessage && (
        <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px', marginBottom: '16px', borderRadius: '4px' }}>
          {errorGlobal}
        </div>
      )}

      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#333', color: '#fff', padding: '12px 24px', borderRadius: '4px', zIndex: 1000 }}>
          {toastMessage}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['TODOS', EstadoPedido.PENDIENTE, EstadoPedido.APROBADO, EstadoPedido.ENVIADO, EstadoPedido.CANCELADO].map((estado) => (
            <button
              key={estado}
              onClick={() => setFiltroEstado(estado as any)}
              style={{
                padding: '8px 16px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: filtroEstado === estado ? '#3b82f6' : '#fff',
                color: filtroEstado === estado ? '#fff' : '#333',
                cursor: 'pointer'
              }}
            >
              {estado}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ padding: '10px 20px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Nuevo Pedido
        </button>
      </div>

      <PedidoTable 
        pedidos={pedidosFiltrados} 
        onCambiarEstado={handleCambiarEstado} 
        onVerDetalle={() => {}} 
      />

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 50 }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', minWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            {(!productos || productos.length === 0) ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <p style={{ color: '#ef4444', marginBottom: '16px', fontWeight: 'bold' }}>No hay productos disponibles para crear un pedido.</p>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', backgroundColor: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <PedidoForm 
                productosDisponibles={productos} 
                onSubmit={handleCrearPedido} 
                onCancelar={() => setIsModalOpen(false)} 
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
