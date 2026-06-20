import { api } from './client';

export const checkout =
  async (
    reservationId: string,
  ) => {

    const response =
      await api.post(
        '/checkout',
        {
          reservationId,
        },
      );

    return response.data;
  };