
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Task {
  id: string;
  title: string;
  subtasks: Array<{ completed: boolean }>;
  completed: boolean;
}

interface ProgressTrackerProps {
  tasks: Task[];
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ tasks }) => {
  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    
    let totalItems = 0;
    let completedItems = 0;
    
    tasks.forEach(task => {
      // Count the main task
      totalItems += 1;
      if (task.completed) {
        completedItems += 1;
      }
      
      // Count subtasks
      task.subtasks.forEach(subtask => {
        totalItems += 1;
        if (subtask.completed) {
          completedItems += 1;
        }
      });
    });
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const getTaskStats = () => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalSubtasks = tasks.reduce((sum, task) => sum + task.subtasks.length, 0);
    const completedSubtasks = tasks.reduce(
      (sum, task) => sum + task.subtasks.filter(subtask => subtask.completed).length,
      0
    );
    
    return {
      completedTasks,
      totalTasks: tasks.length,
      completedSubtasks,
      totalSubtasks
    };
  };

  const progress = calculateProgress();
  const stats = getTaskStats();

  return (
    <Card className="glass-card ios-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-medical-dark">
          Progress Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-medical-dark">Overall Progress</span>
            <span className="text-sm font-bold text-medical-blue">{progress}%</span>
          </div>
          <Progress value={progress} className="h-3 rounded-full" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-medical-blue/5 rounded-xl">
            <div className="text-2xl font-bold text-medical-blue">
              {stats.completedTasks}
            </div>
            <div className="text-sm text-gray-600">
              of {stats.totalTasks} tasks
            </div>
          </div>
          
          <div className="text-center p-4 bg-medical-teal/5 rounded-xl">
            <div className="text-2xl font-bold text-medical-teal">
              {stats.completedSubtasks}
            </div>
            <div className="text-sm text-gray-600">
              of {stats.totalSubtasks} subtasks
            </div>
          </div>
        </div>

        {/* Weekly Goal */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-medical-dark mb-3">This Week's Goal</h4>
          <div className="bg-gradient-to-r from-medical-blue/10 to-medical-teal/10 p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Complete all tasks</span>
              <span className="text-sm font-bold text-medical-blue">
                {progress === 100 ? '🎉 Done!' : `${progress}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center p-4 bg-gradient-to-r from-medical-light to-blue-50 rounded-xl">
          <p className="text-sm text-medical-dark font-medium">
            {progress === 100 
              ? "Excellent work! You've completed all your tasks! 🎉"
              : progress >= 75
              ? "Great progress! You're almost there! 💪"
              : progress >= 50
              ? "Good job! Keep up the momentum! 📚"
              : progress > 0
              ? "Nice start! Every step counts! ✨"
              : "Ready to begin your study journey? 🚀"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
