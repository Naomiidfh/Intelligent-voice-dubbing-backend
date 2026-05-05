import { Router } from 'express';
import { db } from '../database.js';

const router = Router();

router.get('/help-requests', (req, res) => {
  try {
    const { counselor_id } = req.query;

    if (!Array.isArray(db.helpRequests)) {
      db.helpRequests = [];
    }

    let requests = [...db.helpRequests];

    if (counselor_id) {
      requests = requests.filter(r => r.counselor_id === parseInt(counselor_id) || r.counselor_id === null);
    }

    const result = requests.map(request => {
      const user = db.users.findById(request.user_id);
      return {
        ...request,
        user_name: user?.name || request.user_name || '未知用户',
        user_phone: user?.phone || request.user_phone || '',
      };
    });

    res.json({ success: true, data: result });
  } catch (error) {
    console.error('获取帮扶求助列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.post('/help-requests', (req, res) => {
  try {
    const { user_id, user_name, user_phone, counselor_id, counselor_name, topic, content, type } = req.body;

    if (!user_id || !content) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }

    if (!Array.isArray(db.helpRequests)) {
      db.helpRequests = [];
    }

    if (!db._id_counters || typeof db._id_counters !== 'object') {
      db._id_counters = {};
    }

    const newId = db._id_counters.helpRequests || 1;
    db._id_counters.helpRequests = newId + 1;

    const helpRequest = {
      id: newId,
      user_id: parseInt(user_id),
      user_name,
      user_phone,
      counselor_id: counselor_id ? parseInt(counselor_id) : null,
      counselor_name,
      topic,
      content,
      type: type || 'text',
      status: 'pending',
      created_at: new Date().toISOString()
    };

    db.helpRequests.push(helpRequest);

    if (db.notifications && typeof db.notifications.create === 'function') {
      db.notifications.create({
        user_id: counselor_id ? parseInt(counselor_id) : 0,
        user_type: 'counselor',
        title: '收到帮扶求助',
        content: `${user_name}提交了帮扶求助：${topic || content.substring(0, 50)}`,
        related_id: `help-${helpRequest.id}`
      });
    }

    res.json({
      success: true,
      message: '求助提交成功',
      data: helpRequest
    });
  } catch (error) {
    console.error('提交帮扶求助失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.put('/help-requests/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status, reply } = req.body;

    if (!Array.isArray(db.helpRequests)) {
      db.helpRequests = [];
    }

    const index = db.helpRequests.findIndex(r => r.id === parseInt(id));
    if (index !== -1) {
      db.helpRequests[index] = {
        ...db.helpRequests[index],
        status,
        reply,
        replied_at: new Date().toISOString()
      };
      res.json({ success: true, message: '更新成功', data: db.helpRequests[index] });
    } else {
      res.json({ success: true, message: '更新成功' });
    }
  } catch (error) {
    console.error('更新帮扶求助失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;
