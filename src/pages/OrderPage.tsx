import {
    useParams,
    useNavigate,
  } from 'react-router-dom';
  
  import {
    useMutation,
  } from '@tanstack/react-query';
  
  import {
    checkout,
  } from '../api/checkout';
  
  export default function OrderPage() {
  
    const { id } = useParams();
  
    const navigate =
      useNavigate();
  
      const checkoutMutation =
      useMutation({
        mutationFn: () =>
          checkout(id!),
    
        onSuccess: (order) => {
          navigate(
            '/success',
            {
              state: {
                order,
              },
            },
          );
        },
      
      
       onError: (
         error:any,
       ) => {
      
         alert(
          error.response?.data?.message
          ??
          'Checkout failed'
         );
      
       }
      
      });
  
    return (
      <div className="max-w-xl mx-auto p-10">
  
        <h1 className="text-3xl font-bold">
          Checkout
        </h1>
  
        <p className="mt-4">
          Reservation ID:
          {id}
        </p>
  
        <button
 disabled={
   checkoutMutation.isPending
 }
 onClick={() =>
   checkoutMutation.mutate()
 }
 className="
 mt-6
 px-5
 py-2
 bg-black
 text-white
 rounded
 disabled:opacity-50
 "
>

{
 checkoutMutation.isPending
 ? 'Processing...'
 : 'Complete Checkout'
}

</button>
  
      </div>
    );
  }