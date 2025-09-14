/**
 * Main Application Component
 * 
 * This is the root component of the Task Manager application.
 * It handles:
 * - Global state management for tasks
 * - Theme context provider
 * - Routing between different views (Dashboard, Tasks, Calendar, Analytics)
 * - Task CRUD operations
 * - Local storage persistence
 * 
 * @author Dang Minh Duc - RMIT University VN
 * @version 1.0.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import type { Task } from './types/Task';
import { loadTasks, saveTasks } from './utils/storage';
import { initializeSampleData } from './utils/sampleData';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import AnalyticsView from './components/AnalyticsView';

/**
 * Navigation Component
 * 
 * Provides the main navigation bar with:
 * - Route-based navigation links
 * - Active state highlighting
 * - Theme toggle functionality
 * - Responsive design
 */
function Navigation() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <h1>Task Manager</h1>
      </div>
      <div className="nav-links">
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
        >
          <span className="nav-icon">🏠</span>
          Dashboard
        </Link>
        <Link 
          to="/tasks" 
          className={location.pathname === '/tasks' ? 'nav-link active' : 'nav-link'}
        >
          <span className="nav-icon">📋</span>
          Tasks
        </Link>
        <Link 
          to="/calendar" 
          className={location.pathname === '/calendar' ? 'nav-link active' : 'nav-link'}
        >
          <span className="nav-icon">📅</span>
          Calendar
        </Link>
        <Link 
          to="/analytics" 
          className={location.pathname === '/analytics' ? 'nav-link active' : 'nav-link'}
        >
          <span className="nav-icon">📊</span>
          Analytics
        </Link>
        <button 
          onClick={toggleTheme}
          className="theme-toggle"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
}

/**
 * Main App Content Component
 * 
 * Handles the core application logic:
 * - Task state management
 * - Local storage persistence
 * - Route-based rendering
 * - Form state management
 */
function AppContent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const navigate = useNavigate();

  // Load tasks from localStorage on component mount
  useEffect(() => {
    // Initialize sample data if no tasks exist
    initializeSampleData();
    const loadedTasks = loadTasks();
    setTasks(loadedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem('hackathon-tasks')) {
      saveTasks(tasks);
    }
  }, [tasks]);

  // Update tasks state
  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
  };

  // Show add task form
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="app">
      <Navigation />
      
      <main className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={<Dashboard tasks={tasks} onAddTask={() => {
              setShowAddForm(true);
              navigate('/tasks');
            }} />} 
          />
          <Route 
            path="/tasks" 
            element={<TaskList tasks={tasks} updateTasks={updateTasks} showAddForm={showAddForm} setShowAddForm={setShowAddForm} />} 
          />
          <Route 
            path="/calendar" 
            element={<CalendarView tasks={tasks} updateTasks={updateTasks} />} 
          />
          <Route 
            path="/analytics" 
            element={<AnalyticsView tasks={tasks} />} 
          />
        </Routes>
      </main>
    </div>
  );
}

/**
 * Root App Component
 * 
 * Wraps the entire application with:
 * - Theme provider context
 * - React Router for navigation
 * - Global state management
 */
function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;