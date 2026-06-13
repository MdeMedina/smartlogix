'use client';

import React from 'react';
import { useSmartLogix } from '@/context/SmartLogixContext';
import { 
  Package, 
  AlertTriangle, 
  ShoppingCart, 
  Clock, 
  Loader2,
  Info
} from 'lucide-react';

const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  color, 
  alert = false 
}: { 
  title: string, 
  value: number | string, 
  icon: React.ReactNode, 
  color: string,
  alert?: boolean
}) => (
  <div className={`bg-slate-900 border ${alert ? 'border-red-500/50' : 'border-slate-800'} p-6 rounded-xl shadow-lg transition-transform hover:scale-[1.02]`}>
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
        {icon}
      </div>
      {alert && (
        <span className="flex items-center gap-1 text-xs font-bold text-red-500 animate-pulse">
          <AlertTriangle size={12} /> ALERTA
        </span>
      )}
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold text-white">{value}</p>
  </div>
);

const Dashboard = () => {
  const { dashboard, loading } = useSmartLogix();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]" data-testid="loading-spinner">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Cargando métricas...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Panel de Control</h1>
        <p className="text-slate-400">Resumen operativo del sistema SmartLogix</p>
      </div>

      {dashboard?.parcial && (
        <div className="bg-amber-500/10 border border-amber-500/50 text-amber-500 p-4 rounded-lg mb-8 flex items-center gap-3">
          <Info size={20} />
          <p className="text-sm font-medium">
            <strong>Servicio parcialmente disponible:</strong> Algunos datos pueden estar desactualizados debido a una falla de conexión con el backend.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Productos" 
          value={dashboard?.totalProductos || 0} 
          icon={<Package className="text-blue-500" />} 
          color="bg-blue-500" 
        />
        <DashboardCard 
          title="Bajo Stock" 
          value={dashboard?.productosBajoStock || 0} 
          icon={<AlertTriangle className="text-red-500" />} 
          color="bg-red-500"
          alert={(dashboard?.productosBajoStock || 0) > 0}
        />
        <DashboardCard 
          title="Total Pedidos" 
          value={dashboard?.totalPedidos || 0} 
          icon={<ShoppingCart className="text-green-500" />} 
          color="bg-green-500" 
        />
        <DashboardCard 
          title="Pedidos Pendientes" 
          value={dashboard?.pedidosPendientes || 0} 
          icon={<Clock className="text-amber-500" />} 
          color="bg-amber-500" 
        />
      </div>
      
      <div className="mt-12 p-8 bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">Bienvenido al Centro Logístico</h2>
        <p className="text-slate-400 max-w-2xl leading-relaxed">
          Desde aquí puedes monitorear el estado actual de tu inventario y gestionar los pedidos entrantes. 
          Utiliza la barra de navegación superior para acceder a los módulos detallados.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
