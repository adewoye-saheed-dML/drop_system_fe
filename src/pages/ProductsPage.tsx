import {
    useQuery,
    useMutation,
  } from '@tanstack/react-query';
  
  import {
    useNavigate,
  } from 'react-router-dom';
  
  import type { Product } from '../types/product';
  
  import { getProducts } from '../api/products';
  
  import {
    createReservation,
  } from '../api/reservations';
  
  import ProductCard from '../components/ProductCard';
  
  export default function ProductsPage() {
    const navigate = useNavigate();
  
    const reservationMutation =
      useMutation({
        mutationFn: (
          productId: string,
        ) =>
          createReservation(
            productId,
            1,
          ),
  
        onSuccess: (
          reservation,
        ) => {
          navigate(
            `/reservations/${reservation.id}`,
          );
        },
      });
  
    const {
      data,
      isLoading,
      error,
    } = useQuery({
      queryKey: ['products'],
      queryFn: getProducts,
    });
  
    if (isLoading) {
      return (
        <div className="p-10">
          Loading products...
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="p-10 text-red-500">
          Failed to load products
        </div>
      );
    }
  
    return (
      <div className="max-w-6xl mx-auto p-10">
        <h1 className="text-4xl font-bold mb-8">
          Limited Product Drop
        </h1>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data?.map(
            (product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onReserve={(
                  productId,
                ) =>
                  reservationMutation.mutate(
                    productId,
                  )
                }
              />
            ),
          )}
        </div>
      </div>
    );
  }