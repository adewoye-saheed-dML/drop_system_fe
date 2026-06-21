import {
    useLocation,
  } from 'react-router-dom';
  
  
  export default function SuccessPage() {
  
    const location =
      useLocation();
  
    const order =
      location.state?.order;
  
  
    return (
      <div className="max-w-xl mx-auto p-10">
  
        <div className="border rounded-lg p-8">
  
          <h1 className="text-3xl font-bold text-green-600">
            Checkout Successful 🎉
          </h1>
  
  
          <p className="mt-4">
            Your order has been created.
          </p>
  
  
          {order && (
            <div className="mt-5">
  
              <p>
                <strong>
                  Order ID:
                </strong>
  
                {' '}
                {order.id}
              </p>
  
  
              <p className="mt-2">
                <strong>
                  Status:
                </strong>
  
                {' '}
                {order.status}
              </p>

              <p className="mt-2">
             <strong>Amount:</strong>
              ${order.amount}
              </p>
  
            </div>
          )}
  
        </div>
  
      </div>
    );
  }