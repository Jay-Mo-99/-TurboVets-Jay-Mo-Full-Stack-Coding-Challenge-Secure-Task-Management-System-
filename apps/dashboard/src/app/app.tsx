import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: 'Work' | 'Study' | 'Personal';
  dueDate?: string;
  userEmail: string;
  createdAt: string;
}

// Task Card Component for Kanban
interface TaskCardProps {
  task: Task;
  editingTask: string | null;
  editTask: Omit<Task, 'id' | 'userEmail' | 'createdAt'>;
  setEditTask: (task: Omit<Task, 'id' | 'userEmail' | 'createdAt'>) => void;
  saveEditTask: () => void;
  cancelEdit: () => void;
  startEditTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  handleDragStart: (e: React.DragEvent, taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  editingTask, 
  editTask, 
  setEditTask, 
  saveEditTask, 
  cancelEdit, 
  startEditTask, 
  deleteTask, 
  handleDragStart 
}) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
  const isDueSoon = task.dueDate && new Date(task.dueDate) < new Date(Date.now() + 24*60*60*1000) && !isOverdue;

  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, task.id)}
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move"
    >
      {editingTask === task.id ? (
        <div className="space-y-3">
          <input
            type="text"
            value={editTask.title}
            onChange={(e) => setEditTask({...editTask, title: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded text-sm font-medium"
            placeholder="Task title"
          />
          <textarea
            value={editTask.description}
            onChange={(e) => setEditTask({...editTask, description: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            rows={2}
            placeholder="Task description"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={editTask.priority}
              onChange={(e) => setEditTask({...editTask, priority: e.target.value as any})}
              className="p-2 border border-gray-300 rounded text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={editTask.category}
              onChange={(e) => setEditTask({...editTask, category: e.target.value as any})}
              className="p-2 border border-gray-300 rounded text-sm"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Study">Study</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Due Date</label>
            <input
              type="datetime-local"
              value={editTask.dueDate}
              onChange={(e) => setEditTask({...editTask, dueDate: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
          <div className="flex space-x-2">
            <button onClick={saveEditTask} className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex-1">
              Save
            </button>
            <button onClick={cancelEdit} className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 flex-1">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-sm line-clamp-2">{task.title}</h4>
            <div className="flex space-x-1 ml-2">
              <button onClick={() => startEditTask(task)} className="text-gray-400 hover:text-yellow-600" title="Edit">✏️</button>
              <button onClick={() => deleteTask(task.id)} className="text-gray-400 hover:text-red-600" title="Delete">🗑️</button>
            </div>
          </div>
          {task.description && <p className="text-gray-600 text-sm mb-2 line-clamp-2">{task.description}</p>}
          <div className="flex flex-wrap gap-1 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              task.category === 'Work' ? 'bg-blue-100 text-blue-700' :
              task.category === 'Study' ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {task.category}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              task.priority === 'high' ? 'bg-red-100 text-red-700' :
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {task.priority.toUpperCase()}
            </span>
          </div>
          {task.dueDate && (
            <div className={`text-xs font-medium mb-2 ${
              isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-green-600'
            }`}>
              📅 {new Date(task.dueDate).toLocaleDateString()}
              {isOverdue && ' (Overdue!)'}
            </div>
          )}
          <div className="text-xs text-gray-400">
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'userEmail' | 'createdAt'>>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    category: 'Personal',
    dueDate: ''
  });

  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTask, setEditTask] = useState<Omit<Task, 'id' | 'userEmail' | 'createdAt'>>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    category: 'Personal',
    dueDate: ''
  });

  const [filterCategory, setFilterCategory] = useState<'All' | Task['category']>('All');
  const [sortBy, setSortBy] = useState<'created' | 'dueDate' | 'priority' | 'title'>('created');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('userEmail');
    const savedUsername = localStorage.getItem('username');
    
    if (token && savedEmail && savedUsername) {
      setIsAuthenticated(true);
      setEmail(savedEmail);
      setUsername(savedUsername);
      fetchTasks();
    }
  }, []);

  const login = async () => {
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('username', data.username);
        setUsername(data.username);
        setIsAuthenticated(true);
        fetchTasks();
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Login failed');
    }
  };

  const register = async () => {
    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('username', username);
        setIsAuthenticated(true);
        fetchTasks();
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setTasks([]);
    setEmail('');
    setPassword('');
    setUsername('');
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks');
    }
  };

  const addTask = async () => {
    if (!newTask.title.trim()) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });
      
      if (response.ok) {
        setNewTask({
          title: '',
          description: '',
          status: 'pending',
          priority: 'medium',
          category: 'Personal',
          dueDate: ''
        });
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to add task');
    }
  };

  const clearForm = () => {
    setNewTask({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      category: 'Personal',
      dueDate: ''
    });
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to delete task');
    }
  };

  const startEditTask = (task: Task) => {
    setEditingTask(task.id);
    setEditTask({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate || ''
    });
  };

  const saveEditTask = async () => {
    if (!editingTask) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/tasks/${editingTask}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editTask)
      });
      
      if (response.ok) {
        setEditingTask(null);
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to update task');
    }
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTask({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      category: 'Personal',
      dueDate: ''
    });
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    updateTaskStatus(taskId, newStatus);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return filteredAndSortedTasks().filter(task => task.status === status);
  };

  const filteredAndSortedTasks = () => {
    let filtered = tasks;
    
    if (filterCategory !== 'All') {
      filtered = filtered.filter(task => task.category === filterCategory);
    }
    
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'priority':
          const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isLogin ? 'Login' : 'Register'} - Task Manager
          </h1>
          <div className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <button
              onClick={isLogin ? login : register}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 font-medium"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-blue-500 hover:text-blue-600"
            >
              {isLogin ? 'Need to register?' : 'Already have account?'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Task Management</h1>
              <p className="text-gray-600">Welcome back, {username}!</p>
            </div>
            <button
              onClick={logout}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Task title"
                className="p-3 border border-gray-300 rounded-lg"
              />
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                className="p-3 border border-gray-300 rounded-lg"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={newTask.category}
                onChange={(e) => setNewTask({...newTask, category: e.target.value as any})}
                className="p-3 border border-gray-300 rounded-lg"
              >
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
              </select>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Due Date (Optional)</label>
                <input
                  type="datetime-local"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg w-full"
                />
              </div>
            </div>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              placeholder="Task description (Optional)"
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows={3}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={clearForm}
                className="bg-gray-200 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium"
              >
                Clear Form
              </button>
              <button
                onClick={addTask}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 font-medium"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <h2 className="text-xl font-semibold">Your Tasks ({filteredAndSortedTasks().length})</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="p-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="All">All Categories</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Personal">Personal</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="p-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="created">Sort by Created</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className="bg-gray-50 rounded-lg p-4 min-h-96"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'pending')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">📋 TO DO</h3>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus('pending').length}
                </span>
              </div>
              <div className="space-y-3">
                {getTasksByStatus('pending').map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    editingTask={editingTask}
                    editTask={editTask}
                    setEditTask={setEditTask}
                    saveEditTask={saveEditTask}
                    cancelEdit={cancelEdit}
                    startEditTask={startEditTask}
                    deleteTask={deleteTask}
                    handleDragStart={handleDragStart}
                  />
                ))}
                {getTasksByStatus('pending').length === 0 && (
                  <div className="text-gray-400 text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>

            <div
              className="bg-blue-50 rounded-lg p-4 min-h-96"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'in-progress')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-blue-700">🔄 IN PROGRESS</h3>
                <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus('in-progress').length}
                </span>
              </div>
              <div className="space-y-3">
                {getTasksByStatus('in-progress').map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    editingTask={editingTask}
                    editTask={editTask}
                    setEditTask={setEditTask}
                    saveEditTask={saveEditTask}
                    cancelEdit={cancelEdit}
                    startEditTask={startEditTask}
                    deleteTask={deleteTask}
                    handleDragStart={handleDragStart}
                  />
                ))}
                {getTasksByStatus('in-progress').length === 0 && (
                  <div className="text-blue-400 text-center py-8 border-2 border-dashed border-blue-200 rounded-lg">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>

            <div
              className="bg-green-50 rounded-lg p-4 min-h-96"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'completed')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-green-700">✅ DONE</h3>
                <span className="bg-green-200 text-green-700 px-2 py-1 rounded-full text-sm">
                  {getTasksByStatus('completed').length}
                </span>
              </div>
              <div className="space-y-3">
                {getTasksByStatus('completed').map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    editingTask={editingTask}
                    editTask={editTask}
                    setEditTask={setEditTask}
                    saveEditTask={saveEditTask}
                    cancelEdit={cancelEdit}
                    startEditTask={startEditTask}
                    deleteTask={deleteTask}
                    handleDragStart={handleDragStart}
                  />
                ))}
                {getTasksByStatus('completed').length === 0 && (
                  <div className="text-green-400 text-center py-8 border-2 border-dashed border-green-200 rounded-lg">
                    Drop tasks here
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;