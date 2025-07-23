const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// In-memory storage for learning topics
let topics = [
  { id: 1, title: 'JavaScript Basics', description: 'Learn the fundamentals of JavaScript', completed: false },
  { id: 2, title: 'Node.js Introduction', description: 'Getting started with Node.js', completed: false },
  { id: 3, title: 'DevOps Fundamentals', description: 'Understanding DevOps practices', completed: true }
];

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Learning App!',
    version: '1.0.0',
    status: 'healthy'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/topics', (req, res) => {
  res.json(topics);
});

app.get('/topics/:id', (req, res) => {
  const topic = topics.find(t => t.id === parseInt(req.params.id));
  if (!topic) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  res.json(topic);
});

app.post('/topics', (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }
  
  const newTopic = {
    id: topics.length + 1,
    title,
    description,
    completed: false
  };
  
  topics.push(newTopic);
  res.status(201).json(newTopic);
});

app.put('/topics/:id/complete', (req, res) => {
  const topic = topics.find(t => t.id === parseInt(req.params.id));
  if (!topic) {
    return res.status(404).json({ error: 'Topic not found' });
  }
  
  topic.completed = true;
  res.json(topic);
});

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Learning App running on port ${PORT}`);
  });
}

module.exports = app;