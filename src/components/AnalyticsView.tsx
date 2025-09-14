/**
 * AnalyticsView Component
 * 
 * Comprehensive analytics dashboard featuring:
 * - Task completion statistics
 * - Progress tracking and visualization
 * - Daily activity breakdown
 * - Performance insights and recommendations
 * - Visual charts and metrics
 * 
 * Features:
 * - Real-time data calculations
 * - Progress bars and visual indicators
 * - Daily activity charts
 * - Performance insights
 * - Responsive design
 * 
 * @param tasks - Array of all tasks for analysis
 * 
 * @author Dang Minh Duc - RMIT University VN
 * @version 1.0.0
 */

import { useMemo } from 'react';
import type { Task } from '../types/Task';
import { isOverdue } from '../utils/storage';

interface AnalyticsViewProps {
  tasks: Task[];
}

export default function AnalyticsView({ tasks }: AnalyticsViewProps) {
  // Calculate analytics data
  const analytics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = tasks.filter(task => !task.completed).length;
    const overdue = tasks.filter(task => isOverdue(task)).length;
    
    // Calculate completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Calculate overdue rate
    const overdueRate = total > 0 ? Math.round((overdue / total) * 100) : 0;
    
    // Get tasks completed in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentlyCompleted = tasks.filter(task => 
      task.completed && 
      task.completedAt && 
      new Date(task.completedAt) >= sevenDaysAgo
    ).length;
    
    // Get tasks created in the last 7 days
    const recentlyCreated = tasks.filter(task => 
      new Date(task.createdAt) >= sevenDaysAgo
    ).length;
    
    // Calculate average completion time (for completed tasks)
    const completedTasks = tasks.filter(task => task.completed && task.completedAt);
    const avgCompletionTime = completedTasks.length > 0 
      ? completedTasks.reduce((sum, task) => {
          const created = new Date(task.createdAt);
          const completed = new Date(task.completedAt!);
          const diffInDays = Math.ceil((completed.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
          return sum + diffInDays;
        }, 0) / completedTasks.length
      : 0;
    
    // Get tasks by status for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentTasks = tasks.filter(task => 
      new Date(task.createdAt) >= thirtyDaysAgo
    );
    
    
    return {
      total,
      completed,
      pending,
      overdue,
      completionRate,
      overdueRate,
      recentlyCompleted,
      recentlyCreated,
      avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
      recentTasks
    };
  }, [tasks]);


  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Task Analytics</h2>
        <p>Overview of your task management performance</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <h3>{analytics.total}</h3>
            <p>Total Tasks</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">✅</div>
          <div className="metric-content">
            <h3>{analytics.completed}</h3>
            <p>Completed</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">⏳</div>
          <div className="metric-content">
            <h3>{analytics.pending}</h3>
            <p>Pending</p>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon">⚠️</div>
          <div className="metric-content">
            <h3>{analytics.overdue}</h3>
            <p>Overdue</p>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="progress-section">
        <h3>Task Status Distribution</h3>
        <div className="progress-bars">
          <div className="progress-item">
            <div className="progress-label">
              <span>Completed</span>
              <span>{analytics.completionRate}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill completed"
                style={{ width: `${analytics.completionRate}%` }}
              ></div>
            </div>
          </div>
          
          <div className="progress-item">
            <div className="progress-label">
              <span>Overdue</span>
              <span>{analytics.overdueRate}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill overdue"
                style={{ width: `${analytics.overdueRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="activity-section">
        <h3>Recent Activity (Last 7 Days)</h3>
        <div className="activity-grid">
          <div className="activity-card">
            <div className="activity-icon">✨</div>
            <div className="activity-content">
              <h4>{analytics.recentlyCreated}</h4>
              <p>New Tasks Created</p>
            </div>
          </div>
          
          <div className="activity-card">
            <div className="activity-icon">🎯</div>
            <div className="activity-content">
              <h4>{analytics.recentlyCompleted}</h4>
              <p>Tasks Completed</p>
            </div>
          </div>
          
          <div className="activity-card">
            <div className="activity-icon">⏱️</div>
            <div className="activity-content">
              <h4>{analytics.avgCompletionTime}</h4>
              <p>Avg. Days to Complete</p>
            </div>
          </div>
        </div>
      </div>


      {/* Performance Insights */}
      <div className="insights-section">
        <h3>Performance Insights</h3>
        <div className="insights-grid">
          {analytics.completionRate >= 90 && (
            <div className="insight-card positive">
              <div className="insight-icon">🏆</div>
              <div className="insight-content">
                <h4>Task Master! 🎯</h4>
                <p>Incredible! You've completed {analytics.completionRate}% of your tasks. You're absolutely crushing it! 💪</p>
              </div>
            </div>
          )}
          
          {analytics.completionRate >= 80 && analytics.completionRate < 90 && (
            <div className="insight-card positive">
              <div className="insight-icon">🎉</div>
              <div className="insight-content">
                <h4>Excellent Progress!</h4>
                <p>You've completed {analytics.completionRate}% of your tasks. Keep up the great work! 🚀</p>
              </div>
            </div>
          )}
          
          {analytics.completionRate >= 60 && analytics.completionRate < 80 && (
            <div className="insight-card info">
              <div className="insight-icon">💪</div>
              <div className="insight-content">
                <h4>Good Progress!</h4>
                <p>You're {analytics.completionRate}% done! You're on the right track. Keep pushing forward! ⭐</p>
              </div>
            </div>
          )}
          
          {analytics.completionRate >= 40 && analytics.completionRate < 60 && (
            <div className="insight-card neutral">
              <div className="insight-icon">🌱</div>
              <div className="insight-content">
                <h4>Making Progress!</h4>
                <p>You're {analytics.completionRate}% complete. Every step counts! You've got this! 🌟</p>
              </div>
            </div>
          )}
          
          {analytics.completionRate > 0 && analytics.completionRate < 40 && (
            <div className="insight-card neutral">
              <div className="insight-icon">🌅</div>
              <div className="insight-content">
                <h4>Getting Started!</h4>
                <p>You're {analytics.completionRate}% done! The journey of a thousand miles begins with a single step! 🚶‍♂️</p>
              </div>
            </div>
          )}
          
          {analytics.overdueRate > 30 && (
            <div className="insight-card warning">
              <div className="insight-icon">🚨</div>
              <div className="insight-content">
                <h4>Overdue Alert! ⚠️</h4>
                <p>You have {analytics.overdueRate}% overdue tasks. Time to tackle those deadlines! Let's get organized! 📋</p>
              </div>
            </div>
          )}
          
          {analytics.overdueRate > 20 && analytics.overdueRate <= 30 && (
            <div className="insight-card warning">
              <div className="insight-icon">⚠️</div>
              <div className="insight-content">
                <h4>Overdue Tasks Alert</h4>
                <p>You have {analytics.overdueRate}% overdue tasks. Consider reviewing your deadlines. 📅</p>
              </div>
            </div>
          )}
          
          {analytics.avgCompletionTime > 14 && (
            <div className="insight-card info">
              <div className="insight-icon">🐌</div>
              <div className="insight-content">
                <h4>Slow and Steady</h4>
                <p>Tasks take an average of {analytics.avgCompletionTime} days to complete. Consider breaking down larger tasks into smaller chunks! 🧩</p>
              </div>
            </div>
          )}
          
          {analytics.avgCompletionTime > 7 && analytics.avgCompletionTime <= 14 && (
            <div className="insight-card info">
              <div className="insight-icon">💡</div>
              <div className="insight-content">
                <h4>Completion Time</h4>
                <p>Tasks take an average of {analytics.avgCompletionTime} days to complete. Consider breaking down larger tasks. ⏱️</p>
              </div>
            </div>
          )}
          
          {analytics.avgCompletionTime <= 3 && analytics.completed > 0 && (
            <div className="insight-card positive">
              <div className="insight-icon">⚡</div>
              <div className="insight-content">
                <h4>Speed Demon! ⚡</h4>
                <p>Wow! You complete tasks in just {analytics.avgCompletionTime} days on average. You're incredibly efficient! 🏃‍♂️💨</p>
              </div>
            </div>
          )}
          
          {analytics.total === 0 && (
            <div className="insight-card neutral">
              <div className="insight-icon">🎯</div>
              <div className="insight-content">
                <h4>Ready to Begin! 🚀</h4>
                <p>Your task management journey starts here! Create your first task and watch your productivity soar! 📈</p>
              </div>
            </div>
          )}
          
          {analytics.completed === 0 && analytics.total > 0 && (
            <div className="insight-card neutral">
              <div className="insight-icon">🌱</div>
              <div className="insight-content">
                <h4>Fresh Start! 🌱</h4>
                <p>You have {analytics.total} task{analytics.total > 1 ? 's' : ''} ready to tackle! Time to turn those ideas into achievements! 💪</p>
              </div>
            </div>
          )}
          
          {analytics.recentlyCompleted >= 5 && (
            <div className="insight-card positive">
              <div className="insight-icon">🔥</div>
              <div className="insight-content">
                <h4>On Fire! 🔥</h4>
                <p>You completed {analytics.recentlyCompleted} tasks in the last 7 days! You're absolutely unstoppable! 🚀</p>
              </div>
            </div>
          )}
          
          {analytics.recentlyCompleted >= 3 && analytics.recentlyCompleted < 5 && (
            <div className="insight-card positive">
              <div className="insight-icon">⭐</div>
              <div className="insight-content">
                <h4>Great Week! ⭐</h4>
                <p>You completed {analytics.recentlyCompleted} tasks this week! Keep up the momentum! 💫</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
