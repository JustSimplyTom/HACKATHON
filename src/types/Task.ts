/**
 * Task Type Definitions
 * 
 * Core type definitions for the task management system:
 * - Task interface with all properties
 * - Filter and sort type definitions
 * - Category constants
 * - Utility types for task management
 * 
 * @author Dang Minh Duc - RMIT University VN
 * @version 1.0.0
 */

// Task type definition for the task management application
export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO date string
  completed: boolean;
  createdAt: string; // ISO date string for creation time
  completedAt?: string; // ISO date string for completion time
  category?: string; // Task category/tag
  estimatedTime?: number; // Estimated time in hours
  priority?: 'low' | 'medium' | 'high'; // Task priority
}

// Task filter options for the list view
export type TaskFilter = 'all' | 'pending' | 'completed' | 'overdue' | 'today' | 'thisWeek';

// Task sort options
export type TaskSort = 'deadline' | 'created' | 'title' | 'status' | 'priority';

// Theme type
export type Theme = 'light' | 'dark';

// Task category options
export const TASK_CATEGORIES = [
  'Group Project',
  'Exam',
  'Work Shift',
  'Assignment',
  'Study',
  'Personal',
  'Meeting',
  'Deadline'
] as const;

export type TaskCategory = typeof TASK_CATEGORIES[number];
