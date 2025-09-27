# AI-Powered Interview Assistant

A modern React application that conducts AI-powered technical interviews for Full Stack Developer positions. Built with Vite, React, Redux Toolkit, and Ant Design.

## 🚀 Features

### Core Functionality
- **Resume Upload & Parsing**: Supports PDF and DOCX formats with automatic information extraction
- **AI-Generated Questions**: 6 technical questions (2 Easy, 2 Medium, 2 Hard) covering React/Node.js
- **Timed Interviews**: 20s/60s/120s time limits based on difficulty
- **Real-time Evaluation**: AI-powered answer scoring and feedback
- **Dual Interface**: Separate views for candidates and interviewers
- **Local Persistence**: All data saved locally with session restoration
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Candidate Experience (Interviewee Tab)
- Upload resume (PDF/DOCX)
- Auto-extraction of Name, Email, Phone
- Missing field collection via chatbot
- Timed technical questions with progress tracking
- Real-time timer with visual indicators
- Answer submission with character count
- Final score and performance summary

### Interviewer Dashboard
- Complete candidate list with scores and ratings
- Search and sort functionality
- Detailed candidate profiles with question-by-question analysis
- AI-generated summaries and recommendations
- Performance statistics and analytics
- Export-ready candidate reports

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **State Management**: Redux Toolkit with Redux Persist
- **UI Library**: Ant Design 5.x
- **File Processing**: PDF.js for PDF parsing, Mammoth for DOCX
- **Styling**: CSS3 with custom animations
- **Icons**: Ant Design Icons & Lucide React
- **Date Handling**: Day.js
- **Build Tool**: Vite with optimized bundling

## 📦 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-interview-assistant

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Layout.jsx           # Main layout component
│   │   ├── Timer.jsx           # Timer component with visual feedback
│   │   └── WelcomeBackModal.jsx # Session restoration modal
│   ├── interviewee/
│   │   ├── ChatInterface.jsx   # Main candidate interface
│   │   ├── ResumeUpload.jsx   # Resume upload and parsing
│   │   ├── InterviewChat.jsx  # Interview flow management
│   │   └── QuestionCard.jsx   # Question display component
│   └── interviewer/
│       ├── Dashboard.jsx      # Main interviewer dashboard
│       ├── CandidateList.jsx  # Candidates table with sorting
│       ├── CandidateDetail.jsx # Detailed candidate view
│       └── SearchFilter.jsx   # Search and filter controls
├── store/
│   ├── index.js              # Redux store configuration
│   └── slices/
│       ├── interviewSlice.js # Interview state management
│       ├── candidateSlice.js # Candidate data management
│       └── uiSlice.js       # UI state management
├── services/
│   ├── resumeParser.js      # PDF/DOCX parsing logic
│   ├── aiService.js        # AI question generation and evaluation
│   └── storage.js          # Local storage utilities
├── utils/
│   ├── constants.js        # Application constants
│   ├── validators.js       # Input validation functions
│   └── helpers.js         # Utility functions
└── styles/
    ├── index.css          # Global styles and theme
    └── components.css     # Component-specific styles
```

## 🎯 Key Features Explained

### Resume Processing
The application uses PDF.js and Mammoth to extract text from uploaded resumes and automatically identifies:
- Candidate name (multiple detection strategies)
- Email addresses (regex-based extraction)
- Phone numbers (various format support)

### AI Interview System
- **Question Generation**: Pre-configured question bank with difficulty-based selection
- **Answer Evaluation**: Mock AI evaluation with keyword analysis and scoring
- **Performance Metrics**: Comprehensive scoring system with feedback generation

### State Management
- **Redux Toolkit**: Modern Redux with simplified syntax
- **Redux Persist**: Automatic state persistence to localStorage
- **Optimistic Updates**: Immediate UI feedback with error handling

### Timer System
- Visual countdown with