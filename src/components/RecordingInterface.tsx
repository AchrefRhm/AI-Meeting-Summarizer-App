import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Square, Play, Upload, Clock } from 'lucide-react';
import { audioService } from '../services/audioService';
import { transcriptionService } from '../services/transcriptionService';
import { AudioVisualizer } from './AudioVisualizer';
import { LiveTranscript } from './LiveTranscript';
import { ProgressIndicator } from './ProgressIndicator';
import { useAudioVisualization } from '../hooks/useAudioVisualization';

interface RecordingInterfaceProps {
  onRecordingComplete: (audioBlob: Blob, transcript: string) => void;
  onFileUpload: (file: File) => void;
}

export const RecordingInterface: React.FC<RecordingInterfaceProps> = ({
  onRecordingComplete,
  onFileUpload
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [confidence, setConfidence] = useState(0.8);
  const [processingSteps, setProcessingSteps] = useState([
    { id: 'recording', label: 'Recording Audio', status: 'pending' as const },
    { id: 'transcribing', label: 'Transcribing Speech', status: 'pending' as const, duration: 30 },
    { id: 'analyzing', label: 'AI Analysis', status: 'pending' as const, duration: 45 },
    { id: 'generating', label: 'Generating Summary', status: 'pending' as const, duration: 20 }
  ]);
  
  const audioData = useAudioVisualization(isRecording);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const updateProcessingStep = (stepId: string, status: 'pending' | 'active' | 'completed') => {
    setProcessingSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const startRecording = async () => {
    try {
      await audioService.startRecording();
      setIsRecording(true);
      setRecordingTime(0);
      setTranscript('');
      updateProcessingStep('recording', 'active');

      // Start real-time transcription
      transcriptionService.startRealTimeTranscription((segment) => {
        setTranscript(prev => prev + ' ' + segment.text);
        setConfidence(segment.confidence);
      });
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Failed to start recording. Please check your microphone permissions.');
    }
  };

  const stopRecording = async () => {
    try {
      updateProcessingStep('recording', 'completed');
      updateProcessingStep('transcribing', 'active');
      setIsTranscribing(true);
      const audioBlob = await audioService.stopRecording();
      transcriptionService.stopRealTimeTranscription();
      setIsRecording(false);
      
      // Simulate processing steps
      setTimeout(() => {
        updateProcessingStep('transcribing', 'completed');
        updateProcessingStep('analyzing', 'active');
      }, 2000);
      
      setTimeout(() => {
        updateProcessingStep('analyzing', 'completed');
        updateProcessingStep('generating', 'active');
      }, 4000);
      
      // Process the final transcript
      const finalTranscript = await transcriptionService.transcribeAudioFile(audioBlob);
      setTranscript(finalTranscript);
      
      updateProcessingStep('generating', 'completed');
      onRecordingComplete(audioBlob, finalTranscript);
      setIsTranscribing(false);
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsTranscribing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Record Your Meeting</h2>
          <p className="text-white/80 text-lg">
            Start recording or upload an audio file to begin transcription and analysis
          </p>
        </div>

        {/* Recording Controls */}
        <div className="flex justify-center items-center space-x-6 mb-8">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="group relative bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-full p-6 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Mic className="w-8 h-8" />
              <span className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Start Recording
              </span>
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={stopRecording}
                disabled={isTranscribing}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full p-6 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
              >
                <Square className="w-8 h-8" />
              </button>
              <div className="text-center">
                <div className="flex items-center text-white text-xl font-mono">
                  <Clock className="w-5 h-5 mr-2" />
                  {formatTime(recordingTime)}
                </div>
                <div className="flex items-center justify-center mt-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-white/80 text-sm">Recording...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Audio Visualizer */}
        {isRecording && (
          <div className="mb-8">
            <AudioVisualizer audioData={audioData} isRecording={isRecording} />
          </div>
        )}

        {/* File Upload */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center">
            <label className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border-2 border-dashed border-white/30 hover:border-white/50 rounded-xl p-6 cursor-pointer transition-all duration-300">
              <Upload className="w-6 h-6 text-white" />
              <span className="text-white font-medium">Upload Audio File</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-white/60 text-sm text-center mt-2">
            Supported formats: MP3, WAV, M4A, WebM
          </p>
        </div>

        {/* Live Transcript and Processing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LiveTranscript 
            transcript={transcript} 
            isTranscribing={isRecording || isTranscribing}
            confidence={confidence}
          />
          
          {(isRecording || isTranscribing) && (
            <ProgressIndicator 
              steps={processingSteps}
              currentStep={isRecording ? 'recording' : 'transcribing'}
            />
          )}
        </div>
      </div>
    </div>
  );
};
