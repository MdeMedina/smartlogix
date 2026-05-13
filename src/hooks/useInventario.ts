import { useState } from 'react';
import { Producto } from '@/types/Producto';

export const useInventario = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return { productos, loading, error };
};
