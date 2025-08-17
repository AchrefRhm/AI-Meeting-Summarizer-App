import React from 'react';

interface AudioVisualizerProps {
  audioData: number[];
  isRecording: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioData, isRecording }) => {
  return (
    <div className="flex items-center justify-center space-x-1 h-16 bg-white/5 rounded-lg p-4">
      {audioData.map((value, index) => (
        <div
          key={index}
          className={`w-1 bg-gradient-to-t from-accent-500 to-accent-300 rounded-full transition-all duration-100 ${
            isRecording ? 'opacity-100' : 'opacity-30'
          }`}
          style={{
            height: `${Math.max(4, value * 40)}px`,
            transform: `scaleY(${isRecording ? 1 : 0.3})`,
          }}
        />
      ))}
    </div>
  );
};