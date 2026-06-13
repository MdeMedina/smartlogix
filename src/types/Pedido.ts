export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  APROBADO = 'APROBADO',
  ENVIADO = 'ENVIADO',
  CANCELADO = 'CANCELADO',
}

export interface DetallePedido {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface Pedido {
  id: number;
  clienteId: number;
  estado: EstadoPedido;
  fechaCreacion: string; // ISO String
  total: number;
  detalles: DetallePedido[];
}

export interface PedidoDTO {
  clienteId: number;
  estado: EstadoPedido;
  detalles: DetallePedido[];
}

export interface DashboardData {
  totalProductos: number;
  productosBajoStock: number;
  totalPedidos: number;
  pedidosPendientes: number;
  parcial: boolean;
}
