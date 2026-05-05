import { Router } from 'express';
import { db } from '../database.js';
import { processManuscript } from '../utils/pinyin.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { status, client_id } = req.query;
    let tasks;
    
    if (status === 'approved') {
      // 当请求 'approved' 状态的任务时，也包括有 pending_record 订单且未分配配音员的任务
      const approvedTasks = db.tasks.findAll({ status: 'approved' });
      
      // 查找所有 pending_record 且未分配配音员的订单
      const pendingRecordOrders = db.orders.findAll({ 
        status: 'pending_record' 
      }).filter(order => !order.voice_actor_id);
      
      // 从这些订单中获取对应的任务
      const taskIdsFromOrders = new Set(pendingRecordOrders.map(order => order.task_id));
      const tasksFromOrders = db.tasks.findAll().filter(task => 
        taskIdsFromOrders.has(task.id) && task.status !== 'approved'
      );
      
      // 合并并去重
      tasks = [...approvedTasks, ...tasksFromOrders];
      
      // 再次去重（防止重复）
      const seenIds = new Set();
      tasks = tasks.filter(task => {
        if (seenIds.has(task.id)) return false;
        seenIds.add(task.id);
        return true;
      });
    } else {
      // 其他情况正常处理
      const filters = {};
      if (status) filters.status = status;
      if (client_id) filters.client_id = parseInt(client_id);
      tasks = db.tasks.findAll(filters);
    }
    
    const result = tasks.map(task => {
      const client = db.client_users.findById(task.client_id);
      return {
        ...task,
        company_name: client?.company_name || '企业用户'
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('获取任务列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const task = db.tasks.findById(parseInt(req.params.id));

    if (!task) {
      return res.status(404).json({ success: false, message: '任务不存在' });
    }

    const client = db.client_users.findById(task.client_id);
    res.json({
      success: true,
      data: {
        ...task,
        company_name: client?.company_name || '企业用户'
      }
    });
  } catch (error) {
    console.error('获取任务详情失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.post('/', (req, res) => {
  try {
    const { client_id, task_type, content, styles, budget, deadline } = req.body;

    if (!client_id || !task_type || !content) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }

    const sentences = processManuscript(content);

    const newTask = db.tasks.create({
      client_id,
      task_type,
      content,
      sentences,
      styles: styles || [],
      budget,
      deadline,
      status: 'pending'
    });

    db.notifications.create({
      user_id: 0,
      user_type: 'admin',
      title: '新任务待审核',
      content: `有新任务发布，等待平台审核`
    });

    res.json({
      success: true,
      message: '任务发布成功，等待审核',
      data: newTask
    });
  } catch (error) {
    console.error('创建任务失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.put('/:id/status', (req, res) => {
  try {
    const { status } = req.body;
    const taskId = parseInt(req.params.id);

    const task = db.tasks.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: '任务不存在' });
    }

    db.tasks.update(taskId, { status });

    if (status === 'approved') {
      // 1. 通知甲方
      db.notifications.create({
        user_id: task.client_id,
        user_type: 'client',
        title: '任务已通过审核',
        content: `您的任务已审核通过，现在等待配音员接单`
      });
      
      // 2. 自动创建对应的订单
      const order = db.orders.create({
        task_id: taskId,
        client_id: task.client_id,
        client_name: task.company_name || '企业用户',
        voice_actor_id: null,
        voice_actor_name: null,
        task_type: task.task_type,
        task_content: task.content,
        task_sentences: task.sentences,
        budget: task.budget,
        status: 'pending_record',
        recordings: [],
        created_at: new Date().toISOString()
      });
      
      console.log(`任务 ${taskId} 已审核通过，创建订单 ${order.id}`);
    }

    res.json({ success: true, message: '状态更新成功' });
  } catch (error) {
    console.error('更新任务状态失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const task = db.tasks.findById(taskId);

    if (!task) {
      return res.status(404).json({ success: false, message: '任务不存在' });
    }

    db.tasks.delete(taskId);

    res.json({ success: true, message: '任务删除成功' });
  } catch (error) {
    console.error('删除任务失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;
