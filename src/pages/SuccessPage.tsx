import {
  Link,
  useLocation,
} from 'react-router-dom';

import type { Order } from '../types/product';

export default function SuccessPage() {
  const location = useLocation();

  const order =
    location.state?.order as
      | Order
      | undefined;

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

        {order ? (
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
        ) : (
          <div className="mt-6 rounded-lg bg-white p-4 text-sm text-gray-600">
            The order was created successfully,
            but its details are no longer available
            in this browser session.
          </div>
        )}

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