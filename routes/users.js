import { Router } from 'express';
import { db } from '../database.js';

const router = Router();

router.get('/voice-actors', (req, res) => {
  try {
    const users = db.users.findAll().filter(u => u.role === 'voice_actor');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error('获取配音员列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.post('/voice-actors/login', (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: '请输入手机号' });
    }

    let user = db.users.findByPhone(phone);

    if (!user) {
      user = db.users.create({
        phone,
        name: `用户${phone.slice(-4)}`,
        role: 'voice_actor',
        avatar: null
      });
    }

    res.json({
      success: true,
      message: '登录成功',
      data: user
    });
  } catch (error) {
    console.error('配音员登录失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.get('/clients', (req, res) => {
  try {
    const clients = db.client_users.findAll();
    res.json({ success: true, data: clients });
  } catch (error) {
    console.error('获取甲方列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.post('/clients/login', (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: '请输入手机号' });
    }

    const client = db.client_users.findByPhone(phone);

    if (!client) {
      return res.status(404).json({ success: false, message: '账号不存在，请先注册' });
    }

    res.json({
      success: true,
      message: '登录成功',
      data: client
    });
  } catch (error) {
    console.error('甲方登录失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.post('/clients/register', (req, res) => {
  try {
    const { phone, company_name, contact_name } = req.body;

    if (!phone || !company_name) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }

    const existing = db.client_users.findByPhone(phone);
    if (existing) {
      return res.status(400).json({ success: false, message: '手机号已注册' });
    }

    const newClient = db.client_users.create({
      phone,
      company_name,
      contact_name: contact_name || '',
      verified: false
    });

    res.json({
      success: true,
      message: '注册成功，请等待审核',
      data: newClient
    });
  } catch (error) {
    console.error('甲方注册失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.get('/notifications', (req, res) => {
  try {
    const { user_id, user_type } = req.query;
    const filters = {};
    if (user_id) filters.user_id = parseInt(user_id);
    if (user_type) filters.user_type = user_type;

    const notifications = db.notifications.findAll(filters);

    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('获取通知列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.put('/notifications/:id/read', (req, res) => {
  try {
    db.notifications.markRead(parseInt(req.params.id));
    res.json({ success: true, message: '标记已读成功' });
  } catch (error) {
    console.error('标记已读失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;
