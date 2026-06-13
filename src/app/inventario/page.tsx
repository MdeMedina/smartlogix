'use client';

import React, { useState } from 'react';
import { useInventario } from '@/hooks/useInventario';
import ProductoTable from '@/components/inventario/ProductoTable';
import ProductoForm from '@/components/inventario/ProductoForm';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Plus, Package, AlertCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Producto, ProductoDTO } from '@/types/Producto';

const InventarioPage: React.FC = () => {
  const { 
    productos, 
    loading, 
    error, 
    cargarProductos,
    crearProducto, 
    actualizarProducto, 
    eliminarProducto, 
    ajustarStock 
  } = useInventario();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoEditar, setProductoEditar] = useState<Producto | undefined>(undefined);

  const handleOpenModal = (producto?: Producto) => {
    setProductoEditar(producto);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductoEditar(undefined);
  };

  const handleSubmit = async (data: ProductoDTO) => {
    try {
      if (productoEditar) {
        await actualizarProducto(productoEditar.id, data);
        toast.success('Producto actualizado exitosamente');
      } else {
        await crearProducto(data);
        toast.success('Producto creado exitosamente');
      }
      handleCloseModal();
    } catch (err) {
      toast.error('Error al guardar el producto');
    }
  };

  const handleEliminar = async (id: number) => {
    try {
      await eliminarProducto(id);
      toast.success('Producto eliminado');
    } catch (err) {
      // Si el hook ya maneja el confirm, el catch solo se dispara si hay error en el servicio
      if (err) toast.error('Error al eliminar el producto');
    }
  };

  const handleAjustarStock = async (id: number, cantidad: number) => {
    try {
      await ajustarStock(id, cantidad);
      toast.success('Stock actualizado');
    } catch (err) {
      toast.error('Error al ajustar el stock');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <Package className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Gestión de Inventario</h1>
              <p className="text-slate-500 text-sm">Controla tus productos y niveles de stock en tiempo real</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => cargarProductos()}
              className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
              title="Refrescar lista"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Nuevo Producto
            </button>
          </div>
        </div>

        {/* Content Section */}
        {error ? (
          <div className="bg-rose-50 border border-rose-100 p-6 rounded-2xl flex items-center gap-4 text-rose-700 animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle className="w-8 h-8 flex-shrink-0" />
            <div>
              <h3 className="font-bold">Error de Conexión</h3>
              <p className="text-sm opacity-90">{error}</p>
            </div>
            <button 
              onClick={() => cargarProductos()}
              className="ml-auto px-4 py-2 bg-rose-100 hover:bg-rose-200 rounded-lg text-sm font-bold transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="animate-in fade-in duration-700">
            <ProductoTable 
              productos={productos} 
              onEditar={handleOpenModal}
              onEliminar={handleEliminar}
              onAjustarStock={handleAjustarStock}
            />
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl transform transition-all">
            <ProductoForm 
              onSubmit={handleSubmit}
              onCancelar={handleCloseModal}
              productoEditar={productoEditar}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InventarioPage;
