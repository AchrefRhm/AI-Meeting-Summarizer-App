# AI Meeting Summarizer 🎯

> Transform your meetings into actionable insights with the power of AI

![AI Meeting Summarizer](https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

*Developed by **Achref Rhouma** - A comprehensive solution for intelligent meeting management*

## 🚀 Overview

AI Meeting Summarizer is a production-ready application that revolutionizes how you handle meetings. Record audio, get instant transcriptions, and receive AI-powered summaries with actionable items - all in a beautiful, modern interface.

### ✨ Key Features

- **🎤 Smart Recording**: Real-time audio recording with live transcription
- **📁 File Upload**: Support for multiple audio formats (MP3, WAV, M4A, WebM)
- **🤖 AI Analysis**: Powered by OpenAI GPT-4 for intelligent summarization
- **📋 Action Items**: Automatic extraction of tasks with assignees and priorities
- **📊 Dashboard**: Comprehensive meeting management with search and filters
- **📤 Export Options**: PDF, Word, and JSON export formats
- **🔗 Integration Ready**: Built for Zoom, Google Meet, and MS Teams integration
- **📱 Responsive Design**: Beautiful UI that works across all devices

![Dashboard Screenshot](https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons

**Backend Services:**
- Supabase for database and authentication
- OpenAI API for transcription (Whisper) and summarization (GPT-4)
- Web Speech API for real-time transcription

**AI & ML:**
- OpenAI Whisper for speech-to-text
- GPT-4 for meeting analysis and summarization
- Custom algorithms for action item extraction

![AI Processing](https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- NPM or Yarn
- OpenAI API key (for production features)
- Supabase account (for data persistence)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-meeting-summarizer.git
   cd ai-meeting-summarizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys:
   ```env
   VITE_OPENAI_API_KEY=your_openai_api_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 💡 Usage Guide

### Recording Meetings

![Recording Interface](https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop)

1. **Start Recording**: Click the microphone button to begin recording
2. **Live Transcription**: Watch your speech convert to text in real-time
3. **Stop & Process**: End recording to trigger AI analysis
4. **Review Summary**: Get comprehensive meeting insights instantly

### File Upload

- Drag and drop audio files directly onto the interface
- Supports multiple formats: MP3, WAV, M4A, WebM
- Automatic transcription and analysis

### Managing Meetings

![Meeting Dashboard](https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop)

- **Dashboard Overview**: View all meetings with status indicators
- **Search & Filter**: Find meetings by title, participants, or status
- **Export Options**: Download summaries in PDF, Word, or JSON format
- **Action Items**: Track tasks and assignments across meetings

## 🔧 Configuration

### OpenAI Integration

```typescript
// services/aiService.ts
const aiService = new AIService(process.env.VITE_OPENAI_API_KEY);

// Custom prompts for different meeting types
const MEETING_PROMPTS = {
  standup: "Focus on progress updates, blockers, and next steps...",
  planning: "Emphasize decisions made, timelines, and resource allocation...",
  review: "Highlight feedback, action items, and follow-up tasks..."
};
```

### Supabase Schema

```sql
-- meetings table
create table meetings (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  date timestamptz not null,
  duration integer not null,
  participants text[] not null,
  status text not null,
  transcript text,
  summary jsonb,
  audio_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table meetings enable row level security;

-- Policy for authenticated users
create policy "Users can manage their meetings" on meetings
  for all using (auth.uid()::text = user_id);
```

## 🌐 Platform Integrations

### Zoom Integration

```typescript
// Zoom SDK integration example
import { ZoomMtg } from '@zoomus/websdk';

export class ZoomIntegration {
  async joinMeeting(meetingId: string, password: string) {
    ZoomMtg.init({
      leaveUrl: 'https://your-app.com/dashboard',
      success: () => {
        this.startRecording();
      }
    });
  }

  private startRecording() {
    // Integrate with our recording service
    audioService.startRecording();
  }
}
```

### Google Meet Integration

```typescript
// Chrome extension manifest for Google Meet
{
  "name": "AI Meeting Summarizer",
  "permissions": ["activeTab", "storage"],
  "content_scripts": [{
    "matches": ["https://meet.google.com/*"],
    "js": ["content.js"]
  }]
}
```

### Microsoft Teams Integration

```typescript
// Teams app integration
import { app, meeting } from "@microsoft/teams-js";

export class TeamsIntegration {
  async initializeTeamsApp() {
    await app.initialize();
    
    meeting.registerSpeakingStateChangeHandler((speakingState) => {
      if (speakingState.isSpeaking) {
        // Start transcription when speaking is detected
        this.handleSpeechDetection();
      }
    });
  }
}
```

## 📈 Monetization Strategies

### 1. Freemium Model
- **Free Tier**: 3 meetings/month, basic summaries
- **Pro Tier ($19/month)**: Unlimited meetings, advanced AI features
- **Enterprise ($99/month)**: Team management, integrations, custom branding

### 2. Usage-Based Pricing
- **Pay-per-Meeting**: $2 per meeting analysis
- **Transcription Credits**: $0.10 per minute of audio
- **API Access**: $0.05 per API call for developers

### 3. Enterprise Solutions
- **White-label**: Custom branding and deployment
- **On-premise**: Private cloud deployment
- **Custom Integration**: Tailored platform integrations

### 4. Add-on Services
- **Professional Summaries**: Human-reviewed summaries (+$5)
- **Multi-language Support**: Additional languages (+$10/month)
- **Advanced Analytics**: Meeting insights and trends (+$15/month)

## 🚀 Deployment Options

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Netlify

```bash
# Build for production
npm run build

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### AWS Amplify

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize and deploy
amplify init
amplify add hosting
amplify publish
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🛠️ Development

### Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── RecordingInterface.tsx
│   └── MeetingSummary.tsx
├── services/           # Business logic
│   ├── audioService.ts # Recording functionality
│   ├── aiService.ts    # OpenAI integration
│   └── exportService.ts
├── types/              # TypeScript definitions
└── hooks/              # Custom React hooks
```

### Development Scripts

```bash
# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- 📧 Email: support@aimeetingsummarizer.com
- 💬 Discord: [Join our community](https://discord.gg/aimeetingsummarizer)
- 📖 Documentation: [docs.aimeetingsummarizer.com](https://docs.aimeetingsummarizer.com)

## 🏆 Credits

**Created by Achref Rhouma** - Full-Stack Developer & AI Enthusiast

- 🌐 Portfolio: [achrefrhouma.dev](https://achrefrhouma.dev)
- 📧 Contact: achref.rhouma@example.com
- 💼 LinkedIn: [linkedin.com/in/achrefrhouma](https://linkedin.com/in/achrefrhouma)

---

⭐ **Star this project if you found it helpful!**

![Footer](https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=300&fit=crop)