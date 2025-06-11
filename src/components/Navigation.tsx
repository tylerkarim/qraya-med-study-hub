
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-medical-blue rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="text-2xl font-bold text-medical-dark">Qraya</span>
            </div>

            <div className="flex space-x-1">
              <Button
                variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
                onClick={() => navigate('/dashboard')}
                className={`rounded-xl ${
                  location.pathname === '/dashboard' 
                    ? 'medical-gradient text-white' 
                    : 'text-gray-600 hover:text-medical-blue'
                }`}
              >
                Dashboard
              </Button>
              <Button
                variant={location.pathname === '/community' ? 'default' : 'ghost'}
                onClick={() => navigate('/community')}
                className={`rounded-xl ${
                  location.pathname === '/community' 
                    ? 'medical-gradient text-white' 
                    : 'text-gray-600 hover:text-medical-blue'
                }`}
              >
                Community
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium text-medical-dark">{user?.username}</p>
              <p className="text-sm text-gray-500">Year {user?.year}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} className="rounded-xl">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
