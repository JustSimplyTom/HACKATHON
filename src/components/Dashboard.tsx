/**
 * Dashboard Component
 * 
 * Main dashboard view displaying:
 * - Task statistics and progress
 * - Motivational messages
 * - Upcoming deadlines
 * - Overdue task alerts
 * - Brand assets (Hackathon, Naver, React logos)
 * 
 * Features:
 * - Real-time task calculations
 * - Responsive design
 * - Interactive elements
 * 
 * @param tasks - Array of all tasks
 * @param onAddTask - Callback to open add task form
 * 
 * @author Dang Minh Duc - RMIT University VN
 * @version 1.0.0
 */

import { useMemo } from 'react';
import type { Task } from '../types/Task';
import { isOverdue, getTasksForDate } from '../utils/storage';
import HackathonGraphic from '../assets/hackathon-graphic.svg';
import NaverLogo from '../assets/naver-logo.svg';
import ReactLogo from '../assets/react.svg';

interface DashboardProps {
  tasks: Task[];
  onAddTask: () => void;
}

export default function Dashboard({ tasks, onAddTask }: DashboardProps) {
  // Calculate dashboard data
  const dashboardData = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Get today's tasks
    const todayTasks = getTasksForDate(tasks, today);
    const completedToday = todayTasks.filter(task => task.completed).length;
    const totalToday = todayTasks.length;
    const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
    
    // Get next 3 upcoming deadlines
    const upcomingTasks = tasks
      .filter(task => !task.completed && new Date(task.deadline) >= today)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 3);
    
    // Get overdue tasks
    const overdueTasks = tasks.filter(task => isOverdue(task));
    
    // Calculate motivational message
    const pendingTasks = tasks.filter(task => !task.completed);
    const totalTasks = tasks.length;
    const overallProgress = totalTasks > 0 ? Math.round(((totalTasks - pendingTasks.length) / totalTasks) * 100) : 0;
    
    return {
      completedToday,
      totalToday,
      completionRate,
      upcomingTasks,
      overdueTasks,
      pendingTasks,
      overallProgress
    };
  }, [tasks]);

  // Get motivational message
  const getMotivationalMessage = () => {
    const { completedToday, totalToday, pendingTasks, overallProgress } = dashboardData;
    
    if (completedToday === totalToday && totalToday > 0) {
      return "🎉 Amazing! You've completed all your tasks for today!";
    }
    
    if (pendingTasks.length === 0 && tasks.length > 0) {
      return "🏆 Congratulations! All tasks completed!";
    }
    
    if (overallProgress >= 80) {
      return `🔥 You're ${overallProgress}% done! Almost there!`;
    }
    
    if (pendingTasks.length <= 3) {
      return `💪 Only ${pendingTasks.length} tasks left! You've got this!`;
    }
    
    if (completedToday > 0) {
      return `✨ Great start! ${completedToday} tasks done today.`;
    }
    
    return "🚀 Ready to tackle your tasks? Let's get started!";
  };

  // Format deadline for display
  const formatDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return deadlineDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get deadline color
  const getDeadlineColor = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-500'; // Overdue
    if (diffDays === 0) return 'text-orange-500'; // Due today
    if (diffDays <= 2) return 'text-yellow-500'; // Due soon
    return 'text-gray-500'; // Future
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <button 
          onClick={onAddTask}
          className="btn btn-primary dashboard-add-btn"
        >
          + Quick Add Task
        </button>
      </div>

      {/* Motivational Message */}
      <div className="motivational-banner">
        <p className="motivational-text">{getMotivationalMessage()}</p>
      </div>

      {/* Brand Assets Section */}
      <div className="brand-assets-section">
        <div className="brand-assets-container">
          <div className="brand-asset">
            <img src={HackathonGraphic} alt="Hackathon Graphic" className="brand-graphic" />
            <p>Built for Hackathon</p>
          </div>
          <div className="brand-asset">
            <img src={NaverLogo} alt="Naver Logo" className="brand-logo" />
            <p>Powered by Naver</p>
          </div>
          <div className="brand-asset">
            <img src={ReactLogo} alt="React Logo" className="brand-logo" />
            <p>Built with React</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{dashboardData.completionRate}%</h3>
            <p>Completed Today</p>
            <span className="stat-detail">
              {dashboardData.completedToday} of {dashboardData.totalToday} tasks
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>{dashboardData.upcomingTasks.length}</h3>
            <p>Upcoming Deadlines</p>
            <span className="stat-detail">Next 3 tasks</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{dashboardData.overdueTasks.length}</h3>
            <p>Overdue Tasks</p>
            <span className="stat-detail">Needs attention</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>{dashboardData.overallProgress}%</h3>
            <p>Overall Progress</p>
            <span className="stat-detail">All tasks</span>
          </div>
        </div>
      </div>

      {/* Next 3 Deadlines */}
      <div className="upcoming-section">
        <h2 className="section-title">Next 3 Deadlines</h2>
        {dashboardData.upcomingTasks.length === 0 ? (
          <div className="empty-state">
            <p>🎉 No upcoming deadlines! Great job!</p>
          </div>
        ) : (
          <div className="upcoming-tasks">
            {dashboardData.upcomingTasks.map((task, index) => (
              <div key={task.id} className="upcoming-task-card">
                <div className="task-priority">
                  <span className="priority-number">{index + 1}</span>
                </div>
                <div className="task-info">
                  <h4 className="task-title">{task.title}</h4>
                  <div className="task-meta">
                    <span className={`deadline ${getDeadlineColor(task.deadline)}`}>
                      {formatDeadline(task.deadline)}
                    </span>
                    {task.category && (
                      <span className="task-category">{task.category}</span>
                    )}
                  </div>
                </div>
                <div>
                  {task.priority === 'high' && <span className="priority-badge high" style={{ minWidth: 70, display: 'inline-block', textAlign: 'center' }}>High</span>}
                  {task.priority === 'medium' && <span className="priority-badge medium" style={{ minWidth: 70, display: 'inline-block', textAlign: 'center' }}>Med</span>}
                  {task.priority === 'low' && <span className="priority-badge low" style={{ minWidth: 70, display: 'inline-block', textAlign: 'center' }}>Low</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overdue Tasks Alert */}
      {dashboardData.overdueTasks.length > 0 && (
        <div className="overdue-alert">
          <div className="alert-icon">⚠️</div>
          <div className="alert-content">
            <h3>Overdue Tasks Alert</h3>
            <p>You have {dashboardData.overdueTasks.length} overdue task{dashboardData.overdueTasks.length > 1 ? 's' : ''} that need attention.</p>
          </div>
        </div>
      )}
    </div>
  );
}
