const request = require('supertest');
const app = require('../src/app');

describe('Learning App API', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Welcome to the Learning App!');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.status).toBe('healthy');
    });
  });

  describe('GET /health', () => {
    it('should return health check', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('GET /topics', () => {
    it('should return all topics', async () => {
      const response = await request(app).get('/topics');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /topics/:id', () => {
    it('should return a specific topic', async () => {
      const response = await request(app).get('/topics/1');
      
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.title).toBeDefined();
      expect(response.body.description).toBeDefined();
    });

    it('should return 404 for non-existent topic', async () => {
      const response = await request(app).get('/topics/999');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Topic not found');
    });
  });

  describe('POST /topics', () => {
    it('should create a new topic', async () => {
      const newTopic = {
        title: 'Test Topic',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/topics')
        .send(newTopic);
      
      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newTopic.title);
      expect(response.body.description).toBe(newTopic.description);
      expect(response.body.completed).toBe(false);
      expect(response.body.id).toBeDefined();
    });

    it('should return 400 for missing title', async () => {
      const response = await request(app)
        .post('/topics')
        .send({ description: 'Test Description' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title and description are required');
    });

    it('should return 400 for missing description', async () => {
      const response = await request(app)
        .post('/topics')
        .send({ title: 'Test Title' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title and description are required');
    });
  });

  describe('PUT /topics/:id/complete', () => {
    it('should mark topic as completed', async () => {
      const response = await request(app).put('/topics/1/complete');
      
      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);
    });

    it('should return 404 for non-existent topic', async () => {
      const response = await request(app).put('/topics/999/complete');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Topic not found');
    });
  });

  describe('404 handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Route not found');
    });
  });
});