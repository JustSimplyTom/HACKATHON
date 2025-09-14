/**
 * TaskList Component
 * 
 * Comprehensive task management interface featuring:
 * - Task CRUD operations (Create, Read, Update, Delete)
 * - Advanced search with fuzzy matching
 * - Speech-to-text input for search and form fields
 * - Task filtering and sorting
 * - Form validation and error handling
 * - Responsive design
 * 
 * Key Features:
 * - Fuzzy search algorithm with Levenshtein distance
 * - Web Speech API integration
 * - Real-time task updates
 * - Local storage persistence
 * - Accessibility support
 * 
 * @param tasks - Array of all tasks
 * @param updateTasks - Callback to update tasks array
 * @param showAddForm - External form visibility state
 * @param setShowAddForm - External form visibility setter
 * 
 * @author Dang Minh Duc - RMIT University VN
 * @version 1.0.0
 */

import { useState, useMemo, useRef, useEffect } from 'react';
import type { Task, TaskFilter, TaskSort } from '../types/Task';
import { TASK_CATEGORIES } from '../types/Task';
import { filterTasks, sortTasks, isOverdue, generateId } from '../utils/storage';
import { generateSampleTasks } from '../utils/sampleData';

// Speech Recognition Types
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface TaskListProps {
  tasks: Task[];
  updateTasks: (tasks: Task[]) => void;
  showAddForm?: boolean;
  setShowAddForm?: (show: boolean) => void;
}

