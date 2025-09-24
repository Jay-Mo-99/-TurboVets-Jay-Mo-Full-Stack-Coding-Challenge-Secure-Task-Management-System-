import { Controller, Get, Post, Put, Delete, Body, Param, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { verifyToken, extractTokenFromHeader } from '../auth/auth.utils';

interface CreateTaskDto {
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
}

interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
}

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  private getUserFromToken(authorization?: string) {
    const token = extractTokenFromHeader(authorization);
    if (!token) {
      throw new HttpException('Authorization token required', HttpStatus.UNAUTHORIZED);
    }
    
    const user = verifyToken(token);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    
    return user;
  }

  @Post()
  createTask(@Body() body: CreateTaskDto, @Headers('authorization') authorization?: string) {
    const user = this.getUserFromToken(authorization);
    const { title, description, priority } = body;
    
    if (!title || !description) {
      throw new HttpException('Title and description are required', HttpStatus.BAD_REQUEST);
    }
    
    const task = this.taskService.createTask(title, description, user.email, priority);
    return { success: true, task };
  }

  @Get()
  getTasks(@Headers('authorization') authorization?: string) {
    const user = this.getUserFromToken(authorization);
    const tasks = this.taskService.getTasksByUser(user.email);
    return { success: true, tasks };
  }

  @Get(':id')
  getTask(@Param('id') id: string, @Headers('authorization') authorization?: string) {
    const user = this.getUserFromToken(authorization);
    const task = this.taskService.getTaskById(id, user.email);
    
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    
    return { success: true, task };
  }

  @Put(':id')
  updateTask(@Param('id') id: string, @Body() body: UpdateTaskDto, @Headers('authorization') authorization?: string) {
    const user = this.getUserFromToken(authorization);
    const task = this.taskService.updateTask(id, user.email, body);
    
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    
    return { success: true, task };
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @Headers('authorization') authorization?: string) {
    const user = this.getUserFromToken(authorization);
    const deleted = this.taskService.deleteTask(id, user.email);
    
    if (!deleted) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    
    return { success: true, message: 'Task deleted successfully' };
  }
}