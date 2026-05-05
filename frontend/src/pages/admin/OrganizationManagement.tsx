import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, Plus, Phone, CheckCircle, Users } from 'lucide-react';
import { Home } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useAdminStore } from '@/stores/adminStore';

export default function OrganizationManagement() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAdminStore();
  const [organizations, setOrganizations] = useState<any[]>([
    { id: 1, name: '北京残联康复中心', type: 'government', contact: '张主任', phone: '010-12345678', students: 45, verified: true },
    { id: 2, name: '上海阳光公益组织', type: 'ngo', contact: '李会长', phone: '021-87654321', students: 30, verified: true },
    { id: 3, name: '广州爱心企业', type: 'enterprise', contact: '王经理', phone: '020-11112222', students: 20, verified: false }
  ]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [isLoggedIn, navigate]);

  const filteredOrgs = organizations.filter(org => 
    org.name.includes(searchKeyword) || org.contact.includes(searchKeyword) || org.phone.includes(searchKeyword)
  );

  const handleViewDetails = (org: any) => {
    setSelectedOrg(org);
  };

  const handleCloseDetails = () => {
    setSelectedOrg(null);
  };

  const handleManage = (org: any) => {
    alert(`管理 ${org.name} 功能开发中...`);
  };

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      government: { bg: 'bg-purple-100', text: 'text-purple-700', label: '政府机构' },
      ngo: { bg: 'bg-blue-100', text: 'text-blue-700', label: '公益组织' },
      enterprise: { bg: 'bg-green-100', text: 'text-green-700', label: '爱心企业' }
    };
    return badges[type] || { bg: 'bg-gray-100', text: 'text-gray-700', label: type };
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

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-900 min-h-screen">
          <div className="p-6 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors" onClick={() => navigate('/admin/dashboard')}>
            <h1 className="text-xl font-bold text-white">智声助业</h1>
            <p className="text-gray-400 text-sm">运营管理后台</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  item.path === '/admin/organizations'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">机构管理</h2>
                <p className="text-sm text-gray-500">管理合作机构信息</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">返回主页</span>
                </button>
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  添加机构
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="mb-6 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="搜索机构名称、联系人或电话..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrgs.map((org) => {
                const typeBadge = getTypeBadge(org.type);
                return (
                  <Card key={org.id} variant="elevated">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800">{org.name}</h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeBadge.bg} ${typeBadge.text}`}>
                              {typeBadge.label}
                            </span>
                          </div>
                        </div>
                        {org.verified ? (
                          <CheckCircle className="w-5 h-5 text-success-500" />
                        ) : (
                          <span className="px-2 py-1 bg-warning-100 text-warning-700 rounded-full text-xs">
                            待审核
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <p className="text-gray-600">联系人：{org.contact}</p>
                        <p className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {org.phone}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">学员数量</span>
                        </div>
                        <span className="text-lg font-bold text-primary-600">{org.students}人</span>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewDetails(org)}
                        >
                          查看详情
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => handleManage(org)}
                        >
                          {org.verified ? '管理' : '审核'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </main>
        </div>
      </div>

      {selectedOrg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-800">机构详情</h3>
                <button
                  onClick={handleCloseDetails}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <Building2 className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedOrg.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeBadge(selectedOrg.type).bg} ${getTypeBadge(selectedOrg.type).text}`}>
                    {getTypeBadge(selectedOrg.type).label}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">联系人</p>
                  <p className="text-gray-800">{selectedOrg.contact}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">联系电话</p>
                  <p className="text-gray-800 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {selectedOrg.phone}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">学员数量</p>
                  <p className="text-2xl font-bold text-primary-600">{selectedOrg.students}人</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">认证状态</p>
                  {selectedOrg.verified ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success-600" />
                      <span className="text-success-700 font-medium">已认证</span>
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-warning-100 text-warning-700 rounded-full text-sm font-medium">
                      待审核
                    </span>
                  )}
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
                    handleManage(selectedOrg);
                    handleCloseDetails();
                  }}
                >
                  {selectedOrg.verified ? '管理' : '审核'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
