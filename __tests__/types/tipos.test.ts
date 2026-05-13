import { EstadoPedido } from '@/types/Pedido';

describe('Tipos y Enums de SmartLogix', () => {
  // ✅ TEST 1 — El enum EstadoPedido tiene todos los estados esperados
  test('EstadoPedido contiene PENDIENTE', () => {
    expect(EstadoPedido.PENDIENTE).toBe('PENDIENTE');
  });

  // ✅ TEST 2 — EstadoPedido contiene ENVIADO
  test('EstadoPedido contiene ENVIADO', () => {
    expect(EstadoPedido.ENVIADO).toBe('ENVIADO');
  });

  // ✅ TEST 3 — El enum tiene exactamente 4 estados
  test('EstadoPedido tiene 4 valores', () => {
    const valores = Object.values(EstadoPedido);
    expect(valores).toHaveLength(4);
  });

  // ❌ TEST 4 — Fallo esperado: estado inventado no existe en el enum
  test('Estado inexistente no está en EstadoPedido', () => {
    const estadoInvalido = 'DEVUELTO';
    expect(Object.values(EstadoPedido)).not.toContain(estadoInvalido);
  });

  // ❌ TEST 5 — Fallo esperado: acceder a propiedad inexistente retorna undefined
  test('Propiedad inexistente en enum retorna undefined', () => {
    const estado = (EstadoPedido as any)['INEXISTENTE'];
    expect(estado).toBeUndefined();
  });
});
