import { Router } from 'express';
import { db } from '../database.js';

const router = Router();

router.get('/', (req, res) => {
  try {
    const counselors = db.counselors.findAll();
    res.json({ success: true, data: counselors });
  } catch (error) {
    console.error('获取辅导员列表失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const counselor = db.counselors.findById(parseInt(req.params.id));
    if (!counselor) {
      return res.status(404).json({ success: false, message: '辅导员不存在' });
    }
    res.json({ success: true, data: counselor });
  } catch (error) {
    console.error('获取辅导员详情失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.post('/', (req, res) => {
  try {
    const { name, phone, email, region } = req.body;
    
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: '缺少必要参数' });
    }

    const newCounselor = db.counselors.create({
      name,
      phone,
      email: email || '',
      region: region || '',
      status: 'active',
      students: 0
    });

    res.json({ success: true, message: '辅导员创建成功', data: newCounselor });
  } catch (error) {
    console.error('创建辅导员失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { name, phone, email, region, status } = req.body;
    const counselorId = parseInt(req.params.id);

    const counselor = db.counselors.findById(counselorId);
    if (!counselor) {
      return res.status(404).json({ success: false, message: '辅导员不存在' });
    }

    const updatedCounselor = db.counselors.update(counselorId, {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(email !== undefined && { email }),
      ...(region !== undefined && { region }),
      ...(status && { status })
    });

    res.json({ success: true, message: '辅导员更新成功', data: updatedCounselor });
  } catch (error) {
    console.error('更新辅导员失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const counselorId = parseInt(req.params.id);
    const counselor = db.counselors.findById(counselorId);

    if (!counselor) {
      return res.status(404).json({ success: false, message: '辅导员不存在' });
    }

    db.counselors.delete(counselorId);
    res.json({ success: true, message: '辅导员删除成功' });
  } catch (error) {
    console.error('删除辅导员失败:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
});

export default router;
