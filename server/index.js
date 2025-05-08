import express from 'express';
import cors from 'cors';
import { initializePaymentRoutes } from './routes/payment.js';
import config from './config.json' assert { type: 'json' };

const app = express();
const PORT = config.port || 3001;

// CORS middleware configuration
app.use((req, res, next) => {
  const allowedDomains = config.allowedDomains || [];
  
  // If wildcard is included, allow all origins
  if (allowedDomains.includes('*')) {
    res.header('Access-Control-Allow-Origin', '*');
  } else {
    // Check if the request origin is in the allowed domains list
    const origin = req.headers.origin;
    if (origin && allowedDomains.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Parse JSON request bodies
app.use(express.json());

// Initialize payment routes
initializePaymentRoutes(app);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});