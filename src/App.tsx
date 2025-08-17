import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { RecordingInterface } from './components/RecordingInterface';
import { MeetingSummary } from './components/MeetingSummary';
import { Meeting } from './types/meeting';
import { aiService } from './services/aiService';
import { transcriptionService } from './services/transcriptionService';
import { ArrowLeft, Sparkles, Mic, BarChart3 } from 'lucide-react';
import { useRealTimeUpdates } from './hooks/useRealTimeUpdates';

type AppState = 'dashboard' | 'recording' | 'summary';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('dashboard');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { meetings: realTimeMeetings, addMeeting, updateMeetingStatus } = useRealTimeUpdates(meetings);

  // Load demo data
  useEffect(() => {
    const demoMeetings: Meeting[] = [
      {
        id: '1',
        title: 'Q4 Product Planning Meeting',
        date: '2024-01-08',
        duration: 45,
        participants: ['John Smith', 'Sarah Johnson', 'Mike Chen'],
        status: 'completed',
        createdAt: '2024-01-08T10:00:00Z',
        updatedAt: '2024-01-08T10:45:00Z',
        transcript: 'Sample transcript content...',
        summary: {
          keyPoints: [
            'Discussed Q4 product roadmap and feature prioritization',
            'Reviewed current sprint progress and identified blockers',
            'Analyzed user feedback from recent feature release'
          ],
          actionItems: [
            {
              id: '1',
              task: 'Update project timeline based on new requirements',
              assignee: 'John Smith',
              deadline: '2024-01-15',
              priority: 'high',
              status: 'pending'
            },
            {
              id: '2',
              task: 'Prepare user research findings presentation',
              assignee: 'Sarah Johnson',
              deadline: '2024-01-12',
              priority: 'medium',
              status: 'pending'
            }
          ],
          decisions: [
            'Approved budget increase for Q1 marketing initiatives',
            'Decided to postpone feature X to next quarter'
          ],
          nextSteps: [
            'Schedule follow-up meeting with stakeholders',
            'Prepare detailed project proposal'
          ],
          attendees: ['John Smith', 'Sarah Johnson', 'Mike Chen'],
          topics: ['Product Roadmap', 'Sprint Planning', 'User Feedback'],
          sentiment: 'positive'
        }
      },
      {
        id: '2',
        title: 'Weekly Team Standup',
        date: '2024-01-05',
        duration: 30,
        participants: ['Alice Brown', 'Bob Wilson', 'Carol Davis'],
        status: 'transcribing',
        createdAt: '2024-01-05T09:00:00Z',
        updatedAt: '2024-01-05T09:30:00Z'
      }
    ];
    setMeetings(demoMeetings);
  }, []);

  // Simulate real-time meeting updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance to add a new demo meeting
        const newMeeting: Meeting = {
          id: Date.now().toString(),
          title: `Auto-generated Meeting ${Math.floor(Math.random() * 1000)}`,
          date: new Date().toISOString(),
          duration: Math.floor(Math.random() * 60) + 15,
          participants: ['AI Assistant', 'Demo User'],
          status: 'recording',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        addMeeting(newMeeting);
        
        // Simulate status progression
        setTimeout(() => updateMeetingStatus(newMeeting.id, 'transcribing'), 5000);
        setTimeout(() => updateMeetingStatus(newMeeting.id, 'analyzing'), 10000);
        setTimeout(() => updateMeetingStatus(newMeeting.id, 'completed'), 15000);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [addMeeting, updateMeetingStatus]);

  const handleNewMeeting = () => {
    setCurrentState('recording');
    setSelectedMeeting(null);
  };

  const handleRecordingComplete = async (audioBlob: Blob, transcript: string) => {
    setIsProcessing(true);
    
    try {
      // Create new meeting
      const newMeeting: Meeting = {
        id: Date.now().toString(),
        title: `Meeting - ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString(),
        duration: Math.floor(Math.random() * 60) + 15, // Random duration for demo
        participants: ['Current User'], // In real app, this would be detected
        status: 'analyzing',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        transcript
      };

      setMeetings(prev => [newMeeting, ...prev]);

      addMeeting(newMeeting);

      // Generate AI summary
      const summary = await aiService.generateSummary(transcript);
      
      const updatedMeeting: Meeting = {
        ...newMeeting,
        status: 'completed',
        summary,
        updatedAt: new Date().toISOString()
      };

      setMeetings(prev => prev.map(m => m.id === newMeeting.id ? updatedMeeting : m));
      updateMeetingStatus(newMeeting.id, 'completed');
      setSelectedMeeting(updatedMeeting);
      setCurrentState('summary');
    } catch (error) {
      console.error('Failed to process meeting:', error);
      alert('Failed to process the meeting. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Convert file to blob and transcribe
      const audioBlob = new Blob([file], { type: file.type });
      const transcript = await transcriptionService.transcribeAudioFile(audioBlob);
      
      await handleRecordingComplete(audioBlob, transcript);
    } catch (error) {
      console.error('Failed to process uploaded file:', error);
      alert('Failed to process the uploaded file. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleSelectMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setCurrentState('summary');
  };

  const handleBackToDashboard = () => {
    setCurrentState('dashboard');
    setSelectedMeeting(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-secondary-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(20,184,166,0.1)_0%,_transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(249,115,22,0.1)_0%,_transparent_50%)]"></div>
      </div>

      {/* Navigation */}
      {currentState !== 'dashboard' && (
        <div className="relative z-10 p-6">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      )}

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center">
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-accent-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Processing Meeting</h3>
            <p className="text-white/70">Transcribing and analyzing your meeting content...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {currentState === 'dashboard' && (
          <Dashboard
           meetings={realTimeMeetings}
            onNewMeeting={handleNewMeeting}
            onSelectMeeting={handleSelectMeeting}
          />
        )}

        {currentState === 'recording' && (
          <div className="min-h-screen flex items-center justify-center p-6">
            <RecordingInterface
              onRecordingComplete={handleRecordingComplete}
              onFileUpload={handleFileUpload}
            />
          </div>
        )}

        {currentState === 'summary' && selectedMeeting && (
          <div className="p-6">
            <MeetingSummary meeting={selectedMeeting} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-16 py-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center space-x-6 text-white/60">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mic className="w-5 h-5" />
              <span>High-Quality Transcription</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Advanced Analytics</span>
            </div>
          </div>
          <div className="text-center mt-4 text-white/40 text-sm">
            © 2024 AI Meeting Summarizer. Built with cutting-edge AI technology.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;