export type ReservationStatus =
  | 'ACTIVE'
  | 'EXPIRED'
  | 'COMPLETED';

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  totalStock: number;
  availableStock: number;
}

export interface Reservation {
  id: string;
  productId: string;
  quantity: number;
  status: ReservationStatus;
  expiresAt: string;
  product: Product;
}

export interface Order {
  id: string;
  reservationId: string;
  amount: number;
  status: OrderStatus;
}