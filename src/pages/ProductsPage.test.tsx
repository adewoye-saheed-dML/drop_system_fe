import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
  } from 'vitest';
  
  import {
    render,
    screen,
    waitFor,
  } from '@testing-library/react';
  
  import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query';
  
  import {
    MemoryRouter,
  } from 'react-router-dom';
  
  import ProductsPage
    from './ProductsPage';
  
  import {
    getProducts,
  } from '../api/products';
  
  vi.mock('../api/products', () => ({
    getProducts: vi.fn(),
  }));
  
  vi.mock('../api/reservations', () => ({
    createReservation: vi.fn(),
  }));
  
  const mockedGetProducts =
    vi.mocked(getProducts);
  
  function renderPage() {
    const queryClient =
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
  
    return render(
      <QueryClientProvider
        client={queryClient}
      >
        <MemoryRouter>
          <ProductsPage />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  }
  
  describe('ProductsPage', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });
  
    it('renders products', async () => {
      mockedGetProducts.mockResolvedValue([
        {
          id: 'product-1',
          name: 'Limited Hoodie',
          description:
            'Limited edition hoodie',
          price: '50.00',
          totalStock: 10,
          availableStock: 5,
        },
      ]);
  
      renderPage();
  
      await waitFor(() => {
        expect(
          screen.getByText(
            'Limited Hoodie',
          ),
        ).toBeInTheDocument();
      });
    });
  
    it('shows loading failure', async () => {
      mockedGetProducts.mockRejectedValue(
        new Error('Network error'),
      );
  
      renderPage();
  
      await waitFor(() => {
        expect(
          screen.getByText(
            'Unable to load products',
          ),
        ).toBeInTheDocument();
      });
    });
  
    it('shows empty state', async () => {
      mockedGetProducts.mockResolvedValue([]);
  
      renderPage();
  
      await waitFor(() => {
        expect(
          screen.getByText(
            'No products available',
          ),
        ).toBeInTheDocument();
      });
    });
  });