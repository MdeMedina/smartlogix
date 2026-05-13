import { useState, useEffect } from 'react';
import { Producto } from '@/types/Producto';
import * as inventarioService from '@/services/inventarioService';

export const useInventario = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    inventarioService.getProductos()
      .then((data) => setProductos(data))
      .catch((err) => setError(err.message || 'Error'))
      .finally(() => setLoading(false));
  }, []);

  return { productos, loading, error };
};
