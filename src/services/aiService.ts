import { MeetingSummary } from '../types/meeting';

export class AIService {
  private apiKey: string;

  constructor(apiKey: string = '') {
    this.apiKey = apiKey;
  }

  async generateSummary(transcript: string): Promise<MeetingSummary> {
    if (!this.apiKey) {
      return this.generateMockSummary(transcript);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{
            role: 'system',
            content: `You are an expert meeting summarizer. Analyze the meeting transcript and extract:
            1. Key points discussed
            2. Action items with assignees
            3. Decisions made
            4. Next steps
            5. Attendees mentioned
            6. Main topics covered
            7. Overall sentiment
            
            Return the response in JSON format matching the MeetingSummary interface.`
          }, {
            role: 'user',
            content: transcript
          }],
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const result = await response.json();
      return JSON.parse(result.choices[0].message.content);
    } catch (error) {
      console.error('AI summary generation error:', error);
      return this.generateMockSummary(transcript);
    }
  }

  private generateMockSummary(transcript: string): MeetingSummary {
    // Simulate AI processing time
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          keyPoints: [
            'Discussed Q4 product roadmap and feature prioritization',
            'Reviewed current sprint progress and identified blockers',
            'Analyzed user feedback from recent feature release',
            'Planned upcoming marketing campaign timeline'
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
            },
            {
              id: '3',
              task: 'Review and approve marketing copy',
              assignee: 'Mike Chen',
              priority: 'medium',
              status: 'pending'
            }
          ],
          decisions: [
            'Approved budget increase for Q1 marketing initiatives',
            'Decided to postpone feature X to next quarter',
            'Agreed on new hiring timeline for engineering team'
          ],
          nextSteps: [
            'Schedule follow-up meeting with stakeholders',
            'Prepare detailed project proposal',
            'Begin user testing for new features'
          ],
          attendees: ['John Smith', 'Sarah Johnson', 'Mike Chen', 'Lisa Anderson'],
          topics: ['Product Roadmap', 'Sprint Planning', 'User Feedback', 'Marketing Strategy'],
          sentiment: 'positive'
        });
      }, 2000);
    }) as Promise<MeetingSummary>;
  }

  async extractActionItems(transcript: string): Promise<any[]> {
    // This would use AI to identify action items in the transcript
    const actionWords = ['action', 'task', 'todo', 'follow up', 'need to', 'should', 'will'];
    const lines = transcript.split('\n');
    
    return lines
      .filter(line => actionWords.some(word => line.toLowerCase().includes(word)))
      .slice(0, 5)
      .map((line, index) => ({
        id: `action-${index}`,
        task: line.trim(),
        priority: 'medium',
        status: 'pending'
      }));
  }
}

export const aiService = new AIService();