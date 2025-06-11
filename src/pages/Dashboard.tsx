
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import TaskManager from '../components/TaskManager';
import PomodoroTimer from '../components/PomodoroTimer';
import ProgressTracker from '../components/ProgressTracker';
import Navigation from '../components/Navigation';

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem(`qraya_tasks_${user?.id}`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [user?.id]);

  const updateTasks = (newTasks: any[]) => {
    setTasks(newTasks);
    localStorage.setItem(`qraya_tasks_${user?.id}`, JSON.stringify(newTasks));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-light via-white to-blue-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-medical-dark mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600">Year {user?.year} • FMPC</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <TaskManager tasks={tasks} onTasksUpdate={updateTasks} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <PomodoroTimer />
            <ProgressTracker tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
