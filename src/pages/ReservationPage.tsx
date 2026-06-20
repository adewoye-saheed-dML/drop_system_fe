import {
    useParams,
    useNavigate,
  } from 'react-router-dom';
  
  import { useQuery } from '@tanstack/react-query';
  
  import {
    getReservation,
  } from '../api/reservations';

    import Countdown
    from '../components/Countdown';
  
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
    const expired =
    new Date(
      data.expiresAt,
    ).getTime()
    <
    new Date().getTime();
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

          <p className="mt-2">
  <strong>
    Expires At:
  </strong>{' '}
  {new Date(
    data.expiresAt,
  ).toLocaleString()}
</p>


<Countdown
  expiresAt={
    data.expiresAt
  }
/>
  
        </div>
  
        <button
  disabled={expired}
  onClick={() =>
    navigate(
      `/checkout/${data.id}`,
    )
  }
  className="
    mt-6
    px-5
    py-2
    bg-black
    text-white
    rounded
    disabled:opacity-40
  "
>
  {expired
    ? 'Reservation Expired'
    : 'Proceed To Checkout'
  }
</button>
  
      </div>
    );
  }