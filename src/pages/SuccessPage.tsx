import {
  Link,
  useParams,
} from 'react-router-dom';

import {
  useQuery,
} from '@tanstack/react-query';

import {
  getOrder,
} from '../api/checkout';

import {
  getApiErrorMessage,
} from '../api/client';

export default function SuccessPage() {
  const { id } = useParams();

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'order',
      id,
    ],
    queryFn: () =>
      getOrder(id as string),
    enabled: Boolean(id),
  });

  if (!id) {
    return (
      <main className="mx-auto max-w-xl p-6 md:p-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-bold text-red-800">
            Invalid order
          </h1>

          <p className="mt-2 text-red-700">
            No order ID was provided.
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
          <div className="h-48 rounded-xl bg-gray-100" />
        </div>
      </main>
    );
  }

  if (isError || !order) {
    return (
      <main className="mx-auto max-w-xl p-6 md:p-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-bold text-red-800">
            Unable to load order
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {getApiErrorMessage(
              error,
              'We could not retrieve this order.',
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

  return (
    <main className="mx-auto max-w-xl p-6 md:p-10">
      <div className="rounded-xl border border-green-200 bg-green-50 p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
          ✓
        </div>

        <h1 className="mt-5 text-3xl font-bold text-green-800">
          Checkout Successful
        </h1>

        <p className="mt-3 text-green-700">
          Your order has been created successfully.
        </p>

        <div className="mt-6 rounded-xl bg-white p-5">
          <div className="flex justify-between gap-4 border-b pb-3">
            <span className="text-gray-500">
              Order ID
            </span>

            <span className="break-all text-right text-sm font-medium">
              {order.id}
            </span>
          </div>

          <div className="mt-4 flex justify-between">
            <span className="text-gray-500">
              Status
            </span>

            <strong className="text-green-600">
              {order.status}
            </strong>
          </div>

          <div className="mt-4 flex justify-between border-t pt-4">
            <span className="font-medium text-gray-700">
              Amount
            </span>

            <strong>
              ${Number(order.amount).toFixed(2)}
            </strong>
          </div>
        </div>

        <Link
          to="/"
          className="mt-6 inline-block rounded-lg bg-black px-5 py-3 font-medium text-white hover:bg-gray-800"
        >
          Back to Products
        </Link>
      </div>
    </main>
  );
}