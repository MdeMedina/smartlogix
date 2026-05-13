export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  activo: boolean;
}

export interface ProductoDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stockMinimo: number;
}
