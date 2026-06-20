import type { Product } from '../types/product';

interface Props {
  product: Product;
  onReserve: (
    productId: string,
  ) => void;
}

export default function ProductCard({
  product,
  onReserve,
}: Props) {
  return (
    <div className="border rounded-lg p-5 shadow">

      <h2 className="text-xl font-semibold">
        {product.name}
      </h2>

      <p className="text-gray-600 mt-2">
        {product.description}
      </p>

      <div className="mt-3">
        Price:
        <span className="font-bold ml-2">
          ${product.price}
        </span>
      </div>

      <div className="mt-2">
        Available:
        <span className="font-bold ml-2">
          {product.availableStock}
        </span>
      </div>

      <button
        onClick={() =>
          onReserve(product.id)
        }
        disabled={
          product.availableStock === 0
        }
        className="mt-4 px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        Reserve
      </button>

    </div>
  );
}