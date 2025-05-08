import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw, ArrowLeft } from 'lucide-react';

const PaymentStatus: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'success' | 'failure' | 'loading'>('loading');
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    // Parse URL parameters
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get('status');
    const orderIdParam = params.get('orderId');
    
    if (paymentStatus === 'success' || paymentStatus === 'failure') {
      setStatus(paymentStatus);
      if (orderIdParam) {
        setOrderId(orderIdParam);
      } else {
        // Try to get orderId from session storage if not in URL
        const storedOrderId = sessionStorage.getItem('currentOrderId');
        if (storedOrderId) {
          setOrderId(storedOrderId);
        }
      }
    } else {
      // Default to failure if status is not explicitly success
      setStatus('failure');
    }
    
    // Clear the stored orderId from session
    sessionStorage.removeItem('currentOrderId');
  }, [location]);

  const handleGoBack = () => {
    navigate('/');
  };

  // Render appropriate status message
  const renderStatusContent = () => {
    switch (status) {
      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully.
            </p>
            {orderId && (
              <div className="mb-6 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-gray-700 font-medium">{orderId}</p>
              </div>
            )}
          </div>
        );
      
      case 'failure':
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              Your payment could not be processed. Please try again.
            </p>
            {orderId && (
              <div className="mb-6 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="text-gray-700 font-medium">{orderId}</p>
              </div>
            )}
          </div>
        );
      
      case 'loading':
      default:
        return (
          <div className="text-center">
            <RefreshCw className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Processing Payment</h2>
            <p className="text-gray-600 mb-6">
              Please wait while we verify your payment...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`p-8 ${status === 'success' ? 'bg-green-50' : status === 'failure' ? 'bg-red-50' : 'bg-blue-50'}`}>
        {renderStatusContent()}
        
        <button
          onClick={handleGoBack}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Payment</span>
        </button>
      </div>
    </div>
  );
};

export default PaymentStatus;