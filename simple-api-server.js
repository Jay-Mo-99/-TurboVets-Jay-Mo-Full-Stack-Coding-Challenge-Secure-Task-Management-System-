const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// File paths for data persistence
const USERS_FILE = path.join(__dirname, 'users.json');
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Load data from files or initialize empty arrays
let users = [];
let tasks = [];

try {
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  }
} catch (error) {
  console.log('Could not load users file, starting with empty array');
}

try {
  if (fs.existsSync(TASKS_FILE)) {
    tasks = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
  }
} catch (error) {
  console.log('Could not load tasks file, starting with empty array');
}

// Helper functions to save data
const saveUsers = () => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

const saveTasks = () => {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

// Middleware
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201'],
  credentials: true,
}));
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is working' });
});

app.post('/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    if (!email || !username || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = { email, username, passwordHash };
    users.push(user);
    saveUsers();

    const token = jwt.sign({ email, username }, 'your_jwt_secret', { expiresIn: '24h' });
    
    res.json({ success: true, username, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ email: user.email, username: user.username }, 'your_jwt_secret', { expiresIn: '24h' });
    
    res.json({ success: true, token, username: user.username });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Task routes
app.post('/tasks', authenticateToken, (req, res) => {
  try {
    const { title, description, priority = 'medium', dueDate, category = 'Personal' } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const task = {
      id: Date.now().toString(),
      title,
      description: description || null,
      status: 'pending',
      priority,
      category,
      dueDate: dueDate || null,
      userEmail: req.user.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create task' });
  }
});

app.get('/tasks', authenticateToken, (req, res) => {
  try {
    const userTasks = tasks.filter(task => task.userEmail === req.user.email);
    res.json(userTasks);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get tasks' });
  }
});

app.put('/tasks/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const taskIndex = tasks.findIndex(t => t.id === id && t.userEmail === req.user.email);
    if (taskIndex === -1) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveTasks();
    
    res.json({ success: true, task: tasks[taskIndex] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update task' });
  }
});

app.delete('/tasks/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = tasks.findIndex(t => t.id === id && t.userEmail === req.user.email);
    
    if (taskIndex === -1) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    
    tasks.splice(taskIndex, 1);
    saveTasks();
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete task' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Express API server running on http://localhost:${PORT}`);
});