import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Calendar, Clock, Users, MoreVertical } from 'lucide-react';
import { Meeting } from '../types/meeting';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';

interface DashboardProps {
  meetings: Meeting[];
  onNewMeeting: () => void;
  onSelectMeeting: (meeting: Meeting) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  meetings,
  onNewMeeting,
  onSelectMeeting
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { meetings: realTimeMeetings, updateMeetingStatus } = useRealTimeUpdates(meetings);
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>(realTimeMeetings);

  useEffect(() => {
    let filtered = realTimeMeetings;

    if (searchTerm) {
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(meeting => meeting.status === statusFilter);
    }

    setFilteredMeetings(filtered);
  }, [realTimeMeetings, searchTerm, statusFilter]);

  // Simulate real-time status updates
  useEffect(() => {
    const interval = setInterval(() => {
      const inProgressMeetings = realTimeMeetings.filter(m => 
        ['recording', 'transcribing', 'analyzing'].includes(m.status)
      );
      
      inProgressMeetings.forEach(meeting => {
        if (Math.random() > 0.7) { // 30% chance to update status
          const statusProgression = {
            'recording': 'transcribing',
            'transcribing': 'analyzing', 
            'analyzing': 'completed'
          };
          const nextStatus = statusProgression[meeting.status as keyof typeof statusProgression];
          if (nextStatus) {
            updateMeetingStatus(meeting.id, nextStatus as Meeting['status']);
          }
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [realTimeMeetings, updateMeetingStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recording': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'transcribing': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'analyzing': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const stats = {
    total: realTimeMeetings.length,
    completed: realTimeMeetings.filter(m => m.status === 'completed').length,
    inProgress: realTimeMeetings.filter(m => ['recording', 'transcribing', 'analyzing'].includes(m.status)).length,
    totalDuration: realTimeMeetings.reduce((acc, m) => acc + m.duration, 0)
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Meeting Dashboard</h1>
          <p className="text-white/70">Manage and analyze your recorded meetings</p>
        </div>
        <button
          onClick={onNewMeeting}
          className="bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Meeting</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Meetings</p>
              <p className="text-white text-2xl font-bold">{stats.total}</p>
            </div>
            <Calendar className="w-8 h-8 text-primary-400" />
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Completed</p>
              <p className="text-white text-2xl font-bold">{stats.completed}</p>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">In Progress</p>
              <p className="text-white text-2xl font-bold">{stats.inProgress}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Hours</p>
              <p className="text-white text-2xl font-bold">{Math.round(stats.totalDuration / 60)}</p>
            </div>
            <Clock className="w-8 h-8 text-secondary-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white/5 border border-white/20 rounded-lg pl-10 pr-8 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="recording">Recording</option>
              <option value="transcribing">Transcribing</option>
              <option value="analyzing">Analyzing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMeetings.map((meeting) => (
          <div
            key={meeting.id}
            onClick={() => onSelectMeeting(meeting)}
            className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-xl"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-white font-semibold text-lg line-clamp-2">{meeting.title}</h3>
              <button className="text-white/40 hover:text-white/70 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-4 mb-4 text-sm text-white/60">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(meeting.date)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {meeting.duration}m
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {meeting.participants.length}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(meeting.status)}`}>
                {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                {['recording', 'transcribing', 'analyzing'].includes(meeting.status) && (
                  <span className="ml-1 inline-block w-2 h-2 bg-current rounded-full animate-pulse" />
                )}
              </span>
              
              {meeting.summary && (
                <div className="text-xs text-white/60">
                  {meeting.summary.actionItems.length} action items
                </div>
              )}
            </div>

            {meeting.participants.length > 0 && (
              <div className="flex items-center mt-4 space-x-2">
                <div className="flex -space-x-2">
                  {meeting.participants.slice(0, 3).map((participant, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white/20"
                    >
                      {participant.charAt(0)}
                    </div>
                  ))}
                  {meeting.participants.length > 3 && (
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white/20">
                      +{meeting.participants.length - 3}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMeetings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">No meetings found</h3>
          <p className="text-white/60 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Start by recording your first meeting'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={onNewMeeting}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
            >
              Record New Meeting
            </button>
          )}
        </div>
      )}
    </div>
  );
};