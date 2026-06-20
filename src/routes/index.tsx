import {
    BrowserRouter,
    Routes,
    Route,
  } from 'react-router-dom';
  
  import ProductsPage
  from '../pages/ProductsPage';
  
  import ReservationPage
  from '../pages/ReservationPage';
  
  import OrderPage
  from '../pages/OrderPage';

  import SuccessPage
from '../pages/SuccessPage';
  
  export default function AppRoutes() {
  
    return (
      <BrowserRouter>
        <Routes>
  
          <Route
            path="/"
            element={<ProductsPage />}
          />
  
          <Route
            path="/reservations/:id"
            element={<ReservationPage />}
          />

          <Route
            path="/checkout/:id"
            element={<OrderPage />}
          />

          <Route
            path="/success"
            element={<SuccessPage />}
            />
            
        </Routes>

        
      </BrowserRouter>
    );
  }