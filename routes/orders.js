import { Router } from 'express';
import { db } from '../database.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const { voice_actor_id, task_id, status } = req.query;
    const filters = {};
    if (voice_actor_id) filters.voice_actor_id = parseInt(voice_actor_id);
    if (task_id) filters.task_id = parseInt(task_id);
    if (status) filters.status = status;

    const orders = db.orders.findAll(filters);
    const result = orders.map(order => {
      const task = db.tasks.findById(order.task_id);
      const user = db.users.findById(order.voice_actor_id);
      return {
        ...order,
        task_content: task?.content,
        task_sentences: task?.sentences,
        budget: task?.budget,
        voice_actor_name: user?.name
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('获取订单列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const order = db.orders.findById(parseInt(req.params.id));

    if (!order) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }

    const task = db.tasks.findById(order.task_id);
    const user = db.users.findById(order.voice_actor_id);

    res.json({
      success: true,
      data: {
        ...order,
        task_content: task?.content,
        task_sentences: task?.sentences,
        budget: task?.budget,
        voice_actor_name: user?.name
      }
    });
  } catch (error) {
    console.error('获取订单详情失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.post('/', (req, res) => {
  try {
    const { task_id, voice_actor_id } = req.body;

    if (!task_id || !voice_actor_id) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }

    const existingOrder = db.orders.findByTaskAndActor(parseInt(task_id), parseInt(voice_actor_id));

    if (existingOrder) {
      return res.status(400).json({ success: false, message: '您已接取此任务' });
    }

    const task = db.tasks.findById(parseInt(task_id));
    if (!task) {
      return res.status(404).json({ success: false, message: '任务不存在' });
    }

    if (task.status !== 'approved') {
      return res.status(400).json({ success: false, message: '该任务暂不可接单' });
    }

    const newOrder = db.orders.create({
      task_id: parseInt(task_id),
      voice_actor_id: parseInt(voice_actor_id),
      status: 'accepted'
    });

    db.tasks.update(parseInt(task_id), { status: 'in_progress' });

    db.notifications.create({
      user_id: voice_actor_id,
      user_type: 'voice_actor',
      title: '任务接单成功',
      content: `您已成功接取任务，请按时完成`
    });

    res.json({
      success: true,
      message: '接单成功',
      data: newOrder
    });
  } catch (error) {
    console.error('创建订单失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { status, audio_url, voice_actor_id, voice_actor_name, admin_feedback } = req.body;
    const orderId = parseInt(req.params.id);

    const order = db.orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }

    const updates = { status, audio_url };
    
    if (voice_actor_id !== undefined) {
      updates.voice_actor_id = parseInt(voice_actor_id);
    }
    if (voice_actor_name !== undefined) {
      updates.voice_actor_name = voice_actor_name;
    }
    if (admin_feedback !== undefined) {
      updates.admin_feedback = admin_feedback;
    }
    
    if (status === 'pending_review') {
      updates.submitted_at = new Date().toISOString();
    } else if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const updatedOrder = db.orders.update(orderId, updates);

    if (voice_actor_id && voice_actor_name && !order.voice_actor_id) {
      db.notifications.create({
        user_id: parseInt(voice_actor_id),
        user_type: 'voice_actor',
        title: '新任务分派',
        content: `您已被分配新任务，请前往任务广场查看`
      });
    }

    const task = db.tasks.findById(order.task_id);
    
    if (status === 'completed' && order.voice_actor_id && task) {
      const voiceActor = db.users.findById(order.voice_actor_id);
      if (voiceActor) {
        const earning = task.budget || 0;
        db.users.update(order.voice_actor_id, {
          totalEarnings: (voiceActor.totalEarnings || 0) + earning,
          withdrawable: (voiceActor.withdrawable || 0) + earning,
          completedOrders: (voiceActor.completedOrders || 0) + 1
        });

        db.notifications.create({
          user_id: order.voice_actor_id,
          user_type: 'voice_actor',
          title: '收益到账',
          content: `恭喜！您已完成任务，获得收益 ¥${earning}，已加入可提现金额`
        });
      }

      // 添加甲方消费记录
      db.expenses.create({
        client_id: task.client_id,
        order_id: orderId,
        task_id: order.task_id,
        voice_actor_id: order.voice_actor_id,
        amount: task.budget || 0,
        description: `订单 #${orderId} - 配音服务`
      });

      // 更新任务状态为已完成
      db.tasks.update(order.task_id, { status: 'completed' });
    }
    
    if (status === 'pending_review' && task) {
      db.notifications.create({
        user_id: task.client_id,
        user_type: 'client',
        title: '作品已提交',
        content: `有配音员提交了作品，请前往验收`
      });
    }

    if (status === 'pending_acceptance' && order.voice_actor_id) {
      db.notifications.create({
        user_id: order.voice_actor_id,
        user_type: 'voice_actor',
        title: '作品审核通过',
        content: `您的作品已通过质控审核，正在等待甲方验收，请耐心等待`
      });
    }

    if (status === 'pending_record' && admin_feedback && order.voice_actor_id) {
      db.notifications.create({
        user_id: order.voice_actor_id,
        user_type: 'voice_actor',
        title: '作品被驳回',
        content: `您的作品需要修改，原因：${admin_feedback}`
      });
    }

    res.json({ success: true, message: '订单更新成功', data: updatedOrder });
  } catch (error) {
    console.error('更新订单失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;
