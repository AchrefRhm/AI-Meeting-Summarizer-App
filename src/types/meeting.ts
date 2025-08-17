export interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: number;
  participants: string[];
  status: 'recording' | 'transcribing' | 'analyzing' | 'completed';
  audioUrl?: string;
  transcript?: string;
  summary?: MeetingSummary;
  createdAt: string;
  updatedAt: string;
  progress?: number;
}

export interface MeetingSummary {
  keyPoints: string[];
  actionItems: ActionItem[];
  decisions: string[];
  nextSteps: string[];
  attendees: string[];
  topics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
}

export interface TranscriptionSegment {
  speaker: string;
  text: string;
  timestamp: number;
  confidence: number;
}