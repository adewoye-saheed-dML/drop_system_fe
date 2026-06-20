import {
    useParams,
    useNavigate,
  } from 'react-router-dom';
  
  import { useQuery } from '@tanstack/react-query';
  
  import {
    getReservation,
  } from '../api/reservations';
  
  export default function ReservationPage() {
  
    const { id } = useParams();
  
    const navigate =
      useNavigate();
  
    const {
      data,
      isLoading,
    } = useQuery({
      queryKey: [
        'reservation',
        id,
      ],
      queryFn: () =>
        getReservation(id!),
    });
  
    if (isLoading) {
      return (
        <div className="p-10">
          Loading...
        </div>
      );
    }
  
    return (
      <div className="max-w-xl mx-auto p-10">
  
        <h1 className="text-3xl font-bold">
          Reservation Created
        </h1>
  
        <div className="mt-5">
  
          <p>
            Status:
            <strong>
              {' '}
              {data.status}
            </strong>
          </p>
  
          <p>
            Quantity:
            <strong>
              {' '}
              {data.quantity}
            </strong>
          </p>
  
        </div>
  
        <button
          onClick={() =>
            navigate(
              `/checkout/${data.id}`,
            )
          }
          className="mt-5 px-5 py-2 bg-black text-white rounded"
        >
          Proceed To Checkout
        </button>
  
      </div>
    );
  }