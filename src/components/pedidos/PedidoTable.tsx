import React from 'react';
import { Pedido, EstadoPedido } from '@/types/Pedido';

interface PedidoTableProps {
  pedidos: Pedido[];
  onCambiarEstado: (id: number, estado: EstadoPedido) => void;
  onVerDetalle: (pedido: Pedido) => void;
}

const getBadgeStyle = (estado: EstadoPedido) => {
  const baseStyle = { padding: '4px 8px', borderRadius: '4px', color: '#fff', fontWeight: 'bold' as const };
  switch (estado) {
    case EstadoPedido.PENDIENTE:
      return { ...baseStyle, backgroundColor: '#eab308' }; // amarillo
    case EstadoPedido.APROBADO:
      return { ...baseStyle, backgroundColor: '#3b82f6' }; // azul
    case EstadoPedido.ENVIADO:
      return { ...baseStyle, backgroundColor: '#22c55e' }; // verde
    case EstadoPedido.CANCELADO:
      return { ...baseStyle, backgroundColor: '#ef4444' }; // rojo
    default:
      return { ...baseStyle, backgroundColor: '#6b7280' }; // gris
  }
};

const PedidoTable: React.FC<PedidoTableProps> = ({ pedidos, onCambiarEstado, onVerDetalle }) => {
  if (!pedidos || pedidos.length === 0) {
    return <div style={{ padding: '16px', textAlign: 'center', color: '#666' }}>No hay pedidos</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left', backgroundColor: '#f9fafb' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Cliente ID</th>
            <th style={{ padding: '12px' }}>Estado</th>
            <th style={{ padding: '12px' }}>Total (CLP)</th>
            <th style={{ padding: '12px' }}>Fecha</th>
            <th style={{ padding: '12px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((pedido) => (
            <tr key={pedido.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{pedido.id}</td>
              <td style={{ padding: '12px' }}>{pedido.clienteId}</td>
              <td style={{ padding: '12px' }}>
                <span style={getBadgeStyle(pedido.estado)}>{pedido.estado}</span>
              </td>
              <td style={{ padding: '12px' }}>
                ${pedido.total.toLocaleString('es-CL')}
              </td>
              <td style={{ padding: '12px' }}>
                {new Date(pedido.fechaCreacion).toLocaleDateString()}
              </td>
              <td style={{ padding: '12px', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => onVerDetalle(pedido)}
                  style={{ padding: '4px 8px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff' }}
                >
                  Ver Detalle
                </button>
                
                {pedido.estado === EstadoPedido.PENDIENTE && (
                  <button 
                    onClick={() => onCambiarEstado(pedido.id, EstadoPedido.APROBADO)}
                    style={{ padding: '4px 8px', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#3b82f6', color: '#fff' }}
                  >
                    Aprobar
                  </button>
                )}
                
                {pedido.estado === EstadoPedido.APROBADO && (
                  <button 
                    onClick={() => onCambiarEstado(pedido.id, EstadoPedido.ENVIADO)}
                    style={{ padding: '4px 8px', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#22c55e', color: '#fff' }}
                  >
                    Enviar
                  </button>
                )}
                
                {(pedido.estado === EstadoPedido.PENDIENTE || pedido.estado === EstadoPedido.APROBADO) && (
                  <button 
                    onClick={() => onCambiarEstado(pedido.id, EstadoPedido.CANCELADO)}
                    style={{ padding: '4px 8px', cursor: 'pointer', border: 'none', borderRadius: '4px', backgroundColor: '#ef4444', color: '#fff' }}
                  >
                    Cancelar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PedidoTable;
