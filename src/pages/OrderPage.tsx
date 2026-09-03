import {
  useEffect,
  useState,
} from 'react';

import {
  useQuery,
  useMutation,
} from '@tanstack/react-query';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  checkout,
} from '../api/checkout';

import {
  getReservation,
} from '../api/reservations';

import {
  getApiErrorMessage,
} from '../api/client';

export default function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expired, setExpired] =
    useState(false);

  const reservationQuery =
    useQuery({
      queryKey: [
        'reservation',
        id,
      ],
      queryFn: () =>
        getReservation(id as string),
      enabled: Boolean(id),
      refetchInterval: (query) => {
        const reservation =
          query.state.data;

        return reservation?.status ===
          'ACTIVE'
          ? 5000
          : false;
      },
    });

  const checkoutMutation =
    useMutation({
      mutationFn: () =>
        checkout(id as string),

      onSuccess: (order) => {
        navigate('/success', {
          state: {
            order,
          },
        });
      },
    });

  useEffect(() => {
    const expiresAt =
      reservationQuery.data?.expiresAt;

    if (!expiresAt) {
      return;
    }

    const checkExpiry = () => {
      setExpired(
        new Date(expiresAt).getTime() <=
          Date.now(),
      );
    };

    checkExpiry();

    const timer =
      window.setInterval(
        checkExpiry,
        1000,
      );

    return () =>
      window.clearInterval(timer);
  }, [
    reservationQuery.data?.expiresAt,
  ]);

  if (!id) {
    return (
      <main className="mx-auto max-w-xl p-6 md:p-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-bold text-red-800">
            Invalid checkout
          </h1>

          <p className="mt-2 text-red-700">
            No reservation ID was provided.
          </p>
        </div>
      </main>
    );
  }

  if (reservationQuery.isLoading) {
    return (
      <main className="mx-auto max-w-xl p-6 md:p-10">
        <div className="animate-pulse space-y-4">
          <div className="h-9 w-48 rounded bg-gray-200" />
          <div className="h-48 rounded-xl bg-gray-100" />
        </div>
      </main>
    );
  }

  if (
    reservationQuery.isError ||
    !reservationQuery.data
  ) {
    return (
      <main className="mx-auto max-w-xl p-6 md:p-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-bold text-red-800">
            Unable to load checkout
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {getApiErrorMessage(
              reservationQuery.error,
              'This reservation could not be loaded.',
            )}
          </p>
        </div>
      </main>
    );
  }

  const reservation =
    reservationQuery.data;

  const inactive =
    reservation.status !== 'ACTIVE';

  const cannotCheckout =
    expired || inactive;

  return (
    <main className="mx-auto max-w-xl p-6 md:p-10">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
          Checkout
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Review Your Order
        </h1>

        <div className="mt-6 rounded-xl bg-gray-50 p-5">
          <div className="flex justify-between gap-4">
            <span className="text-gray-500">
              Product
            </span>

            <strong className="text-right">
              {reservation.product.name}
            </strong>
          </div>

          <div className="mt-4 flex justify-between gap-4">
            <span className="text-gray-500">
              Quantity
            </span>

            <strong>
              {reservation.quantity}
            </strong>
          </div>

          <div className="mt-4 flex justify-between gap-4">
            <span className="text-gray-500">
              Reservation
            </span>

            <span className="break-all text-right text-sm">
              {reservation.id}
            </span>
          </div>

          <div className="mt-4 flex justify-between border-t pt-4">
            <span className="font-medium text-gray-700">
              Unit price
            </span>

            <strong>
              $
              {Number(
                reservation.product.price,
              ).toFixed(2)}
            </strong>
          </div>
        </div>

        <p className="mt-5 text-sm text-gray-500">
          The final order amount is calculated
          by the server using the product price
          and reserved quantity.
        </p>

        {cannotCheckout && (
          <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            This reservation is no longer
            eligible for checkout.
          </div>
        )}

        {checkoutMutation.isError && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="font-medium text-red-800">
              Checkout failed
            </p>

            <p className="mt-1 text-sm text-red-700">
              {getApiErrorMessage(
                checkoutMutation.error,
                'The reservation may have expired or already been checked out.',
              )}
            </p>
          </div>
        )}

        <button
          type="button"
          disabled={
            cannotCheckout ||
            checkoutMutation.isPending
          }
          onClick={() =>
            checkoutMutation.mutate()
          }
          className="mt-6 w-full rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {checkoutMutation.isPending
            ? 'Processing Checkout...'
            : cannotCheckout
              ? 'Reservation Unavailable'
              : 'Complete Checkout'}
        </button>
      </div>
    </main>
  );
}