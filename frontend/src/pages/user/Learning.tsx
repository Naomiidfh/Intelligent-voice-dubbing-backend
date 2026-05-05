import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoice } from '@/hooks/useVoice';
import { useUserStore } from '@/stores/userStore';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Play, CheckCircle, XCircle, BookOpen, Video, Award } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  duration: string;
  watched: boolean;
}

const LEARNING_VIDEOS: Video[] = [
  { id: 'v1', title: '配音基础入门', duration: '15分钟', watched: true },
  { id: 'v2', title: '语音语调练习', duration: '20分钟', watched: true },
  { id: 'v3', title: '情感表达技巧', duration: '18分钟', watched: false },
  { id: 'v4', title: '各类稿件配音要点', duration: '25分钟', watched: false }
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: '配音时，以下哪种说法是正确的？',
    options: [
      '读得越快越好',
      '要带有感情色彩',
      '不需要看稿子',
      '声音越小越好'
    ],
    correct: 1
  },
  {
    id: 2,
    question: '遇到生僻字时，应该怎么做？',
    options: [
      '直接跳过不读',
      '随便读一个音',
      '查看注音后再读',
      '用其他字代替'
    ],
    correct: 2
  },
  {
    id: 3,
    question: '录制过程中需要注意什么？',
    options: [
      '环境要安静',
      '可以边说话边吃东西',
      '不需要看稿子',
      '录完不需要检查'
    ],
    correct: 0
  }
];

export default function Learning() {
  const navigate = useNavigate();
  const { speak } = useVoice();
  const currentUser = useUserStore((state) => state.currentUser);
  const [videos, setVideos] = useState(LEARNING_VIDEOS);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const watchedCount = videos.filter(v => v.watched).length;
    const message = `学习测评页面，您已观看${watchedCount}个教学视频，${watchedCount === videos.length ? '可以参加测评' : '需看完所有视频才能测评'}`;
    speak(message);
  }, [videos, speak]);

  const allVideosWatched = videos.every(v => v.watched);

  const handleWatchVideo = (video: Video) => {
    speak(`正在播放：${video.title}，时长${video.duration}`);
    const updatedVideos = videos.map(v => 
      v.id === video.id ? { ...v, watched: true } : v
    );
    setVideos(updatedVideos);
  };

  const handleStartQuiz = () => {
    if (!allVideosWatched) {
      speak('请先观看所有教学视频');
      return;
    }
    setQuizStarted(true);
    speak('测评开始，请选择正确答案');
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      const nextQuestion = QUIZ_QUESTIONS[currentQuestion + 1];
      speak(`第${currentQuestion + 2}题：${nextQuestion.question}`);
    } else {
      const correctCount = newAnswers.filter((a, i) => a === QUIZ_QUESTIONS[i].correct).length;
      const finalScore = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);
      setScore(finalScore);
      const isPassed = finalScore >= 60;
      setPassed(isPassed);
      setQuizCompleted(true);
      speak(`测评完成，您的得分是${finalScore}分，${isPassed ? '恭喜您通过了测评' : '很遗憾未通过，请重新学习'}`);
    }
  };

  const handleReset = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
    setPassed(false);
  };

  const getLevelTitle = (level: number) => {
    const titles = ['初级学员', '入门学员', '进阶学员', '熟练学员', '专业学员'];
    return titles[level - 1] || '初级学员';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <Header title="学习测评" showBack={true} />

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        <Card variant="elevated">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">{getLevelTitle(currentUser?.abilityLevel || 1)}</h3>
              <p className="text-base text-gray-500">当前能力等级：{currentUser?.abilityLevel || 1}级</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CheckCircle className="w-4 h-4 text-success-500" />
            <span>完成测评可提升等级，解锁更多任务</span>
          </div>
        </Card>

        <Card variant="default">
          <div className="flex items-center gap-3 mb-4">
            <Video className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-bold text-gray-800">教学视频</h3>
            <span className="text-sm text-gray-400 ml-auto">
              已看 {videos.filter(v => v.watched).length}/{videos.length}
            </span>
          </div>
          <div className="space-y-3">
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <button
                  onClick={() => handleWatchVideo(video)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    video.watched
                      ? 'bg-success-100 text-success-600'
                      : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
                  }`}
                >
                  <Play className="w-6 h-6" />
                </button>
                <div className="flex-1">
                  <p className="text-lg font-medium text-gray-800">{video.title}</p>
                  <p className="text-sm text-gray-400">{video.duration}</p>
                </div>
                {video.watched && (
                  <CheckCircle className="w-6 h-6 text-success-500" />
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card variant="elevated">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-bold text-gray-800">能力测评</h3>
          </div>

          {!quizStarted && !quizCompleted && (
            <div className="text-center py-6">
              {!allVideosWatched ? (
                <>
                  <XCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-xl text-gray-500 mb-2">请先观看所有教学视频</p>
                  <p className="text-base text-gray-400">还需观看 {videos.filter(v => !v.watched).length} 个视频</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-10 h-10 text-success-600" />
                  </div>
                  <p className="text-xl text-gray-700 mb-4">您已完成所有学习</p>
                  <Button onClick={handleStartQuiz} variant="success" size="xl">
                    开始测评
                  </Button>
                </>
              )}
            </div>
          )}

          {quizStarted && !quizCompleted && (
            <div className="py-4">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg text-gray-600">
                  第 {currentQuestion + 1} / {QUIZ_QUESTIONS.length} 题
                </span>
                <span className="text-lg text-primary-600 font-bold">
                  {Math.round(((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-primary-500 transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                />
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-6">
                {QUIZ_QUESTIONS[currentQuestion].question}
              </p>
              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="w-full p-4 text-left text-lg font-medium bg-gray-50 hover:bg-primary-50 border-2 border-gray-200 hover:border-primary-300 rounded-xl transition-all"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizCompleted && (
            <div className="text-center py-6">
              <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
                passed ? 'bg-success-100' : 'bg-danger-100'
              }`}>
                {passed ? (
                  <CheckCircle className="w-12 h-12 text-success-600" />
                ) : (
                  <XCircle className="w-12 h-12 text-danger-600" />
                )}
              </div>
              <h3 className="text-3xl font-bold mb-2">
                {score} 分
              </h3>
              <p className={`text-xl mb-6 ${passed ? 'text-success-600' : 'text-danger-600'}`}>
                {passed ? '恭喜！测评通过' : '未通过，请重新学习'}
              </p>
              <div className="space-y-3">
                <Button
                  onClick={passed ? () => navigate('/user/home') : handleReset}
                  variant={passed ? 'success' : 'primary'}
                  size="lg"
                  fullWidth
                >
                  {passed ? '返回首页' : '重新测评'}
                </Button>
                {!passed && (
                  <Button onClick={() => navigate('/user/tasks')} variant="outline" size="md" fullWidth>
                    查看任务（保持当前等级）
                  </Button>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
