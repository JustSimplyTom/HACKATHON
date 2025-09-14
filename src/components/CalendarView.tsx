/**
 * CalendarView Component
 * 
 * Interactive calendar interface displaying:
 * - Monthly calendar grid with task indicators
 * - Task count badges for each day
 * - Clickable date navigation
 * - Selected date task details
 * - Month/year navigation
 * - Responsive design
 * 
 * Features:
 * - Custom calendar implementation
 * - Task status indicators (overdue, pending, completed)
 * - Date selection and task filtering
 * - Month navigation with previous/next month days
 * - Visual task indicators with color coding
 * 
 * @param tasks - Array of all tasks
 * @param updateTasks - Callback to update tasks array
 * 
 * @author Dang Minh Duc - RMIT University VN
 * @version 1.0.0
 */

import { useState } from 'react';
import type { Task } from '../types/Task';
import { getTasksForDate, isOverdue } from '../utils/storage';

interface CalendarViewProps {
  tasks: Task[];
  updateTasks: (tasks: Task[]) => void;
}

export default function CalendarView({ tasks, updateTasks }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Get tasks for the selected date
  const selectedDateTasks = getTasksForDate(tasks, selectedDate);

  // Get all unique dates that have tasks (for future use)
  // const taskDates = Array.from(new Set(
  //   tasks.map(task => task.deadline.split('T')[0])
  // )).sort();

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Get previous month's last days
    const prevMonth = new Date(year, month - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    const prevMonthDaysToShow = [];
    
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const prevDate = new Date(year, month - 1, day);
      prevMonthDaysToShow.push(prevDate);
    }
    
    // Get next month's first days
    const nextMonthDaysToShow = [];
    const totalCells = 42; // 6 weeks * 7 days
    const currentCells = startingDayOfWeek + daysInMonth;
    const remainingCells = totalCells - currentCells;
    
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      nextMonthDaysToShow.push(nextDate);
    }
    
    return { 
      daysInMonth, 
      startingDayOfWeek, 
      firstDay, 
      lastDay,
      prevMonthDaysToShow,
      nextMonthDaysToShow
    };
  };

  const getPreviousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const getNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const getToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  // Month and year selection
  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(event.target.value);
    setCurrentMonth(prev => new Date(prev.getFullYear(), newMonth, 1));
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(event.target.value);
    setCurrentMonth(prev => new Date(newYear, prev.getMonth(), 1));
  };

  // Generate month and year options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return { value: i, label: date.toLocaleDateString('en-US', { month: 'long' }) };
  });

  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() - 5 + i;
    return { value: year, label: year.toString() };
  });

  // Get task counts for a specific date
  const getTaskCounts = (date: Date) => {
    const dayTasks = getTasksForDate(tasks, date);
    const completedCount = dayTasks.filter(task => task.completed).length;
    const overdueCount = dayTasks.filter(task => isOverdue(task)).length;
    const pendingCount = dayTasks.length - completedCount - overdueCount;
    
    return { completedCount, overdueCount, pendingCount, total: dayTasks.length };
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

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Render calendar
  const renderCalendar = () => {
    const { daysInMonth, prevMonthDaysToShow, nextMonthDaysToShow } = getDaysInMonth(currentMonth);
    
    const days = [];
    
    // Add previous month's days
    prevMonthDaysToShow.forEach((date, index) => {
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const taskCounts = getTaskCounts(date);
      
      days.push(
        <div
          key={`prev-${index}`}
          className={`calendar-day prev-month ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${taskCounts.total > 0 ? 'has-tasks' : ''}`}
          onClick={() => {
            setSelectedDate(date);
            setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
          }}
        >
          <div className="day-number">{date.getDate()}</div>
          {taskCounts.total > 0 && (
            <div className="task-indicators">
              {taskCounts.overdueCount > 0 && (
                <div className="indicator overdue" title={`${taskCounts.overdueCount} overdue tasks`}>
                  {taskCounts.overdueCount}
                </div>
              )}
              {taskCounts.pendingCount > 0 && (
                <div className="indicator pending" title={`${taskCounts.pendingCount} pending tasks`}>
                  {taskCounts.pendingCount}
                </div>
              )}
              {taskCounts.completedCount > 0 && (
                <div className="indicator completed" title={`${taskCounts.completedCount} completed tasks`}>
                  ✓{taskCounts.completedCount}
                </div>
              )}
            </div>
          )}
        </div>
      );
    });
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const taskCounts = getTaskCounts(date);
      
      days.push(
        <div
          key={day}
          className={`calendar-day current-month ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${taskCounts.total > 0 ? 'has-tasks' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className="day-number">{day}</div>
          {taskCounts.total > 0 && (
            <div className="task-indicators">
              {taskCounts.overdueCount > 0 && (
                <div className="indicator overdue" title={`${taskCounts.overdueCount} overdue tasks`}>
                  {taskCounts.overdueCount}
                </div>
              )}
              {taskCounts.pendingCount > 0 && (
                <div className="indicator pending" title={`${taskCounts.pendingCount} pending tasks`}>
                  {taskCounts.pendingCount}
                </div>
              )}
              {taskCounts.completedCount > 0 && (
                <div className="indicator completed" title={`${taskCounts.completedCount} completed tasks`}>
                  ✓{taskCounts.completedCount}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    
    // Add next month's days
    nextMonthDaysToShow.forEach((date, index) => {
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();
      const taskCounts = getTaskCounts(date);
      
      days.push(
        <div
          key={`next-${index}`}
          className={`calendar-day next-month ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${taskCounts.total > 0 ? 'has-tasks' : ''}`}
          onClick={() => {
            setSelectedDate(date);
            setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
          }}
        >
          <div className="day-number">{date.getDate()}</div>
          {taskCounts.total > 0 && (
            <div className="task-indicators">
              {taskCounts.overdueCount > 0 && (
                <div className="indicator overdue" title={`${taskCounts.overdueCount} overdue tasks`}>
                  {taskCounts.overdueCount}
                </div>
              )}
              {taskCounts.pendingCount > 0 && (
                <div className="indicator pending" title={`${taskCounts.pendingCount} pending tasks`}>
                  {taskCounts.pendingCount}
                </div>
              )}
              {taskCounts.completedCount > 0 && (
                <div className="indicator completed" title={`${taskCounts.completedCount} completed tasks`}>
                  ✓{taskCounts.completedCount}
                </div>
              )}
            </div>
          )}
        </div>
      );
    });
    
    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={getPreviousMonth} className="nav-button">‹</button>
          <div className="month-year-selector">
            <select 
              value={currentMonth.getMonth()} 
              onChange={handleMonthChange}
              className="month-select"
            >
              {monthOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <select 
              value={currentMonth.getFullYear()} 
              onChange={handleYearChange}
              className="year-select"
            >
              {yearOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button onClick={getNextMonth} className="nav-button">›</button>
        </div>
        
        <div className="calendar-grid">
          <div className="day-header">Sun</div>
          <div className="day-header">Mon</div>
          <div className="day-header">Tue</div>
          <div className="day-header">Wed</div>
          <div className="day-header">Thu</div>
          <div className="day-header">Fri</div>
          <div className="day-header">Sat</div>
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-view-container">
      <div className="view-header">
        <h2>Calendar View</h2>
        <p>Click on any date to view tasks for that day</p>
        <button onClick={getToday} className="today-button">Go to Today</button>
      </div>

      <div className="calendar-content">
        <div className="calendar-wrapper">
          {renderCalendar()}
        </div>

        <div className="selected-date-tasks">
          <h3>Tasks for {formatDate(selectedDate)}</h3>
          
          {selectedDateTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks scheduled for this date.</p>
            </div>
          ) : (
            <div className="date-task-list">
              {selectedDateTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`task-item ${task.completed ? 'completed' : ''} ${isOverdue(task) ? 'overdue' : ''}`}
                >
                  <div className="task-content">
                    <div className="task-header">
                      <h4 className="task-title">{task.title}</h4>
                      <div className="task-actions">
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
                    
                    <div className="task-meta">
                      <span className={`task-status ${task.completed ? 'completed' : 'pending'}`}>
                        {task.completed ? '✅ Completed' : '⏳ Pending'}
                      </span>
                      <span className="task-time">
                        📅 {new Date(task.deadline).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                        {isOverdue(task) && !task.completed && (
                          <span className="overdue-badge">OVERDUE</span>
                        )}
                      </span>
                    </div>
                  </div>
                  
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
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <h4>Legend</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="indicator overdue"></div>
            <span>Overdue tasks</span>
          </div>
          <div className="legend-item">
            <div className="indicator pending"></div>
            <span>Pending tasks</span>
          </div>
          <div className="legend-item">
            <div className="indicator completed"></div>
            <span>Completed tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
}