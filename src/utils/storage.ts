/**
 * Storage Utility Functions
 * 
 * Handles all local storage operations for the task management system:
 * - Task persistence (load/save)
 * - Task filtering and sorting
 * - Date-based task queries
 * - Task validation and utilities
 * 
 * Features:
 * - Error handling for storage operations
 * - Type-safe task operations
 * - Date manipulation utilities
 * - Task status calculations
 * 
 * @author Dang Minh Duc - RMIT University VN
 * @version 1.0.0
 */

import type { Task } from '../types/Task';

const STORAGE_KEY = 'hackathon-tasks';

// Load tasks from localStorage
export const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading tasks from localStorage:', error);
    return [];
  }
};

// Save tasks to localStorage
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to localStorage:', error);
  }
};

// Generate unique ID for new tasks
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Check if a task is overdue
export const isOverdue = (task: Task): boolean => {
  if (task.completed) return false;
  return new Date(task.deadline) < new Date();
};

// Get tasks for a specific date
export const getTasksForDate = (tasks: Task[], date: Date): Task[] => {
  const dateStr = date.toISOString().split('T')[0];
  return tasks.filter(task => task.deadline.startsWith(dateStr));
};

// Filter tasks based on filter type
export const filterTasks = (tasks: Task[], filter: string): Task[] => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekFromNow = new Date(today);
  weekFromNow.setDate(weekFromNow.getDate() + 7);
  
  switch (filter) {
    case 'pending':
      return tasks.filter(task => !task.completed);
    case 'completed':
      return tasks.filter(task => task.completed);
    case 'overdue':
      return tasks.filter(task => isOverdue(task));
    case 'today':
      return tasks.filter(task => {
        const taskDate = new Date(task.deadline);
        return taskDate.toDateString() === today.toDateString();
      });
    case 'thisWeek':
      return tasks.filter(task => {
        const taskDate = new Date(task.deadline);
        return taskDate >= today && taskDate <= weekFromNow;
      });
    default:
      return tasks;
  }
};

// Sort tasks based on sort type
export const sortTasks = (tasks: Task[], sort: string): Task[] => {
  const sorted = [...tasks];
  
  switch (sort) {
    case 'deadline':
      return sorted.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    case 'created':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'title':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'status':
      return sorted.sort((a, b) => {
        if (a.completed === b.completed) {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return a.completed ? 1 : -1;
      });
    default:
      return sorted;
  }
};
