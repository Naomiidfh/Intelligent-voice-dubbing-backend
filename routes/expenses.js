import { Router } from 'express';
import { db } from '../database.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { client_id } = req.query;
    const filters = {};
    if (client_id) filters.client_id = parseInt(client_id);

    const expenses = db.expenses.findAll(filters);
    const result = expenses.map(expense => {
      const user = db.users.findById(expense.voice_actor_id);
      return {
        ...expense,
        voice_actor_name: user?.name
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('获取消费记录失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.post('/', (req, res) => {
  try {
    const { client_id, order_id, task_id, voice_actor_id, amount, description } = req.body;

    if (!client_id || !order_id || !amount) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }

    const expense = db.expenses.create({
      client_id: parseInt(client_id),
      order_id: parseInt(order_id),
      task_id: task_id ? parseInt(task_id) : null,
      voice_actor_id: voice_actor_id ? parseInt(voice_actor_id) : null,
      amount: parseFloat(amount),
      description: description || '配音服务'
    });

    res.json({
      success: true,
      message: '消费记录添加成功',
      data: expense
    });
  } catch (error) {
    console.error('创建消费记录失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;
