# 📋 Task Manager - Smart Productivity App

A modern, feature-rich task management application built with React and TypeScript, designed to help students and professionals organize their tasks efficiently with intelligent features and a beautiful user interface.

![Task Manager Preview](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue) ![Vite](https://img.shields.io/badge/Vite-4.4.0-purple) ![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/task-manager.git

# Navigate to project directory
cd task-manager

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:5173`

## 🔗 Live Demo
[Deploy your app and add the link here]

## 🎥 Demo Video
[Add your 2-minute demo video link here - set to Unlisted on YouTube]

## 💻 Project Overview

### 🎯 What is Task Manager?
Task Manager is a comprehensive productivity application that combines traditional task management with modern features like voice input, intelligent search, and visual analytics. It's designed specifically for students and professionals who need to manage multiple tasks, deadlines, and projects efficiently.

### ✨ Key Features

#### 📝 Core Task Management
- **Add, Edit, Delete Tasks**: Full CRUD operations with intuitive interface
- **Task Categories**: Organize tasks by type (exam, homework, project, personal)
- **Priority Levels**: Set high, medium, low priorities with visual indicators
- **Due Dates**: Smart date picker with natural language support
- **Task Status**: Track pending, in-progress, and completed tasks

#### 🎤 Voice Input Integration
- **Speech-to-Text**: Add tasks using voice commands in search and form fields
- **Smart Formatting**: Automatically capitalizes first word and adds periods
- **Real-time Feedback**: Visual indicators for listening status
- **Cross-browser Support**: Works on modern browsers with Web Speech API

#### 🔍 Intelligent Search
- **Fuzzy Search**: Find tasks even with typos or partial matches
- **Real-time Filtering**: Instant results as you type
- **Multi-field Search**: Search across titles, descriptions, and categories
- **Voice Search**: Use speech-to-text for hands-free searching

#### 📅 Advanced Calendar View
- **Custom Calendar**: Built from scratch for optimal performance
- **Visual Indicators**: Color-coded dots for overdue, pending, and completed tasks
- **Month Navigation**: Easy month/year selection with dropdowns
- **Previous/Next Month Days**: See context from adjacent months
- **Task Counts**: Quick overview of tasks per day

#### 📊 Analytics Dashboard
- **Progress Tracking**: Visual charts showing completion rates
- **Category Breakdown**: Pie charts for task distribution
- **Time-based Analytics**: Daily, weekly, and monthly insights
- **Performance Metrics**: Completion rates and productivity trends

#### 🎨 Modern UI/UX
- **Dark/Light Theme**: Automatic system detection with manual toggle
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: Polished transitions and micro-interactions
- **Accessibility**: Keyboard navigation and screen reader support

### 🚀 Unique Features

#### 🧠 Smart Task Parsing
- **Natural Language Processing**: Understands phrases like "tomorrow at 5pm"
- **Context Awareness**: Automatically categorizes tasks based on keywords
- **Date Intelligence**: Parses relative dates (today, tomorrow, next week)

#### 🎯 Productivity Insights
- **Completion Analytics**: Track your productivity patterns
- **Category Performance**: See which types of tasks you complete most
- **Time-based Trends**: Identify your most productive hours/days

#### 🔄 Seamless Data Management
- **Local Storage**: All data persists locally for privacy
- **Export/Import**: Backup and restore your tasks
- **Sample Data**: Quick start with pre-populated examples

## 🛠 Technology Stack

### Frontend
- **React 18.2.0**: Modern React with hooks and functional components
- **TypeScript 5.0.0**: Type-safe development with excellent IDE support
- **Vite 4.4.0**: Lightning-fast build tool and development server
- **CSS3**: Custom styling with CSS variables for theming

### APIs & Services
- **Web Speech API**: Browser-native speech recognition
- **Local Storage API**: Client-side data persistence
- **Chrono-node**: Natural language date parsing

### Development Tools
- **ESLint**: Code quality and consistency
- **TypeScript Compiler**: Static type checking
- **Vite Dev Server**: Hot module replacement for fast development

## 🏗 Architecture & Data Structure

### Component Architecture
```
src/
├── components/          # Reusable UI components
│   ├── Dashboard.tsx    # Main dashboard with overview
│   ├── TaskList.tsx     # Task management interface
│   ├── CalendarView.tsx # Custom calendar component
│   └── AnalyticsView.tsx # Data visualization
├── contexts/            # React context providers
│   └── ThemeContext.tsx # Theme management
├── types/               # TypeScript type definitions
│   └── Task.ts          # Task data structure
├── utils/               # Utility functions
│   ├── storage.ts       # Local storage helpers
│   └── sampleData.ts    # Sample data generation
└── assets/              # Static assets (SVGs, images)
```

### Data Structure
```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  category: 'exam' | 'homework' | 'project' | 'personal';
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}
```

### State Management
- **React Context**: Global theme and task state management
- **Local State**: Component-level state with useState and useReducer
- **Local Storage**: Persistent data storage with automatic sync

## 🧠 Future Enhancements

### If I Had More Time, I Would Add:

#### 🤖 AI-Powered Features
- **Smart Task Suggestions**: AI recommendations based on patterns
- **Automatic Categorization**: ML-based task classification
- **Deadline Predictions**: AI estimates for task completion time
- **Productivity Coaching**: Personalized tips and insights

#### 🔗 Integration Capabilities
- **Calendar Sync**: Google Calendar, Outlook integration
- **Email Integration**: Create tasks from email threads
- **Cloud Storage**: Sync across devices with cloud backup
- **Team Collaboration**: Share tasks and projects with others

#### 📱 Mobile Experience
- **Progressive Web App**: Offline functionality and app-like experience
- **Push Notifications**: Reminders and deadline alerts
- **Mobile Gestures**: Swipe actions for quick task management
- **Widget Support**: Home screen widgets for quick access

#### 📊 Advanced Analytics
- **Time Tracking**: Built-in timer for task duration
- **Productivity Scoring**: AI-based productivity metrics
- **Goal Setting**: Long-term objectives with progress tracking
- **Habit Formation**: Daily/weekly habit tracking

### AI Integration Possibilities

#### 🧠 Intelligent Task Management
- **Natural Language Processing**: "Schedule a meeting with John next Tuesday"
- **Smart Prioritization**: AI suggests task order based on deadlines and importance
- **Contextual Reminders**: AI-powered notifications based on location and time
- **Task Decomposition**: Break complex tasks into smaller, manageable steps

#### 📈 Predictive Analytics
- **Completion Time Estimation**: ML models predict how long tasks will take
- **Deadline Risk Assessment**: Early warning system for at-risk deadlines
- **Productivity Optimization**: AI suggests optimal work schedules
- **Burnout Prevention**: Monitor workload and suggest breaks

#### 🎯 Personalized Experience
- **Learning User Patterns**: Adapt interface based on usage habits
- **Custom Recommendations**: Personalized productivity tips
- **Adaptive UI**: Interface changes based on user preferences
- **Smart Defaults**: AI-powered form pre-filling

## 🎯 Project Goals Achieved

- ✅ **Clean Architecture**: Well-organized, maintainable codebase
- ✅ **Type Safety**: Full TypeScript implementation
- ✅ **Modern UI**: Responsive, accessible, and beautiful interface
- ✅ **Voice Integration**: Speech-to-text functionality
- ✅ **Smart Search**: Fuzzy search with real-time results
- ✅ **Data Visualization**: Comprehensive analytics dashboard
- ✅ **Theme Support**: Dark/light mode with system detection
- ✅ **Performance**: Optimized with Vite and efficient React patterns

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Dang Minh Duc - RMIT University VN**

---

⭐ If you found this project helpful, please give it a star!  
