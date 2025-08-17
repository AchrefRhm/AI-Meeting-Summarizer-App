import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface LiveTranscriptProps {
  transcript: string;
  isTranscribing: boolean;
  confidence?: number;
}

export const LiveTranscript: React.FC<LiveTranscriptProps> = ({ 
  transcript, 
  isTranscribing, 
  confidence = 0.8 
}) => {
  const [words, setWords] = useState<Array<{ text: string; confidence: number; timestamp: number }>>([]);

  useEffect(() => {
    if (transcript) {
      const newWords = transcript.split(' ').map((word, index) => ({
        text: word,
        confidence: Math.random() * 0.4 + 0.6, // Simulate varying confidence
        timestamp: Date.now() + index * 100
      }));
      setWords(prev => [...prev, ...newWords].slice(-100)); // Keep last 100 words
    }
  }, [transcript]);

  const getConfidenceColor = (conf: number) => {
    if (conf > 0.8) return 'text-green-300';
    if (conf > 0.6) return 'text-yellow-300';
    return 'text-red-300';
  };

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-lg flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            isTranscribing ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
          }`}></div>
          Live Transcript
        </h3>
        <div className="flex items-center space-x-2">
          {isTranscribing ? (
            <Volume2 className="w-5 h-5 text-green-400" />
          ) : (
            <VolumeX className="w-5 h-5 text-gray-400" />
          )}
          <span className="text-sm text-white/60">
            Confidence: {Math.round(confidence * 100)}%
          </span>
        </div>
      </div>
      
      <div className="text-white/90 text-sm leading-relaxed max-h-40 overflow-y-auto">
        {words.length > 0 ? (
          <div className="space-y-1">
            {words.map((word, index) => (
              <span
                key={`${word.timestamp}-${index}`}
                className={`inline-block mr-1 px-1 rounded transition-all duration-300 ${
                  getConfidenceColor(word.confidence)
                } ${index === words.length - 1 ? 'bg-white/10' : ''}`}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {word.text}
              </span>
            ))}
            {isTranscribing && (
              <span className="inline-block w-2 h-4 bg-accent-400 animate-pulse ml-1" />
            )}
          </div>
        ) : (
          <p className="text-white/50 italic">
            {isTranscribing ? 'Listening for speech...' : 'Transcript will appear here...'}
          </p>
        )}
      </div>
    </div>
  );
};