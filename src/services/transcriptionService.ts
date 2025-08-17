import { TranscriptionSegment } from '../types/meeting';

export class TranscriptionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;

  constructor() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.setupRecognition();
    }
  }

  private setupRecognition(): void {
    if (!this.recognition) return;

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
  }

  startRealTimeTranscription(onTranscript: (segment: TranscriptionSegment) => void): void {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    if (this.isListening) {
      return;
    }

    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const segment: TranscriptionSegment = {
            speaker: 'Speaker',
            text: result[0].transcript,
            timestamp: Date.now(),
            confidence: result[0].confidence || 0.8
          };
          onTranscript(segment);
        }
      }
    };

    this.recognition.start();
    this.isListening = true;
  }

  stopRealTimeTranscription(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  async transcribeAudioFile(audioBlob: Blob): Promise<string> {
    // In a real app, you would send this to OpenAI Whisper API or similar
    // For now, we'll simulate the transcription
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`This is a simulated transcription of the audio file. 
        In a production environment, this would be processed by OpenAI Whisper API 
        or similar transcription service. The actual implementation would:
        1. Convert the audio blob to the required format
        2. Send it to the transcription API
        3. Return the transcribed text with timestamps and speaker identification`);
      }, 3000);
    });
  }

  async transcribeWithWhisper(audioBlob: Blob, apiKey: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');

    try {
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const result = await response.json();
      return result.text;
    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw error;
    }
  }
}

export const transcriptionService = new TranscriptionService();