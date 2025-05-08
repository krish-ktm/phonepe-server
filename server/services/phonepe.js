import crypto from 'crypto';
import axios from 'axios';
import config from '../config.json' assert { type: 'json' };

/**
 * Generate a SHA-256 checksum for PhonePe API calls
 * @param {Object} payload - Request payload
 * @param {string} saltKey - PhonePe salt key
 * @returns {string} Base64 encoded checksum
 */
function generateChecksum(payload, saltKey) {
  const payloadString = typeof payload === 'string' 
    ? payload 
    : JSON.stringify(payload);
  
  // Create checksum string as per PhonePe docs: payload + /pg/v1/pay + saltKey
  const checksumString = payloadString + '/pg/v1/pay' + saltKey;
  
  // Generate SHA-256 hash
  const hash = crypto.createHash('sha256').update(checksumString).digest('hex');
  
  // Return as checksum string
  return hash + '###' + config.phonepe.saltIndex;
}

/**
 * Create a payment request with PhonePe
 * @param {Object} paymentDetails - Payment details
 * @returns {Promise<Object>} Payment response
 */
export async function createPaymentRequest(paymentDetails) {
  try {
    // Prepare request payload
    const payload = {
      merchantId: paymentDetails.merchantId,
      merchantTransactionId: paymentDetails.merchantTransactionId,
      merchantUserId: "MUID123",
      amount: paymentDetails.amount,
      redirectUrl: paymentDetails.redirectUrl,
      redirectMode: paymentDetails.redirectMode,
      callbackUrl: paymentDetails.callbackUrl,
      mobileNumber: paymentDetails.mobileNumber || '9999999999',
      paymentInstrument: {
        type: 'PAY_PAGE'
      }
    };
    
    // Convert payload to base64
    const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
    
    // Generate checksum
    const checksum = generateChecksum(base64Payload, config.phonepe.saltKey);
    
    // Make API request to PhonePe
    const response = await axios.post(
      `${config.phonepe.baseUrl}/pg/v1/pay`,
      {
        request: base64Payload
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error creating payment request:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Verify payment callback with PhonePe
 * @param {string} merchantTransactionId - Order/transaction ID
 * @returns {Promise<Object>} Verification result
 */
export async function verifyPaymentCallback(merchantTransactionId) {
  try {
    // Generate checksum for status check
    const checksum = generateChecksum(`/pg/v1/status/${config.phonepe.merchantId}/${merchantTransactionId}`, config.phonepe.saltKey);
    
    // Make API request to PhonePe to check status
    const response = await axios.get(
      `${config.phonepe.baseUrl}/pg/v1/status/${config.phonepe.merchantId}/${merchantTransactionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': config.phonepe.merchantId
        }
      }
    );
    
    if (response.data.success) {
      const paymentStatus = response.data.data.paymentDetails.paymentStatus;
      return {
        success: paymentStatus === 'PAYMENT_SUCCESS',
        data: response.data.data
      };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Error verifying payment callback:', error.response?.data || error.message);
    return { success: false };
  }
}