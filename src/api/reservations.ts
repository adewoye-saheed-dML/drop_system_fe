import { api } from './client';

export const createReservation =
  async (
    productId: string,
    quantity: number,
  ) => {

    const response =
      await api.post(
        '/reservations',
        {
          productId,
          quantity,
        },
      );

    return response.data;
  };

export const getReservation =
  async (id: string) => {

    const response =
      await api.get(
        `/reservations/${id}`,
      );

    return response.data;
  };