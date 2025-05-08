import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import PaymentForm from './components/PaymentForm';
import PaymentStatus from './components/PaymentStatus';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <Routes>
            <Route path="/" element={<PaymentForm />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;