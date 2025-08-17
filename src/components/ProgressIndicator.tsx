import React from 'react';
import { CheckCircle, Clock, Loader2 } from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
  duration?: number;
}

interface ProgressIndicatorProps {
  steps: ProgressStep[];
  currentStep: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ steps, currentStep }) => {
  const getStepIcon = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'active':
        return <Loader2 className="w-5 h-5 text-accent-400 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-white/40" />;
    }
  };

  const getStepColor = (step: ProgressStep) => {
    switch (step.status) {
      case 'completed':
        return 'border-green-400 bg-green-400/10';
      case 'active':
        return 'border-accent-400 bg-accent-400/10';
      default:
        return 'border-white/20 bg-white/5';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
      <h3 className="text-white font-semibold text-lg mb-4">Processing Status</h3>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getStepColor(step)}`}>
              {getStepIcon(step)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${
                  step.status === 'active' ? 'text-white' : 
                  step.status === 'completed' ? 'text-green-300' : 'text-white/60'
                }`}>
                  {step.label}
                </span>
                {step.duration && step.status === 'active' && (
                  <span className="text-sm text-white/60">
                    ~{step.duration}s
                  </span>
                )}
              </div>
              {step.status === 'active' && (
                <div className="mt-2 w-full bg-white/10 rounded-full h-2">
                  <div className="bg-accent-400 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`absolute left-5 mt-10 w-0.5 h-6 ${
                step.status === 'completed' ? 'bg-green-400' : 'bg-white/20'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};