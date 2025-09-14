/**
 * Sample Data Utility
 * 
 * Generates sample tasks for testing and demonstration purposes:
 * - Realistic task data with various statuses
 * - Different categories and priorities
 * - Spread across multiple dates
 * - Initialization helper function
 * 
 * Features:
 * - 25 diverse sample tasks
 * - Realistic task properties
 * - Date distribution across past, present, and future
 * - Category and priority variety
 * 
 * @author Dang Minh Duc - RMIT University VN
 * @version 1.0.0
 */

import type { Task } from '../types/Task';
import { generateId } from './storage';

// Generate sample tasks for testing
export const generateSampleTasks = (): Task[] => {
  const now = new Date();
  const tasks: Task[] = [];
  
  // Create 25 sample tasks with various statuses and dates
  const sampleTitles = [
    'Complete project proposal',
    'Review code changes',
    'Update documentation',
    'Prepare presentation slides',
    'Test new features',
    'Fix bug in authentication',
    'Optimize database queries',
    'Design user interface mockups',
    'Write unit tests',
    'Deploy to staging environment',
    'Conduct user research',
    'Implement payment integration',
    'Create API documentation',
    'Set up monitoring tools',
    'Refactor legacy code',
    'Plan sprint retrospective',
    'Update security policies',
    'Configure CI/CD pipeline',
    'Review pull requests',
    'Prepare demo for stakeholders',
    'Analyze performance metrics',
    'Update user onboarding flow',
    'Implement error tracking',
    'Create backup strategy',
    'Schedule team meeting'
  ];

  const descriptions = [
    'This is an important task that requires careful attention to detail.',
    'A routine task that needs to be completed regularly.',
    'High priority task with tight deadline.',
    'Collaborative task requiring team coordination.',
    'Technical task involving complex implementation.',
    'Research task to gather information and insights.',
    'Planning task for upcoming project phases.',
    'Review task to ensure quality standards.',
    'Maintenance task to keep systems running smoothly.',
    'Creative task requiring innovative thinking.'
  ];

  const categories = [
    'Group Project',
    'Exam',
    'Work Shift',
    'Assignment',
    'Study',
    'Personal',
    'Meeting',
    'Deadline'
  ];

  const priorities = ['low', 'medium', 'high'] as const;

  for (let i = 0; i < 25; i++) {
    const createdDate = new Date(now);
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30)); // Random date within last 30 days
    
    const deadlineDate = new Date(createdDate);
    deadlineDate.setDate(deadlineDate.getDate() + Math.floor(Math.random() * 14) + 1); // 1-14 days from creation
    
    const isCompleted = Math.random() > 0.4; // 60% chance of being completed
    const completedAt = isCompleted ? new Date(deadlineDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined;
    
    const task: Task = {
      id: generateId(),
      title: sampleTitles[i],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      deadline: deadlineDate.toISOString(),
      completed: isCompleted,
      createdAt: createdDate.toISOString(),
      completedAt: completedAt?.toISOString(),
      category: categories[Math.floor(Math.random() * categories.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      estimatedTime: Math.floor(Math.random() * 8) + 1 // 1-8 hours
    };
    
    tasks.push(task);
  }
  
  return tasks.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
};

// Add sample data to localStorage if no tasks exist
export const initializeSampleData = (): void => {
  const existingTasks = localStorage.getItem('hackathon-tasks');
  if (!existingTasks || JSON.parse(existingTasks).length === 0) {
    const sampleTasks = generateSampleTasks();
    localStorage.setItem('hackathon-tasks', JSON.stringify(sampleTasks));
  }
};
