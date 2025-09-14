# Task Manager - Source Code Structure

This document outlines the organized structure of the Task Manager application source code.

## 📁 Folder Structure

```
src/
├── components/          # React components
│   ├── AnalyticsView.tsx    # Analytics dashboard with charts and metrics
│   ├── CalendarView.tsx     # Interactive calendar with task indicators
│   ├── Dashboard.tsx        # Main dashboard with stats and brand assets
│   └── TaskList.tsx        # Task management with CRUD operations
├── contexts/           # React context providers
│   └── ThemeContext.tsx    # Theme management (light/dark mode)
├── types/              # TypeScript type definitions
│   └── Task.ts             # Task interfaces and type definitions
├── utils/              # Utility functions
│   ├── sampleData.ts       # Sample data generation for testing
│   └── storage.ts          # Local storage operations and task utilities
├── assets/             # Static assets
│   ├── hackathon-graphic.svg  # Hackathon branding graphic
│   ├── naver-logo.svg        # Naver company logo
│   └── react.svg             # React framework logo
├── App.tsx             # Main application component with routing
├── App.css             # Global styles and theme variables
├── main.tsx            # Application entry point
└── index.css           # Base CSS styles
```

## 🎯 Key Features

### Components
- **Dashboard**: Overview with statistics, motivational messages, and brand assets
- **TaskList**: Full CRUD operations with fuzzy search and speech-to-text
- **CalendarView**: Interactive calendar with task indicators and navigation
- **AnalyticsView**: Comprehensive analytics with charts and insights

### Utilities
- **Storage**: Local storage persistence with error handling
- **Sample Data**: Realistic test data generation
- **Theme Context**: Light/dark mode management

### Assets
- **SVG Graphics**: High-quality vector graphics for branding
- **Responsive Design**: Mobile-first approach with breakpoints

## 🚀 Technologies Used

- **React 18** with TypeScript
- **React Router** for navigation
- **Web Speech API** for voice input
- **Local Storage** for data persistence
- **CSS Custom Properties** for theming
- **Responsive Design** with CSS Grid and Flexbox

## 📝 Code Quality

- **Comprehensive Comments**: Each file includes detailed documentation
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Robust error handling throughout
- **Accessibility**: ARIA labels and keyboard navigation
- **Performance**: Optimized with React hooks and memoization

## 🔧 Development

All components are well-documented with:
- Purpose and functionality descriptions
- Parameter documentation
- Feature lists
- Author and version information

The codebase follows consistent naming conventions and maintains clean, readable code structure.