export default function TaskList({ tasks, updateTasks, showAddForm: externalShowAddForm, setShowAddForm: externalSetShowAddForm }: TaskListProps) {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [sort, setSort] = useState<TaskSort>('deadline');
  const [searchTerm, setSearchTerm] = useState('');
  const [internalShowAddForm, setInternalShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  // Simple speech-to-text state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Speech-to-text state for form fields
  const [isListeningTitle, setIsListeningTitle] = useState(false);
  const [isListeningDescription, setIsListeningDescription] = useState(false);
  const titleRecognitionRef = useRef<SpeechRecognition | null>(null);
  const descriptionRecognitionRef = useRef<SpeechRecognition | null>(null);

  // Use external form state if provided, otherwise use internal state
  const showAddForm = externalShowAddForm ?? internalShowAddForm;
  const setShowAddForm = externalSetShowAddForm ?? setInternalShowAddForm;

  // Format text: first word CAPITAL, last word ends with '.'
  const formatText = (text: string): string => {
    if (!text.trim()) return text;
    
    let formatted = text.trim();
    
    // Capitalize first word
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    
    // Add period at the end if it doesn't end with punctuation
    if (!/[.!?]$/.test(formatted)) {
      formatted += '.';
    }
    
    return formatted;
  };

  // Fuzzy search function for better task matching
  const fuzzySearch = (searchTerm: string, taskText: string): boolean => {
    if (!searchTerm.trim()) return true;
    
    const search = searchTerm.toLowerCase().trim();
    const text = taskText.toLowerCase();
    
    // Remove punctuation from both search term and text
    const cleanSearch = search.replace(/[^\w\s]/g, '');
    const cleanText = text.replace(/[^\w\s]/g, '');
    
    // Split into words
    const searchWords = cleanSearch.split(/\s+/).filter(word => word.length > 0);
    const textWords = cleanText.split(/\s+/).filter(word => word.length > 0);
    
    // Check if all search words are found in the text (with fuzzy matching)
    return searchWords.every(searchWord => 
      textWords.some(textWord => {
        // Exact match
        if (textWord === searchWord) return true;
        
        // Starts with match
        if (textWord.startsWith(searchWord)) return true;
        
        // Contains match (for longer words)
        if (searchWord.length > 2 && textWord.includes(searchWord)) return true;
        
        // Fuzzy match for similar words (Levenshtein distance)
        if (searchWord.length > 3 && textWord.length > 3) {
          const distance = levenshteinDistance(searchWord, textWord);
          const maxDistance = Math.floor(Math.min(searchWord.length, textWord.length) / 3);
          return distance <= maxDistance;
        }
        
        return false;
      })
    );
  };

  // Levenshtein distance function for fuzzy matching
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      // Initialize search recognition
      recognitionRef.current = new SpeechRecognition();
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          const formattedText = formatText(transcript);
          setSearchTerm(formattedText);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.log('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      // Initialize title recognition
      titleRecognitionRef.current = new SpeechRecognition();
      if (titleRecognitionRef.current) {
        titleRecognitionRef.current.continuous = false;
        titleRecognitionRef.current.interimResults = false;
        titleRecognitionRef.current.lang = 'en-US';

        titleRecognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          const formattedText = formatText(transcript);
          setFormData(prev => ({ ...prev, title: formattedText }));
          setIsListeningTitle(false);
        };

        titleRecognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.log('Title speech recognition error:', event.error);
          setIsListeningTitle(false);
        };

        titleRecognitionRef.current.onend = () => {
          setIsListeningTitle(false);
        };
      }

      // Initialize description recognition
      descriptionRecognitionRef.current = new SpeechRecognition();
      if (descriptionRecognitionRef.current) {
        descriptionRecognitionRef.current.continuous = false;
        descriptionRecognitionRef.current.interimResults = false;
        descriptionRecognitionRef.current.lang = 'en-US';

        descriptionRecognitionRef.current.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          const formattedText = formatText(transcript);
          setFormData(prev => ({ ...prev, description: formattedText }));
          setIsListeningDescription(false);
        };

        descriptionRecognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.log('Description speech recognition error:', event.error);
          setIsListeningDescription(false);
        };

        descriptionRecognitionRef.current.onend = () => {
          setIsListeningDescription(false);
        };
      }
    }
  }, []);

  // Start/stop speech recognition
  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Toggle speech recognition for title field
  const toggleTitleSpeechRecognition = () => {
    if (!titleRecognitionRef.current) return;
    
    if (isListeningTitle) {
      titleRecognitionRef.current.stop();
      setIsListeningTitle(false);
    } else {
      titleRecognitionRef.current.start();
      setIsListeningTitle(true);
    }
  };

  // Toggle speech recognition for description field
  const toggleDescriptionSpeechRecognition = () => {
    if (!descriptionRecognitionRef.current) return;
    
    if (isListeningDescription) {
      descriptionRecognitionRef.current.stop();
      setIsListeningDescription(false);
    } else {
      descriptionRecognitionRef.current.start();
      setIsListeningDescription(true);
    }
  };

  // Form state for adding/editing tasks
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedTime: ''
  });

  // Filter, sort, and search tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = filterTasks(tasks, filter);
    
    // Apply fuzzy search filter
    if (searchTerm) {
      filtered = filtered.filter(task => 
        fuzzySearch(searchTerm, task.title) ||
        fuzzySearch(searchTerm, task.description)
      );
    }
    
    return sortTasks(filtered, sort);
  }, [tasks, filter, sort, searchTerm]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission (add or edit task)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.deadline) return;

    const now = new Date().toISOString();
    
    if (editingTask) {
      // Update existing task
      const updatedTasks = tasks.map(task =>
        task.id === editingTask.id
          ? {
              ...task,
              title: formData.title.trim(),
              description: formData.description.trim(),
              deadline: formData.deadline,
              category: formData.category || undefined,
              priority: formData.priority,
              estimatedTime: formData.estimatedTime ? parseFloat(formData.estimatedTime) : undefined
            }
          : task
      );
      updateTasks(updatedTasks);
      setEditingTask(null);
    } else {
      // Add new task
      const newTask: Task = {
        id: generateId(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        deadline: formData.deadline,
        completed: false,
        createdAt: now,
        category: formData.category || undefined,
        priority: formData.priority,
        estimatedTime: formData.estimatedTime ? parseFloat(formData.estimatedTime) : undefined
      };
      updateTasks([...tasks, newTask]);
    }

    // Reset form
    setFormData({ 
      title: '', 
      description: '', 
      deadline: '', 
      category: '', 
      priority: 'medium', 
      estimatedTime: '' 
    });
    setShowAddForm(false);
  };

  // Handle task completion toggle
  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : undefined
        };
      }
      return task;
    });
    updateTasks(updatedTasks);
  };

  // Handle task deletion
  const deleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      updateTasks(updatedTasks);
    }
  };

  // Handle edit task
  const editTask = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      deadline: task.deadline.split('T')[0], // Convert to date input format
      category: task.category || '',
      priority: task.priority || 'medium',
      estimatedTime: task.estimatedTime?.toString() || ''
    });
    setShowAddForm(true);
  };

  // Get deadline color class
  const getDeadlineColor = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'deadline-overdue'; // Overdue
    if (diffDays === 0) return 'deadline-today'; // Due today
    if (diffDays <= 2) return 'deadline-soon'; // Due soon
    return 'deadline-future'; // Future
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors = {
      'Group Project': 'category-blue',
      'Exam': 'category-red',
      'Work Shift': 'category-green',
      'Assignment': 'category-purple',
      'Study': 'category-orange',
      'Personal': 'category-gray',
      'Meeting': 'category-indigo',
      'Deadline': 'category-pink'
    };
    return colors[category as keyof typeof colors] || 'category-gray';
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  // Cancel form
  const cancelForm = () => {
    setShowAddForm(false);
    setEditingTask(null);
    setFormData({ 
      title: '', 
      description: '', 
      deadline: '', 
      category: '', 
      priority: 'medium', 
      estimatedTime: '' 
    });
  };

  // Reset with sample data
  const resetWithSampleData = () => {
    if (window.confirm('This will replace all existing tasks with sample data. Are you sure?')) {
      const sampleTasks = generateSampleTasks();
      updateTasks(sampleTasks);
    }
  };

  // Clear all tasks
  const clearAllTasks = () => {
    if (window.confirm('This will delete all tasks. Are you sure?')) {
      updateTasks([]);
    }
  };

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>Task Management</h2>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={resetWithSampleData}
            title="Reset with sample data (25 tasks)"
          >
            🔄 Sample Data
          </button>
          {tasks.length > 0 && (
            <button 
              className="btn btn-secondary"
              onClick={clearAllTasks}
              title="Clear all tasks"
            >
              🗑️ Clear All
            </button>
          )}
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            + Add New Task
          </button>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="quick-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Tasks
        </button>
        <button 
          className={`filter-btn ${filter === 'today' ? 'active' : ''}`}
          onClick={() => setFilter('today')}
        >
          Today
        </button>
        <button 
          className={`filter-btn ${filter === 'thisWeek' ? 'active' : ''}`}
          onClick={() => setFilter('thisWeek')}
        >
          This Week
        </button>
        <button 
          className={`filter-btn ${filter === 'overdue' ? 'active' : ''}`}
          onClick={() => setFilter('overdue')}
        >
          Overdue
        </button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {speechSupported && (
            <button
              onClick={toggleSpeechRecognition}
              className={`speech-button ${isListening ? 'listening' : ''}`}
              title={isListening ? 'Stop listening' : 'Start voice search'}
            >
              {isListening ? '🔴' : '🎤'}
            </button>
          )}
        </div>
        
        <div className="filter-controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as TaskFilter)}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value as TaskSort)}
            className="sort-select"
          >
            <option value="deadline">Sort by Deadline</option>
            <option value="created">Sort by Created</option>
            <option value="title">Sort by Title</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Task Form */}
      {showAddForm && (
        <div className="task-form-overlay">
          <div className="task-form">
            <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
                <div className="form-input-container">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={toggleTitleSpeechRecognition}
                      className={`speech-button ${isListeningTitle ? 'listening' : ''}`}
                      title={isListeningTitle ? 'Stop listening' : 'Start voice input for title'}
                    >
                      {isListeningTitle ? '🔴' : '🎤'}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <div className="form-textarea-container">
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="form-textarea"
                  />
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={toggleDescriptionSpeechRecognition}
                      className={`speech-button ${isListeningDescription ? 'listening' : ''}`}
                      title={isListeningDescription ? 'Stop listening' : 'Start voice input for description'}
                    >
                      {isListeningDescription ? '🔴' : '🎤'}
                    </button>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="deadline">Deadline *</label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="form-input"
                  >
                    <option value="">Select category</option>
                    {TASK_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="form-input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="estimatedTime">Estimated Time (hours)</label>
                <input
                  type="number"
                  id="estimatedTime"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  placeholder="e.g., 2.5"
                  className="form-input"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
                <button type="button" onClick={cancelForm} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task List */}
      <div className="task-list">
        {filteredAndSortedTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. {searchTerm ? 'Try adjusting your search.' : 'Add a new task to get started!'}</p>
          </div>
        ) : (
          filteredAndSortedTasks.map(task => (
            <div 
              key={task.id} 
              className={`task-card ${task.completed ? 'completed' : ''} ${isOverdue(task) ? 'overdue' : ''}`}
            >
              <div className="task-card-header">
                <div className="task-title-section">
                  <h4 className="task-title">{task.title}</h4>
                  <div className="task-badges">
                    {task.category && (
                      <span className={`category-badge ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                    )}
                    {task.priority && (
                      <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="task-actions">
                  <button 
                    onClick={() => editTask(task)}
                    className="btn-icon"
                    title="Edit task"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="btn-icon delete"
                    title="Delete task"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              
              <div className="task-card-footer">
                <div className="task-meta">
                  <div className="task-status">
                    <span 
                      className={`status-indicator ${task.completed ? 'completed' : 'pending'}`}
                      onClick={() => toggleTaskCompletion(task.id)}
                      title={task.completed ? 'Mark as pending' : 'Mark as completed'}
                    >
                      {task.completed ? '✓' : '✗'}
                    </span>
                    <span className="status-text">
                      {task.completed ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className={`deadline-info ${getDeadlineColor(task.deadline)}`}>
                    <span className="deadline-icon">📅</span>
                    <span className="deadline-text">
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                    {isOverdue(task) && !task.completed && (
                      <span className="overdue-badge">OVERDUE</span>
                    )}
                  </div>
                  
                  {task.estimatedTime && (
                    <div className="estimated-time">
                      <span className="time-icon">⏱️</span>
                      <span className="time-text">{task.estimatedTime}h</span>
                    </div>
                  )}
                </div>
                
                <div className="task-progress">
                  {task.estimatedTime && (
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: task.completed ? '100%' : '0%' }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
              
            </div>
          ))
        )}
      </div>

      {/* Task Count */}
      <div className="task-count">
        Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
      </div>
    </div>
  );
}
