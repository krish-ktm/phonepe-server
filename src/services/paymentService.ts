import axios from 'axios';

// Server base URL - replace with your actual backend URL in production
const API_BASE_URL = 'http://localhost:3001';

/**
 * Initiate a payment with the backend server
 * 
 * @param orderId - Unique order identifier
 * @param amount - Payment amount (in INR)
 * @param returnUrl - URL to return to after payment
 * @returns Promise with payment response
 */
export const initiatePayment = async (
  orderId: string,
  amount: number,
  returnUrl: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/initiate-payment`, {
      orderId,
      amount,
      returnUrl
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      // Return error from the server
      return {
        success: false,
        message: error.response.data.message || 'Payment initiation failed'
      };
    }
    
    // Handle network or other errors
    console.error('Payment service error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection and try again.'
    };
  }
};