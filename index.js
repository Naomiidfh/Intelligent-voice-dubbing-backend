import express from 'express';
import cors from 'cors';
import { initDatabase, db } from './database.js';
import apiRoutes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

app.use('/api', apiRoutes);

initDatabase();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '智声助业 API 服务运行中', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 服务器运行在 http://0.0.0.0:${PORT}`);
  console.log(`📋 API文档: http://localhost:${PORT}/api`);
  console.log(`✅ CORS已启用，允许所有来源`);
});
