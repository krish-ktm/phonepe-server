import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, ArrowRight, Shield } from 'lucide-react';
import { initiatePayment } from '../services/paymentService';

const PaymentForm: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate amount
      const validAmount = parseFloat(amount.toString());
      if (isNaN(validAmount) || validAmount <= 0) {
        throw new Error('Please enter a valid positive amount');
      }
      
      // Generate a unique order ID
      const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Set return URL to the payment status page
      const returnUrl = `${window.location.origin}/payment-status`;
      
      // Call service to initiate payment with validated amount
      const response = await initiatePayment(orderId, validAmount, returnUrl);
      
      if (response.success && response.redirectUrl) {
        // Store order ID in session storage for retrieval on return
        sessionStorage.setItem('currentOrderId', orderId);
        
        // Redirect to PhonePe payment page
        window.location.href = response.redirectUrl;
      } else {
        setError(response.message || 'Failed to initiate payment');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      console.error('Payment initiation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="bg-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Payment Details</h2>
          <CreditCard className="h-8 w-8" />
        </div>
        <p className="mt-2 text-blue-100">Complete your payment securely with PhonePe</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (₹)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Banknote className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
              min="1"
              step="0.01"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">Minimum amount: ₹1</p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:bg-blue-300"
        >
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/>
          ) : (
            <>
              <span>Pay ₹{amount.toFixed(2)}</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
      
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex items-center justify-center space-x-2">
        <Shield className="h-4 w-4 text-green-500" />
        <span>All transactions are secure and encrypted</span>
      </div>
    </div>
  );
};

export default PaymentForm;