import config from '../config.json' assert { type: 'json' };
import { createPaymentRequest, verifyPaymentCallback } from '../services/phonepe.js';

// Store order mappings in memory (replace with database in production)
const orderMappings = new Map();

export function initializePaymentRoutes(app) {
  // Route to initiate a payment
  app.post('/api/initiate-payment', async (req, res) => {
    try {
      const { orderId, amount, returnUrl } = req.body;
      
      // Enhanced validation for required fields
      if (!orderId || typeof orderId !== 'string') {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid or missing orderId' 
        });
      }

      if (!amount || typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Amount must be a positive number' 
        });
      }

      if (!returnUrl || typeof returnUrl !== 'string' || !returnUrl.startsWith('http')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid or missing returnUrl' 
        });
      }
      
      // Log request details for debugging
      console.log('Payment request details:', {
        orderId,
        amount,
        returnUrl,
        amountInPaise: Math.round(amount * 100)
      });
      
      // Store mapping between orderId and returnUrl
      orderMappings.set(orderId, returnUrl);
      
      // Create payment request with PhonePe
      const paymentResponse = await createPaymentRequest({
        merchantId: config.phonepe.merchantId,
        merchantTransactionId: orderId,
        amount: Math.round(amount * 100), // Convert to paise and ensure integer
        redirectUrl: `${config.serverBaseUrl}${config.callbackPath}?orderId=${orderId}`,
        redirectMode: 'REDIRECT',
        callbackUrl: `${config.serverBaseUrl}${config.callbackPath}?orderId=${orderId}`,
      });
      
      // Log PhonePe response for debugging
      console.log('PhonePe API response:', paymentResponse);
      
      if (paymentResponse && paymentResponse.success) {
        return res.status(200).json({
          success: true,
          redirectUrl: paymentResponse.data.instrumentResponse.redirectInfo.url
        });
      } else {
        return res.status(400).json({
          success: false,
          message: paymentResponse.message || 'Failed to initiate payment'
        });
      }
    } catch (error) {
      console.error('Error initiating payment:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  });

  // Callback route for PhonePe to redirect after payment
  app.get(config.callbackPath, async (req, res) => {
    try {
      const { orderId } = req.query;
      
      if (!orderId) {
        return res.status(400).send('Missing order ID');
      }
      
      // Get the stored return URL for this order
      const returnUrl = orderMappings.get(orderId);
      
      if (!returnUrl) {
        return res.status(404).send('Order not found');
      }
      
      // Verify the payment status with PhonePe
      const verificationResult = await verifyPaymentCallback(orderId);
      
      // Determine status based on verification
      const status = verificationResult.success ? 'success' : 'failure';
      
      // Redirect to the client's return URL with status
      res.redirect(`${returnUrl}?status=${status}&orderId=${orderId}`);
      
      // Clear the mapping after successful redirect
      orderMappings.delete(orderId);
    } catch (error) {
      console.error('Error in payment callback:', error);
      res.status(500).send('Internal server error');
    }
  });
}