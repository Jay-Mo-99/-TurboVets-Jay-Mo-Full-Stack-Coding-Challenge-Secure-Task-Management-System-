import { Injectable } from '@nestjs/common';
import { Task } from './task.entity';

@Injectable()
export class TaskService {
  private tasks: Task[] = [];

  createTask(title: string, description: string, userEmail: string, priority: 'low' | 'medium' | 'high' = 'medium'): Task {
    const task: Task = {
      id: Date.now().toString(),
      title,
      description,
      status: 'pending',
      priority,
      userEmail,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.tasks.push(task);
    return task;
  }

  getTasksByUser(userEmail: string): Task[] {
    return this.tasks.filter(task => task.userEmail === userEmail);
  }

  getTaskById(id: string, userEmail: string): Task | null {
    const task = this.tasks.find(t => t.id === id && t.userEmail === userEmail);
    return task || null;
  }

  updateTask(id: string, userEmail: string, updates: Partial<Task>): Task | null {
    const taskIndex = this.tasks.findIndex(t => t.id === id && t.userEmail === userEmail);
    if (taskIndex === -1) return null;
    
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date()
    };
    return this.tasks[taskIndex];
  }

  deleteTask(id: string, userEmail: string): boolean {
    const taskIndex = this.tasks.findIndex(t => t.id === id && t.userEmail === userEmail);
    if (taskIndex === -1) return false;
    
    this.tasks.splice(taskIndex, 1);
    return true;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }
}