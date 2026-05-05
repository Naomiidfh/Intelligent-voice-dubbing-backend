import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Plus, Phone, Mail, Loader2, MessageCircle, CheckCircle, Clock, User } from 'lucide-react';
import { Home } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useAdminStore } from '@/stores/adminStore';

export default function CounselorManagement() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAdminStore();
  const [counselors, setCounselors] = useState<any[]>([
    { id: 1, name: '张辅导员', phone: '13800001001', email: 'zhang@zhisheng.com', region: '北京', status: 'active', students: 15 },
    { id: 2, name: '李辅导员', phone: '13800001002', email: 'li@zhisheng.com', region: '上海', status: 'active', students: 12 },
    { id: 3, name: '王辅导员', phone: '13800001003', email: 'wang@zhisheng.com', region: '广州', status: 'active', students: 10 }
  ]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCounselor, setSelectedCounselor] = useState<any>(null);
  const [helpRequests, setHelpRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'counselors' | 'helpRequests'>('counselors');
  const [loadingHelp, setLoadingHelp] = useState(false);
  const [voiceActors, setVoiceActors] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login');
    } else {
      fetchCounselors();
      fetchVoiceActors();
    }
  }, [isLoggedIn, navigate]);

  const fetchCounselors = async () => {
    try {
      const response = await fetch('/api/counselors');
      const data = await response.json();
      if (data.success) {
        setCounselors(data.data || []);
      }
    } catch (error) {
      console.error('获取辅导员列表失败:', error);
    }
  };

  const fetchVoiceActors = async () => {
    try {
      const response = await fetch('/api/users/voice-actors');
      const data = await response.json();
      if (data.success) {
        setVoiceActors(data.data || []);
      }
    } catch (error) {
      console.error('获取配音员列表失败:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'helpRequests') {
      fetchHelpRequests();
    }
  }, [activeTab]);

  const fetchHelpRequests = async () => {
    setLoadingHelp(true);
    try {
      const response = await fetch('/api/help/help-requests');
      const data = await response.json();
      if (data.success) {
        setHelpRequests(data.data || []);
      }
    } catch (error) {
      console.error('获取帮扶求助列表失败:', error);
    } finally {
      setLoadingHelp(false);
    }
  };

  const filteredCounselors = counselors.filter(c => 
    c.name.includes(searchKeyword) || c.phone.includes(searchKeyword) || c.region.includes(searchKeyword)
  );

  const handleViewDetails = (counselor: any) => {
    setSelectedCounselor(counselor);
  };

  const handleCloseDetails = () => {
    setSelectedCounselor(null);
  };

  const handleAssignStudents = (counselor: any) => {
    alert(`为 ${counselor.name} 分配学员功能开发中...`);
  };

  const handleReplyHelp = async (requestId: number) => {
    const reply = prompt('请输入回复内容：');
    if (!reply) return;

    try {
      const response = await fetch(`/api/help/help-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'replied', reply })
      });

      if (response.ok) {
        alert('回复成功');
        fetchHelpRequests();
      }
    } catch (error) {
      console.error('回复失败:', error);
      alert('回复失败，请重试');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: '数据大盘', path: '/admin/dashboard' },
    { id: 'users', label: '人员管理', path: '/admin/users' },
    { id: 'manuscripts', label: '文稿预处理', path: '/admin/manuscripts' },
    { id: 'dispatch', label: '订单分派', path: '/admin/dispatch' },
    { id: 'quality', label: '质控审核', path: '/admin/quality' },
    { id: 'counselors', label: '辅导员管理', path: '/admin/counselors' },
    { id: 'organizations', label: '机构管理', path: '/admin/organizations' },
    { id: 'finance', label: '财务结算', path: '/admin/finance' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">智</span>
              </div>
              <div>
                <h2 className="font-bold">智声助业</h2>
                <p className="text-xs text-gray-500">运营管理后台</p>
              </div>
            </div>
          </div>
          <nav className="p-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-2 rounded-lg mb-2 transition-colors ${
                  item.id === 'counselors' ? 'bg-primary-100 text-primary-700 font-medium' : 'hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t mt-auto">
            <Button variant="outline" size="sm" fullWidth onClick={() => navigate('/admin/dashboard')}>
              <Home className="w-4 h-4 mr-2" />
              返回主页
            </Button>
          </div>
        </aside>

        <div className="flex-1">
          <header className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">辅导员管理</h1>
                <p className="text-gray-500 text-sm mt-1">管理平台辅导员信息</p>
              </div>
              <Button variant="primary" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                添加辅导员
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="mb-6 flex justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('counselors')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'counselors'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  辅导员列表
                </button>
                <button
                  onClick={() => setActiveTab('helpRequests')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    activeTab === 'helpRequests'
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  帮扶求助
                  {helpRequests.filter(r => r.status === 'pending').length > 0 && (
                    <span className="bg-danger-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {helpRequests.filter(r => r.status === 'pending').length}
                    </span>
                  )}
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="搜索姓名、手机号或地区..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400 w-64"
                />
              </div>
            </div>

            {activeTab === 'counselors' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCounselors.map((counselor) => (
                  <Card key={counselor.id} variant="elevated">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-success-100 rounded-full flex items-center justify-center text-success-600 text-xl font-bold">
                        {counselor.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-gray-800">{counselor.name}</h4>
                            <p className="text-sm text-gray-500">{counselor.region}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            counselor.status === 'active' 
                              ? 'bg-success-100 text-success-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {counselor.status === 'active' ? '活跃' : '不活跃'}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <p className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-4 h-4" />
                            {counselor.phone}
                          </p>
                          <p className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4" />
                            {counselor.email}
                          </p>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">负责学员</span>
                            <span className="text-lg font-bold text-primary-600">{counselor.students}人</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleViewDetails(counselor)}
                          >
                            查看详情
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleAssignStudents(counselor)}
                          >
                            分配学员
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {loadingHelp ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                    <span className="ml-2 text-gray-500">加载中...</span>
                  </div>
                ) : helpRequests.length === 0 ? (
                  <Card>
                    <div className="text-center py-12">
                      <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">暂无帮扶求助记录</p>
                    </div>
                  </Card>
                ) : (
                  helpRequests.map((request) => (
                    <Card key={request.id} variant="elevated">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.status === 'pending'
                                  ? 'bg-warning-100 text-warning-700'
                                  : 'bg-success-100 text-success-700'
                              }`}>
                                {request.status === 'pending' ? (
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> 待处理
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" /> 已回复
                                  </span>
                                )}
                              </span>
                              {request.topic && (
                                <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                                  {request.topic}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              提交人：{request.user_name} | {request.user_phone}
                            </p>
                          </div>
                          <span className="text-sm text-gray-400">
                            {request.created_at ? new Date(request.created_at).toLocaleDateString('zh-CN') : '-'}
                          </span>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-800 whitespace-pre-wrap">{request.content}</p>
                        </div>

                        {request.reply && (
                          <div className="bg-success-50 rounded-lg p-4 border border-success-200">
                            <p className="text-sm text-success-600 font-medium mb-1">回复：</p>
                            <p className="text-gray-700">{request.reply}</p>
                          </div>
                        )}

                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleReplyHelp(request.id)}
                              className="flex-1"
                            >
                              <MessageCircle className="w-4 h-4 mr-1" />
                              回复求助
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedCounselor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-800">辅导员详情</h3>
                <button
                  onClick={handleCloseDetails}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center text-success-600 text-2xl font-bold">
                  {selectedCounselor.name[0]}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedCounselor.name}</h4>
                  <p className="text-gray-500">{selectedCounselor.region}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">联系电话</p>
                  <p className="text-gray-800 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {selectedCounselor.phone}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">电子邮箱</p>
                  <p className="text-gray-800 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {selectedCounselor.email}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">状态</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedCounselor.status === 'active' 
                      ? 'bg-success-100 text-success-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {selectedCounselor.status === 'active' ? '活跃' : '不活跃'}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-500">我的帮扶人员</p>
                    <span className="text-lg font-bold text-primary-600">
                      {voiceActors.filter(va => va.counselor_id === selectedCounselor.id).length}人
                    </span>
                  </div>
                  <div className="space-y-2">
                    {voiceActors.filter(va => va.counselor_id === selectedCounselor.id).length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">暂无帮扶人员</p>
                    ) : (
                      voiceActors.filter(va => va.counselor_id === selectedCounselor.id).map(actor => (
                        <div key={actor.id} className="flex items-center gap-3 bg-white rounded-lg p-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                            {actor.name?.[0] || '?'}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{actor.name}</p>
                            <p className="text-sm text-gray-500">{actor.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-success-600">¥{actor.totalEarnings || 0}</p>
                            <p className="text-xs text-gray-400">累计收益</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleCloseDetails}
                >
                  关闭
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    handleAssignStudents(selectedCounselor);
                    handleCloseDetails();
                  }}
                >
                  分配学员
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
