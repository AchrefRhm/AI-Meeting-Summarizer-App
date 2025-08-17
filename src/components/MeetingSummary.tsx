import React from 'react';
import { Clock, Users, CheckSquare, AlertCircle, TrendingUp, Download } from 'lucide-react';
import { Meeting } from '../types/meeting';
import { exportService } from '../services/exportService';

interface MeetingSummaryProps {
  meeting: Meeting;
  onEditActionItem?: (itemId: string) => void;
}

export const MeetingSummary: React.FC<MeetingSummaryProps> = ({ meeting, onEditActionItem }) => {
  const { summary } = meeting;

  if (!summary) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">No Summary Available</h3>
          <p className="text-white/70">The meeting summary is being processed or is not yet available.</p>
        </div>
      </div>
    );
  }

  const handleExport = async (format: 'pdf' | 'word' | 'json') => {
    try {
      switch (format) {
        case 'pdf':
          await exportService.exportToPDF(meeting);
          break;
        case 'word':
          await exportService.exportToWord(meeting);
          break;
        case 'json':
          await exportService.exportToJSON(meeting);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-200 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-200 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-500/30';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{meeting.title}</h1>
            <div className="flex items-center space-x-6 text-white/70">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {new Date(meeting.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {summary.attendees.length} attendees
              </div>
              <div className="flex items-center">
                <TrendingUp className={`w-4 h-4 mr-2 ${getSentimentColor(summary.sentiment)}`} />
                <span className={getSentimentColor(summary.sentiment)}>
                  {summary.sentiment.charAt(0).toUpperCase() + summary.sentiment.slice(1)} sentiment
                </span>
              </div>
            </div>
          </div>
          
          {/* Export Options */}
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('pdf')}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => handleExport('word')}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Word</span>
            </button>
            <button
              onClick={() => handleExport('json')}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>JSON</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Points */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-primary-400 rounded-full mr-3"></div>
            Key Points
          </h2>
          <div className="space-y-3">
            {summary.keyPoints.map((point, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-500/20 rounded-full flex items-center justify-center text-primary-300 text-xs font-semibold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-white/90 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <CheckSquare className="w-5 h-5 text-accent-400 mr-3" />
            Action Items
          </h2>
          <div className="space-y-3">
            {summary.actionItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => onEditActionItem?.(item.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-medium text-sm">{item.task}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>{item.assignee}</span>
                  {item.deadline && (
                    <span>Due: {new Date(item.deadline).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decisions */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <div className="w-2 h-2 bg-secondary-400 rounded-full mr-3"></div>
            Decisions Made
          </h2>
          <div className="space-y-3">
            {summary.decisions.map((decision, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-secondary-500/20 rounded-full flex items-center justify-center text-secondary-300 text-xs font-semibold mt-0.5">
                  ✓
                </div>
                <p className="text-white/90 text-sm leading-relaxed">{decision}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-accent-400 mr-3" />
            Next Steps
          </h2>
          <div className="space-y-3">
            {summary.nextSteps.map((step, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-accent-500/20 rounded-full flex items-center justify-center text-accent-300 text-xs font-semibold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-white/90 text-sm leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topics & Attendees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Topics Discussed</h3>
          <div className="flex flex-wrap gap-2">
            {summary.topics.map((topic, index) => (
              <span
                key={index}
                className="bg-primary-500/20 text-primary-200 px-3 py-1 rounded-full text-sm border border-primary-500/30"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Attendees</h3>
          <div className="space-y-2">
            {summary.attendees.map((attendee, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {attendee.charAt(0)}
                </div>
                <span className="text-white/90">{attendee}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};