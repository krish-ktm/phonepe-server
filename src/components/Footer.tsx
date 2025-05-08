import React from 'react';
import { Shield, Info } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-400" />
            <span className="text-sm">Secure Payment Processing</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-blue-400" />
            <span className="text-sm">This is a demonstration environment. No real transactions will be processed.</span>
          </div>
          
          <div className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} PayFlow
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;