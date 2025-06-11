
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

type TimerMode = 'work' | 'break';
type Preset = '25-5' | '50-10' | 'custom';

const PomodoroTimer = () => {
  const [mode, setMode] = useState<TimerMode>('work');
  const [preset, setPreset] = useState<Preset>('25-5');
  const [customWork, setCustomWork] = useState(25);
  const [customBreak, setCustomBreak] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getWorkTime = () => {
    switch (preset) {
      case '25-5': return 25;
      case '50-10': return 50;
      case 'custom': return customWork;
      default: return 25;
    }
  };

  const getBreakTime = () => {
    switch (preset) {
      case '25-5': return 5;
      case '50-10': return 10;
      case 'custom': return customBreak;
      default: return 5;
    }
  };

  useEffect(() => {
    if (mode === 'work') {
      setTimeLeft(getWorkTime() * 60);
    } else {
      setTimeLeft(getBreakTime() * 60);
    }
  }, [mode, preset, customWork, customBreak]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (mode === 'work') {
              setCycles(c => c + 1);
              setMode('break');
              toast.success('Work session complete! Time for a break.');
            } else {
              setMode('work');
              toast.success('Break time is over! Ready for another work session?');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'work') {
      setTimeLeft(getWorkTime() * 60);
    } else {
      setTimeLeft(getBreakTime() * 60);
    }
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
  };

  return (
    <Card className="glass-card ios-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-medical-dark">
          Pomodoro Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Selection */}
        <div>
          <label className="block text-sm font-medium text-medical-dark mb-2">
            Timer Preset
          </label>
          <Select value={preset} onValueChange={(value: Preset) => setPreset(value)}>
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25-5">25min work / 5min break</SelectItem>
              <SelectItem value="50-10">50min work / 10min break</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Timer Settings */}
        {preset === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-medical-dark mb-2">
                Work (min)
              </label>
              <Input
                type="number"
                value={customWork}
                onChange={(e) => setCustomWork(parseInt(e.target.value) || 25)}
                min="1"
                max="120"
                className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-medical-dark mb-2">
                Break (min)
              </label>
              <Input
                type="number"
                value={customBreak}
                onChange={(e) => setCustomBreak(parseInt(e.target.value) || 5)}
                min="1"
                max="60"
                className="rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex space-x-2">
          <Button
            variant={mode === 'work' ? 'default' : 'outline'}
            onClick={() => switchMode('work')}
            className={`flex-1 rounded-xl ${
              mode === 'work' ? 'medical-gradient text-white' : ''
            }`}
          >
            Work
          </Button>
          <Button
            variant={mode === 'break' ? 'default' : 'outline'}
            onClick={() => switchMode('break')}
            className={`flex-1 rounded-xl ${
              mode === 'break' ? 'bg-medical-teal text-white' : ''
            }`}
          >
            Break
          </Button>
        </div>

        {/* Timer Display */}
        <div className="text-center">
          <div className={`text-6xl font-bold mb-4 ${
            mode === 'work' ? 'text-medical-blue' : 'text-medical-teal'
          }`}>
            {formatTime(timeLeft)}
          </div>
          <p className="text-lg text-gray-600 mb-6">
            {mode === 'work' ? 'Focus Time' : 'Break Time'}
          </p>

          <div className="flex space-x-2">
            <Button
              onClick={toggleTimer}
              className={`flex-1 rounded-xl ${
                mode === 'work' 
                  ? 'medical-gradient text-white' 
                  : 'bg-medical-teal hover:bg-medical-teal/90 text-white'
              }`}
            >
              {isRunning ? 'Pause' : 'Start'}
            </Button>
            <Button
              variant="outline"
              onClick={resetTimer}
              className="rounded-xl"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Cycles Completed */}
        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Completed Cycles: <span className="font-semibold text-medical-blue">{cycles}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
