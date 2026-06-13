import React, { useState, useMemo } from 'react';
import { Producto } from '@/types/Producto';
import { PedidoDTO, EstadoPedido } from '@/types/Pedido';

interface PedidoFormProps {
  onSubmit: (data: PedidoDTO) => void;
  onCancelar: () => void;
  productosDisponibles: Producto[];
}

interface DetalleForm {
  idLocal: string;
  productoId: number | '';
  cantidad: number | '';
}

const PedidoForm: React.FC<PedidoFormProps> = ({ onSubmit, onCancelar, productosDisponibles }) => {
  const [clienteId, setClienteId] = useState<string>('');
  const [detalles, setDetalles] = useState<DetalleForm[]>([]);
  const [error, setError] = useState<string | null>(null);

  const agregarLinea = () => {
    setDetalles([...detalles, { idLocal: Math.random().toString(), productoId: '', cantidad: '' }]);
  };

  const eliminarLinea = (idLocal: string) => {
    setDetalles(detalles.filter(d => d.idLocal !== idLocal));
  };

  const updateDetalle = (idLocal: string, field: keyof DetalleForm, value: number | '') => {
    setDetalles(prev => prev.map(d => d.idLocal === idLocal ? { ...d, [field]: value } : d));
  };

  const total = useMemo(() => {
    return detalles.reduce((acc, det) => {
      if (det.productoId && det.cantidad) {
        const prod = productosDisponibles.find(p => p.id === det.productoId);
        if (prod) {
          return acc + (prod.precio * Number(det.cantidad));
        }
      }
      return acc;
    }, 0);
  }, [detalles, productosDisponibles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (detalles.length === 0) {
      setError('Debe agregar al menos un producto');
      return;
    }

    const payloadDetalles = [];

    for (const det of detalles) {
      if (!det.productoId) {
        setError('Debe seleccionar un producto en todas las líneas');
        return;
      }
      if (!det.cantidad || Number(det.cantidad) <= 0) {
        setError('La cantidad debe ser mayor a 0');
        return;
      }

      const prod = productosDisponibles.find(p => p.id === det.productoId);
      if (prod && Number(det.cantidad) > prod.stock) {
        setError(`Stock insuficiente para el producto ${prod.nombre}`);
        return;
      }

      payloadDetalles.push({
        productoId: Number(det.productoId),
        cantidad: Number(det.cantidad),
        precioUnitario: prod ? prod.precio : 0
      });
    }

    if (!clienteId) {
      setError('Debe ingresar un cliente');
      return;
    }

    onSubmit({
      clienteId: Number(clienteId),
      estado: EstadoPedido.PENDIENTE,
      detalles: payloadDetalles
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '24px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Crear Pedido</h2>
      
      {error && (
        <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '4px', marginBottom: '16px' }}>
          {error}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="clienteId" style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Cliente ID:</label>
        <input 
          id="clienteId"
          type="text" 
          value={clienteId} 
          onChange={(e) => setClienteId(e.target.value.replace(/\D/g, ''))} 
          style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '12px' }}>Detalles</h3>
        {detalles.map((det) => {
          const prod = productosDisponibles.find(p => p.id === det.productoId);
          const subtotal = prod && det.cantidad ? prod.precio * Number(det.cantidad) : 0;
          return (
            <div key={det.idLocal} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <select 
                value={String(det.productoId)} 
                onChange={(e) => updateDetalle(det.idLocal, 'productoId', e.target.value ? Number(e.target.value) : '')}
                style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px', flex: '1', minWidth: '200px' }}
              >
                <option value="">Seleccione un producto</option>
                {productosDisponibles.map(p => (
                  <option key={p.id} value={String(p.id)}>{p.nombre} (Stock: {p.stock})</option>
                ))}
              </select>
              
              <input 
                type="number" 
                min="1"
                placeholder="Cant."
                value={det.cantidad} 
                onChange={(e) => updateDetalle(det.idLocal, 'cantidad', e.target.value ? Number(e.target.value) : '')}
                style={{ padding: '10px', width: '80px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              
              <span style={{ minWidth: '100px', fontWeight: 'bold' }}>${subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</span>
              
              <button 
                type="button" 
                onClick={() => eliminarLinea(det.idLocal)} 
                style={{ padding: '8px 12px', color: '#ef4444', border: '1px solid #ef4444', backgroundColor: 'transparent', borderRadius: '4px', cursor: 'pointer' }}
              >
                Eliminar
              </button>
            </div>
          );
        })}
        <button 
          type="button" 
          onClick={agregarLinea} 
          style={{ padding: '10px 16px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '4px', marginTop: '8px', cursor: 'pointer', fontWeight: '500' }}
        >
          + Agregar producto
        </button>
      </div>

      <div style={{ marginBottom: '24px', fontSize: '1.5em', fontWeight: 'bold', textAlign: 'right', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
        Total: CLP {total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button 
          type="button" 
          onClick={onCancelar} 
          style={{ padding: '10px 20px', backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Crear pedido
        </button>
      </div>
    </form>
  );
};

export default PedidoForm;
