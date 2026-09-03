import type { Product } from '../types/product';

interface Props {
  product: Product;
  onReserve: (productId: string) => void;
  isReserving: boolean;
}

function formatPrice(price: string): string {
  const amount = Number(price);

  if (Number.isNaN(amount)) {
    return price;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export default function ProductCard({
  product,
  onReserve,
  isReserving,
}: Props) {
  const outOfStock =
    product.availableStock <= 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {product.name}
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            {product.description}
          </p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          Limited
        </span>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Price
          </p>

          <p className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-gray-500">
            Available
          </p>

          <p
            className={`text-lg font-bold ${
              outOfStock
                ? 'text-red-600'
                : 'text-gray-900'
            }`}
          >
            {product.availableStock}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onReserve(product.id)}
        disabled={
          outOfStock || isReserving
        }
        className="mt-5 w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isReserving
          ? 'Reserving...'
          : outOfStock
            ? 'Sold Out'
            : 'Reserve'}
      </button>
    </div>
  );
}