import { useState, useEffect, useCallback } from 'react';
import { Meeting } from '../types/meeting';

export const useRealTimeUpdates = (meetings: Meeting[]) => {
  const [realTimeMeetings, setRealTimeMeetings] = useState<Meeting[]>(meetings);

  const updateMeetingStatus = useCallback((meetingId: string, status: Meeting['status']) => {
    setRealTimeMeetings(prev => 
      prev.map(meeting => 
        meeting.id === meetingId 
          ? { ...meeting, status, updatedAt: new Date().toISOString() }
          : meeting
      )
    );
  }, []);

  const updateMeetingProgress = useCallback((meetingId: string, progress: number) => {
    setRealTimeMeetings(prev => 
      prev.map(meeting => 
        meeting.id === meetingId 
          ? { ...meeting, progress, updatedAt: new Date().toISOString() }
          : meeting
      )
    );
  }, []);

  const addMeeting = useCallback((meeting: Meeting) => {
    setRealTimeMeetings(prev => [meeting, ...prev]);
  }, []);

  useEffect(() => {
    setRealTimeMeetings(meetings);
  }, [meetings]);

  return {
    meetings: realTimeMeetings,
    updateMeetingStatus,
    updateMeetingProgress,
    addMeeting
  };
};