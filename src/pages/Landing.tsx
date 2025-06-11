
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="p-6 md:p-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-medical-blue rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <span className="text-2xl font-bold text-medical-dark">Qraya</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-medical-blue hover:bg-medical-blue/10"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Log In
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-medical-blue hover:bg-medical-blue/90 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6 md:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-medical-dark mb-6 leading-tight">
              Study
              <span className="text-transparent bg-clip-text medical-gradient"> Better</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto font-normal">
              The ultimate study platform designed exclusively for FMPC medical students. 
              Organize, focus, and connect with your peers.
            </p>
          </div>

          {/* Main CTA Button */}
          <div className="mb-16">
            <Button
              onClick={() => navigate('/auth')}
              size="lg"
              className="bg-medical-blue hover:bg-medical-blue/90 text-white font-semibold text-lg px-12 py-6 rounded-2xl ios-shadow transform hover:scale-105 transition-all duration-200"
            >
              Get Started
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="glass-card p-8 rounded-2xl ios-shadow">
              <div className="w-12 h-12 bg-medical-blue/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-medical-blue text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-medical-dark mb-2">Task Management</h3>
              <p className="text-gray-600">Organize your studies with tasks and subtasks. Track your progress weekly.</p>
            </div>

            <div className="glass-card p-8 rounded-2xl ios-shadow">
              <div className="w-12 h-12 bg-medical-teal/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-medical-teal text-2xl">⏱️</span>
              </div>
              <h3 className="text-xl font-semibold text-medical-dark mb-2">Pomodoro Timer</h3>
              <p className="text-gray-600">Stay focused with customizable study sessions and break intervals.</p>
            </div>

            <div className="glass-card p-8 rounded-2xl ios-shadow">
              <div className="w-12 h-12 bg-medical-blue/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-medical-blue text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-medical-dark mb-2">Study Community</h3>
              <p className="text-gray-600">Connect with classmates in your year. Share knowledge and stay motivated.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-500">
        <p>&copy; 2024 Qraya. Made for FMPC students.</p>
      </footer>
    </div>
  );
};

export default Landing;
