import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <CreditCard className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-semibold text-gray-900">PayFlow</span>
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Powered by PhonePe
          </span>
          <div className="h-6 w-1 bg-gray-200 rounded"></div>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            SANDBOX MODE
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;