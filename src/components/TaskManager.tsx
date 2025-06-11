
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trash2, Plus } from 'lucide-react';

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  subtasks: Subtask[];
  completed: boolean;
  createdAt: string;
}

interface TaskManagerProps {
  tasks: Task[];
  onTasksUpdate: (tasks: Task[]) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({ tasks, onTasksUpdate }) => {
  const [showForm, setShowForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>(['']);

  const addSubtask = () => {
    setSubtasks([...subtasks, '']);
  };

  const updateSubtask = (index: number, value: string) => {
    const updated = [...subtasks];
    updated[index] = value;
    setSubtasks(updated);
  };

  const removeSubtask = (index: number) => {
    const updated = subtasks.filter((_, i) => i !== index);
    setSubtasks(updated);
  };

  const createTask = () => {
    if (!taskTitle.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle,
      description: taskDescription,
      subtasks: subtasks
        .filter(s => s.trim())
        .map(s => ({
          id: Date.now().toString() + Math.random(),
          title: s.trim(),
          completed: false
        })),
      completed: false,
      createdAt: new Date().toISOString()
    };

    onTasksUpdate([...tasks, newTask]);
    setTaskTitle('');
    setTaskDescription('');
    setSubtasks(['']);
    setShowForm(false);
    toast.success('Task created successfully!');
  };

  const toggleTask = (taskId: string) => {
    const updated = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    onTasksUpdate(updated);
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(subtask => {
          if (subtask.id === subtaskId) {
            return { ...subtask, completed: !subtask.completed };
          }
          return subtask;
        });
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    });
    onTasksUpdate(updated);
  };

  const deleteTask = (taskId: string) => {
    const updated = tasks.filter(task => task.id !== taskId);
    onTasksUpdate(updated);
    toast.success('Task deleted');
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card ios-shadow">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-medical-dark">
            Weekly Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              className="medical-gradient text-white rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Task
            </Button>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Task title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="rounded-xl"
              />
              <Textarea
                placeholder="Task description (optional)"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="rounded-xl"
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-medical-dark">Subtasks</label>
                {subtasks.map((subtask, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Subtask ${index + 1}`}
                      value={subtask}
                      onChange={(e) => updateSubtask(index, e.target.value)}
                      className="rounded-xl"
                    />
                    {subtasks.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubtask(index)}
                        className="rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSubtask}
                  className="rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Subtask
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={createTask} className="medical-gradient text-white rounded-xl">
                  Create Task
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task.id} className="glass-card ios-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${
                      task.completed ? 'line-through text-gray-500' : 'text-medical-dark'
                    }`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-gray-600 mt-1">{task.description}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {task.subtasks.length > 0 && (
                <div className="ml-8 space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center space-x-3">
                      <Checkbox
                        checked={subtask.completed}
                        onCheckedChange={() => toggleSubtask(task.id, subtask.id)}
                      />
                      <span className={`text-sm ${
                        subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'
                      }`}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && (
        <Card className="glass-card ios-shadow">
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-medical-dark mb-2">
              No tasks yet
            </h3>
            <p className="text-gray-600">
              Create your first task to start organizing your studies!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskManager;
