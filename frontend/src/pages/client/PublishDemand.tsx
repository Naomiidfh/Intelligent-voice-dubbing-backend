import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wand2, Loader2, Check } from 'lucide-react';
import Button from '@/components/Button';
import { BookOpen, Film, Heart, FileText } from 'lucide-react';
import { useClientStore } from '@/stores/clientStore';
import { useTaskStore } from '@/stores/taskStore';
import { processManuscript, Sentence } from '@/utils/pinyin';

const STEPS = ['选择类型', '填写内容', '设置预算', '确认发布'];

const TASK_TYPES = [
  { id: 'children_book', label: '童书配音', icon: <BookOpen className="w-8 h-8" />, desc: '儿童故事、童话等' },
  { id: 'picture_book', label: '绘本朗读', icon: <FileText className="w-8 h-8" />, desc: '图文绘本、有声书' },
  { id: 'documentary', label: '纪录片', icon: <Film className="w-8 h-8" />, desc: '纪录片、企业宣传片' },
  { id: 'charity', label: '公益广告', icon: <Heart className="w-8 h-8" />, desc: '公益广告、宣传片' }
];

const STYLES = ['旁白', '对话', '朗读', '讲述', '配音'];

export default function PublishDemand() {
  const navigate = useNavigate();
  const { currentClient, isLoggedIn } = useClientStore();
  const { createTask, isLoading } = useTaskStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [taskType, setTaskType] = useState('');
  const [content, setContent] = useState('');
  const [processedSentences, setProcessedSentences] = useState<Sentence[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [style, setStyle] = useState<string[]>([]);
  const [budget, setBudget] = useState(100);
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/client/login');
    }
  }, [isLoggedIn, navigate]);

  const handleContentChange = (value: string) => {
    setContent(value);
    
    if (value.length > 10) {
      setIsProcessing(true);
      setTimeout(() => {
        const sentences = processManuscript(value);
        setProcessedSentences(sentences);
        setIsProcessing(false);
      }, 500);
    } else {
      setProcessedSentences([]);
    }
  };

  const canNext = () => {
    switch (currentStep) {
      case 0: return !!taskType;
      case 1: return content.length > 0;
      case 2: return budget > 0 && deadline;
      default: return true;
    }
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      if (!currentClient?.id) {
        alert('请先登录');
        navigate('/client/login');
        return;
      }
      
      try {
        await createTask({
          client_id: currentClient.id,
          task_type: taskType,
          content: content,
          styles: style,
          budget: budget,
          deadline: deadline
        });
        alert('需求发布成功，等待平台审核');
        navigate('/client/orders');
      } catch (error: any) {
        alert(error.message || '发布失败，请重试');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/client/home');
    }
  };

  const toggleStyle = (s: string) => {
    setStyle(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="grid grid-cols-2 gap-4">
            {TASK_TYPES.map((type) => (
              <div
                key={type.id}
                onClick={() => setTaskType(type.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  taskType === type.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 ${
                  taskType === type.id ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {type.icon}
                </div>
                <h4 className="font-bold text-gray-800">{type.label}</h4>
                <p className="text-sm text-gray-500 mt-1">{type.desc}</p>
              </div>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">文稿内容</label>
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="请粘贴或输入配音文稿内容..."
                className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">字数：{content.length}</p>
                {isProcessing && (
                  <div className="flex items-center gap-2 text-sm text-primary-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>正在智能分句...</span>
                  </div>
                )}
              </div>
            </div>
            
            {processedSentences.length > 0 && (
              <div className="bg-gradient-to-r from-primary-50 to-success-50 border-2 border-primary-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wand2 className="w-5 h-5 text-primary-600" />
                  <h4 className="font-bold text-gray-800">智能分句结果</h4>
                  <span className="text-sm text-gray-500">（共 {processedSentences.length} 句）</span>
                </div>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {processedSentences.map((sentence, index) => (
                    <div key={sentence.id} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium leading-relaxed mb-1">
                            {sentence.text}
                          </p>
                          {sentence.pinyin && (
                            <p className="text-sm text-gray-500 italic">
                              {sentence.pinyin}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  系统已自动分句并生成拼音，可根据需要调整
                </p>
              </div>
            )}
            
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">配音风格</label>
              <div className="flex flex-wrap gap-2">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleStyle(s)}
                    className={`px-4 py-2 rounded-full transition-all ${
                      style.includes(s)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block font-medium text-gray-700 mb-2">预算金额（元）</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="flex-1"
                />
                <div className="w-24 text-center">
                  <span className="text-2xl font-bold text-primary-600">¥{budget}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">交付时间</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400"
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-700 mb-2">费用说明</h4>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• 预算将作为配音员酬劳参考</li>
                <li>• 实际费用根据完成质量浮动</li>
                <li>• 审核通过后费用冻结，完成后结算</li>
              </ul>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="font-medium text-gray-700 mb-3">需求预览</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">任务类型</span>
                  <span className="font-medium">{TASK_TYPES.find(t => t.id === taskType)?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">文稿字数</span>
                  <span className="font-medium">{content.length} 字</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">配音风格</span>
                  <span className="font-medium">{style.join('、') || '未选择'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">预算金额</span>
                  <span className="font-bold text-primary-600">¥{budget}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">交付时间</span>
                  <span className="font-medium">{deadline || '未设置'}</span>
                </div>
              </div>
            </div>
            <div className="bg-primary-50 rounded-xl p-4 border border-primary-200">
              <p className="text-primary-700 text-sm">
                提交后需平台审核，审核通过后任务将上架至任务广场
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isLoggedIn || !currentClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">请先登录...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">发布需求</h1>
          </div>
          <div className="flex">
            {STEPS.map((step, index) => (
              <div key={step} className="flex-1 flex items-center">
                <div className={`flex-1 flex items-center ${index < STEPS.length - 1 ? 'justify-end' : 'justify-start'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                </div>
                {index < STEPS.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded ${
                    index < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">{STEPS[currentStep]}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {renderStepContent()}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button onClick={handleBack} variant="outline" size="lg" className="flex-1">
                上一步
              </Button>
            )}
            <Button
              onClick={handleNext}
              variant="primary"
              size="lg"
              className="flex-1"
              disabled={!canNext() || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  处理中...
                </span>
              ) : currentStep === 3 ? '确认发布' : '下一步'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
