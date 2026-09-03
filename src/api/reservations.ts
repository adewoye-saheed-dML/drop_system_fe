import { api } from './client';
import type { Reservation } from '../types/product';

export async function createReservation(
  productId: string,
  quantity: number,
): Promise<Reservation> {
  const response = await api.post<Reservation>(
    '/reservations',
    {
      productId,
      quantity,
    },
  );

  return response.data;
}

export async function getReservation(
  id: string,
): Promise<Reservation> {
  const response = await api.get<Reservation>(
    `/reservations/${id}`,
  );

  return response.data;
}