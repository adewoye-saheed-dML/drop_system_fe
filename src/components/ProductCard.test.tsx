import {
    describe,
    expect,
    it,
    vi,
  } from 'vitest';
  
  import {
    render,
    screen,
  } from '@testing-library/react';
  
  import userEvent
    from '@testing-library/user-event';
  
  import ProductCard
    from './ProductCard';
  
  import type { Product } from '../types/product';
  
  const product: Product = {
    id: 'product-1',
    name: 'Limited Hoodie',
    description:
      'A limited edition hoodie.',
    price: '50.00',
    totalStock: 10,
    availableStock: 3,
  };
  
  describe('ProductCard', () => {
    it('renders product information', () => {
      render(
        <ProductCard
          product={product}
          onReserve={vi.fn()}
          isReserving={false}
        />,
      );
  
      expect(
        screen.getByText('Limited Hoodie'),
      ).toBeInTheDocument();
  
      expect(
        screen.getByText('$50.00'),
      ).toBeInTheDocument();
  
      expect(
        screen.getByText('3'),
      ).toBeInTheDocument();
    });
  
    it('calls onReserve when clicked', async () => {
      const user =
        userEvent.setup();
  
      const onReserve = vi.fn();
  
      render(
        <ProductCard
          product={product}
          onReserve={onReserve}
          isReserving={false}
        />,
      );
  
      await user.click(
        screen.getByRole('button', {
          name: 'Reserve',
        }),
      );
  
      expect(onReserve)
        .toHaveBeenCalledWith(
          'product-1',
        );
    });
  
    it('disables reserve when sold out', () => {
      render(
        <ProductCard
          product={{
            ...product,
            availableStock: 0,
          }}
          onReserve={vi.fn()}
          isReserving={false}
        />,
      );
  
      expect(
        screen.getByRole('button', {
          name: 'Sold Out',
        }),
      ).toBeDisabled();
    });
  
    it('shows reserving state', () => {
      render(
        <ProductCard
          product={product}
          onReserve={vi.fn()}
          isReserving
        />,
      );
  
      expect(
        screen.getByRole('button', {
          name: 'Reserving...',
        }),
      ).toBeDisabled();
    });
  });