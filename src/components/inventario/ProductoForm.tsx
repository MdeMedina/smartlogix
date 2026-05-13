'use client';

import React, { useState, useEffect } from 'react';
import { Package, Save, X, AlertCircle } from 'lucide-react';
import { Producto, ProductoDTO } from '../../types/Producto';

interface ProductoFormProps {
  onSubmit: (data: ProductoDTO) => void;
  onCancelar: () => void;
  productoEditar?: Producto;
}

const ProductoForm: React.FC<ProductoFormProps> = ({
  onSubmit,
  onCancelar,
  productoEditar,
}) => {
  const isEditing = !!productoEditar;

  const [formData, setFormData] = useState<ProductoDTO>({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    stockMinimo: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ProductoDTO, string>>>({});

  useEffect(() => {
    if (productoEditar) {
      setFormData({
        nombre: productoEditar.nombre,
        descripcion: productoEditar.descripcion,
        precio: productoEditar.precio,
        stock: productoEditar.stock,
        stockMinimo: productoEditar.stockMinimo,
      });
    }
  }, [productoEditar]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductoDTO, string>> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (formData.precio === '' || formData.precio === null || isNaN(Number(formData.precio)) || Number(formData.precio) < 0) {
      newErrors.precio = 'El precio debe ser mayor o igual a 0';
    }

    if (formData.stock === '' || formData.stock === null || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser mayor o igual a 0';
    }

    if (formData.stockMinimo === '' || formData.stockMinimo === null || isNaN(Number(formData.stockMinimo)) || Number(formData.stockMinimo) < 0) {
      newErrors.stockMinimo = 'El stock mínimo debe ser mayor o igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
    
    // Clear error when user types
    if (errors[name as keyof ProductoDTO]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 max-w-2xl w-full animate-in fade-in zoom-in duration-300">
      <div className="bg-slate-50/50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
        </div>
        <button 
          onClick={onCancelar}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="space-y-2">
          <label htmlFor="nombre" className="text-sm font-bold text-slate-700 ml-1">
            Nombre del Producto <span className="text-rose-500">*</span>
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ej: Mesa de Escritorio Pro"
            className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${
              errors.nombre 
                ? 'border-rose-300 bg-rose-50/30 ring-4 ring-rose-50 text-rose-900 placeholder:text-rose-300' 
                : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'
            }`}
          />
          {errors.nombre && (
            <p className="flex items-center gap-1.5 text-xs font-bold text-rose-500 mt-1 ml-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.nombre}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="descripcion" className="text-sm font-bold text-slate-700 ml-1">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe las características principales..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="precio" className="text-sm font-bold text-slate-700 ml-1">
              Precio (CLP)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
              <input
                id="precio"
                name="precio"
                type="number"
                min="0"
                value={formData.precio}
                onChange={handleChange}
                className={`w-full pl-8 pr-4 py-3 rounded-xl border transition-all outline-none ${
                  errors.precio 
                    ? 'border-rose-300 bg-rose-50/30' 
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'
                }`}
              />
            </div>
            {errors.precio && (
              <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.precio}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="stock" className="text-sm font-bold text-slate-700 ml-1">
              Stock Inicial
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${
                errors.stock 
                  ? 'border-rose-300 bg-rose-50/30' 
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'
              }`}
            />
            {errors.stock && (
              <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.stock}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="stockMinimo" className="text-sm font-bold text-slate-700 ml-1">
              Stock Mínimo
            </label>
            <input
              id="stockMinimo"
              name="stockMinimo"
              type="number"
              min="0"
              value={formData.stockMinimo}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border transition-all outline-none ${
                errors.stockMinimo 
                  ? 'border-rose-300 bg-rose-50/30' 
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50'
              }`}
            />
            {errors.stockMinimo && (
              <p className="text-xs font-bold text-rose-500 mt-1 ml-1">{errors.stockMinimo}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="button"
            onClick={onCancelar}
            className="flex-1 px-6 py-3.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all"
          >
            <Save className="w-5 h-5" />
            {isEditing ? 'Actualizar Producto' : 'Guardar Producto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductoForm;
