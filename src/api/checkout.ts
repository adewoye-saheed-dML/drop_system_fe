import { api } from './client';
import type { Order } from '../types/product';

export async function checkout(
  reservationId: string,
): Promise<Order> {
  const response = await api.post<Order>(
    '/checkout',
    {
      reservationId,
    },
  );

  return response.data;
}