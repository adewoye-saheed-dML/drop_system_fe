import {
  useMutation,
  useQuery,
} from '@tanstack/react-query';

import {
  useNavigate,
} from 'react-router-dom';

import type { Product } from '../types/product';

import {
  getProducts,
} from '../api/products';

import {
  createReservation,
} from '../api/reservations';

import {
  getApiErrorMessage,
} from '../api/client';

import ProductCard from '../components/ProductCard';

export default function ProductsPage() {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  const reservationMutation =
    useMutation({
      mutationFn: (
        productId: string,
      ) =>
        createReservation(
          productId,
          1,
        ),

      onSuccess: (reservation) => {
        navigate(
          `/reservations/${reservation.id}`,
        );
      },
    });

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl p-6 md:p-10">
        <div className="animate-pulse">
          <div className="h-10 w-72 rounded bg-gray-200" />

          <div className="mt-3 h-5 w-96 max-w-full rounded bg-gray-200" />

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-64 rounded-xl bg-gray-100"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-xl p-6 md:p-10">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-bold text-red-800">
            Unable to load products
          </h1>

          <p className="mt-2 text-sm text-red-700">
            {getApiErrorMessage(
              error,
              'Something went wrong while loading the products.',
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

  const products = data ?? [];

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-10">
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-gray-500">
          Limited Drop
        </p>

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
          Limited Product Drop
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Reserve an available product before
          the limited inventory runs out.
        </p>
      </div>

      {reservationMutation.isError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-medium text-red-800">
            Reservation failed
          </p>

          <p className="mt-1 text-sm text-red-700">
            {getApiErrorMessage(
              reservationMutation.error,
              'The product may no longer be available.',
            )}
          </p>
        </div>
      )}

      {products.length === 0 ? (
        <div className="mt-10 rounded-xl border border-gray-200 bg-gray-50 p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            No products available
          </h2>

          <p className="mt-2 text-gray-600">
            There are currently no products in this drop.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {products.map(
            (product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onReserve={(productId) =>
                  reservationMutation.mutate(
                    productId,
                  )
                }
                isReserving={
                  reservationMutation.isPending &&
                  reservationMutation.variables ===
                    product.id
                }
              />
            ),
          )}
        </div>
      )}
    </main>
  );
}