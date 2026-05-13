'use client';

import React from 'react';
import { Edit, Trash2, Plus, Minus, AlertCircle, Package } from 'lucide-react';
import { Producto } from '../../types/Producto';

interface ProductoTableProps {
  productos: Producto[];
  onEditar: (p: Producto) => void;
  onEliminar: (id: number) => void;
  onAjustarStock: (id: number, cantidad: number) => void;
}

const ProductoTable: React.FC<ProductoTableProps> = ({
  productos,
  onEditar,
  onEliminar,
  onAjustarStock,
}) => {
  const formatCLP = (value: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 animate-in fade-in duration-500">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Package className="w-8 h-8 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No hay productos</h3>
        <p className="text-slate-500 text-sm mt-1">El inventario se encuentra vacío en este momento.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Mínimo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {productos.map((producto) => {
              const isLowStock = producto.stock <= producto.stockMinimo;
              
              return (
                <tr 
                  key={producto.id} 
                  className="group hover:bg-slate-50/80 transition-all duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold mr-3 group-hover:scale-110 transition-transform">
                        {producto.nombre.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm font-semibold text-slate-900">{producto.nombre}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-500 max-w-[200px] truncate" title={producto.descripcion}>
                      {producto.descripcion || <span className="italic opacity-50">Sin descripción</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {formatCLP(producto.precio)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                        isLowStock 
                          ? 'bg-rose-50 text-rose-600 border border-rose-100 ring-4 ring-rose-50/50' 
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {isLowStock && <AlertCircle className="w-3.5 h-3.5 animate-pulse" />}
                        {producto.stock}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                    {producto.stockMinimo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                      producto.activo 
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg mr-2">
                        <button 
                          onClick={() => onAjustarStock(producto.id, 1)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                          title="Aumentar stock"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onAjustarStock(producto.id, -1)}
                          className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
                          title="Disminuir stock"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => onEditar(producto)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4.5 h-4.5" />
                      </button>
                      
                      <button 
                        onClick={() => onEliminar(producto.id)}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductoTable;
