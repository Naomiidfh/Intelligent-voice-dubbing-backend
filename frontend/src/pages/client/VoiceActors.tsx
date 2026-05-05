import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Heart, Filter, Star, Users } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { VoiceActor } from '@/types';

const mockActors: VoiceActor[] = [
  { id: '1', name: '王小明', level: 2, completedOrders: 5, style: ['儿童故事', '绘本朗读'], available: true },
  { id: '2', name: '张小华', level: 3, completedOrders: 8, style: ['纪录片', '公益广告'], available: true },
  { id: '3', name: '李小红', level: 1, completedOrders: 2, style: ['简单对话'], available: true },
  { id: '4', name: '陈大力', level: 4, completedOrders: 12, style: ['纪录片', '配音'], available: false },
  { id: '5', name: '赵美丽', level: 2, completedOrders: 4, style: ['绘本朗读'], available: true }
];

const STYLES = ['全部', '儿童故事', '绘本朗读', '纪录片', '公益广告', '配音'];

export default function VoiceActors() {
  const navigate = useNavigate();
  const [actors] = useState(mockActors);
  const [selectedStyle, setSelectedStyle] = useState('全部');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filteredActors = selectedStyle === '全部' 
    ? actors 
    : actors.filter(a => a.style.includes(selectedStyle));

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handlePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const getLevelLabel = (level: number) => ['初级', '入门', '进阶', '熟练', '专业'][level - 1];

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate('/client/home')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">配音员库</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto">
            {STYLES.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedStyle === style
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-500">共 {filteredActors.length} 位配音员</p>
          <button className="flex items-center gap-2 text-primary-600">
            <Filter className="w-4 h-4" />
            更多筛选
          </button>
        </div>

        {filteredActors.map((actor) => (
          <Card key={actor.id} variant="elevated">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {actor.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-800">{actor.name}</h3>
                  <span className="px-2 py-0.5 bg-primary-100 text-primary-600 text-xs rounded-full">
                    {getLevelLabel(actor.level)}
                  </span>
                  {!actor.available && (
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-500 text-xs rounded-full">
                      忙碌中
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  已完成 {actor.completedOrders} 单
                </p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {actor.style.map((s) => (
                    <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => toggleFavorite(actor.id)}
                className={`p-2 rounded-full ${favorites.includes(actor.id) ? 'text-danger-500' : 'text-gray-400'}`}
              >
                <Heart className={`w-6 h-6 ${favorites.includes(actor.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handlePlay(actor.id)}
                className={`flex-1 py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                  playingId === actor.id
                    ? 'bg-primary-100 text-primary-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Play className="w-4 h-4" />
                {playingId === actor.id ? '暂停样音' : '试听样音'}
              </button>
              <Button
                variant="primary"
                size="md"
                disabled={!actor.available}
                className="flex-1"
              >
                指定派单
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
