import {
  useCallback,
  useState,
} from 'react';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  getReservation,
} from '../api/reservations';

import {
  getApiErrorMessage,
} from '../api/client';

import Countdown from '../components/Countdown';

export default function ReservationPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [localExpired, setLocalExpired] =
    useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
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

  const handleExpired =
    useCallback(() => {
      setLocalExpired(true);
      void refetch();
    }, [refetch]);

  if (!id) {
    return (
      <main className="mx-auto max-w-xl p-6 md:p-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-bold text-red-800">
            Invalid reservation
          </h1>

          <p className="mt-2 text-red-700">
            No reservation ID was provided.
          </p>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-xl p-6 md:p-10">
        <div className="animate-pulse space-y-4">
          <div className="h-9 w-72 rounded bg-gray-200" />
          <div className="h-32 rounded-xl bg-gray-100" />
          <div className="h-14 rounded bg-gray-200" />
        </div>
      </main>
    );
  }

  if (isError || !data) {
    return (
      <main className="mx-auto max-w-xl p-6 md:p-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-bold text-red-800">
            Reservation unavailable
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {getApiErrorMessage(
              error,
              'We could not find this reservation.',
            )}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const backendExpired =
    data.status !== 'ACTIVE';

  const cannotCheckout =
    localExpired ||
    backendExpired;

  return (
    <main className="mx-auto max-w-xl p-6 md:p-10">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
          Reservation
        </p>

        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Reservation Created
        </h1>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between gap-4 border-b pb-3">
            <span className="text-gray-500">
              Status
            </span>

            <strong
              className={
                data.status === 'ACTIVE'
                  ? 'text-green-600'
                  : 'text-red-600'
              }
            >
              {data.status}
            </strong>
          </div>

          <div className="flex justify-between gap-4 border-b pb-3">
            <span className="text-gray-500">
              Product
            </span>

            <strong className="text-right">
              {data.product.name}
            </strong>
          </div>

          <div className="flex justify-between gap-4 border-b pb-3">
            <span className="text-gray-500">
              Quantity
            </span>

            <strong>
              {data.quantity}
            </strong>
          </div>

          <div className="border-b pb-3">
            <p className="text-sm text-gray-500">
              Expires at
            </p>

            <p className="mt-1 font-medium text-gray-900">
              {new Date(
                data.expiresAt,
              ).toLocaleString()}
            </p>
          </div>
        </div>

        {data.status === 'ACTIVE' && (
          <Countdown
            expiresAt={data.expiresAt}
            onExpired={handleExpired}
          />
        )}

        {cannotCheckout && (
          <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            This reservation is no longer
            available for checkout.
          </div>
        )}

        <button
          type="button"
          disabled={cannotCheckout}
          onClick={() =>
            navigate(
              `/checkout/${data.id}`,
            )
          }
          className="mt-6 w-full rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {cannotCheckout
            ? 'Reservation Expired'
            : 'Proceed to Checkout'}
        </button>
      </div>
    </main>
  );
}