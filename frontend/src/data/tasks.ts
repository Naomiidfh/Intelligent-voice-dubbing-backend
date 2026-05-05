import { Task } from '@/types';

export const mockTasks: Task[] = [
  {
    id: 'task-001',
    title: '《小兔子找朋友》儿童故事',
    type: 'children_book',
    price: 80,
    wordCount: 1200,
    difficulty: 1,
    requiredLevel: 1,
    deadline: '2026-05-15',
    status: 'available',
    content: '森林里住着一只小兔子，它很想找到好朋友。',
    sentences: [
      { id: 1, text: '森林里住着一只小兔子，它很想找到好朋友。', pinyin: 'sēn lín lǐ zhù zhe yī zhī xiǎo tù zi, tā hěn xiǎng zhǎo dào hǎo péng yǒu.' },
      { id: 2, text: '小兔子走啊走，遇到了一只小松鼠。', pinyin: 'xiǎo tù zi zǒu a zǒu, yù dào le yī zhī xiǎo sōng shǔ.' },
      { id: 3, text: '你好呀！我是小兔子，我们可以做朋友吗？', pinyin: 'nǐ hǎo ya! wǒ shì xiǎo tù zi, wǒ men kě yǐ zuò péng yǒu ma?' },
      { id: 4, text: '小松鼠高兴地说：当然可以呀！', pinyin: 'xiǎo sōng shǔ gāo xìng de shuō: dāng rán kě yǐ ya!' },
      { id: 5, text: '从此，小兔子和小松鼠成了最好的朋友。', pinyin: 'cóng cǐ, xiǎo tù zi hé xiǎo sōng shǔ chéng le zuì hǎo de péng yǒu.' }
    ]
  },
  {
    id: 'task-002',
    title: '《勇敢的小蜗牛》绘本配音',
    type: 'picture_book',
    price: 120,
    wordCount: 1800,
    difficulty: 2,
    requiredLevel: 2,
    deadline: '2026-05-20',
    status: 'available',
    content: '小蜗牛住在花园里，它总是觉得自己爬得太慢了。',
    sentences: [
      { id: 1, text: '小蜗牛住在花园里，它总是觉得自己爬得太慢了。', pinyin: 'xiǎo wō niú zhù zài huā yuán lǐ, tā zǒng shì jué de zì jǐ pá de tài màn le.' },
      { id: 2, text: '一天，小蜗牛决定去山顶看看。', pinyin: 'yī tiān, xiǎo wō niú jué dìng qù shān dǐng kàn kan.' },
      { id: 3, text: '路上，它遇到了很多困难，但它没有放弃。', pinyin: 'lù shàng, tā yù dào le hěn duō kùn nán, dàn tā méi yǒu fàng qì.' },
      { id: 4, text: '最后，小蜗牛终于爬到了山顶，看到了美丽的日出。', pinyin: 'zuì hòu, xiǎo wō niú zhōng yú pá dào le shān dǐng, kàn dào le měi lì de rì chū.' }
    ]
  },
  {
    id: 'task-003',
    title: '《大自然的声音》纪录片配音',
    type: 'documentary',
    price: 200,
    wordCount: 2500,
    difficulty: 3,
    requiredLevel: 3,
    deadline: '2026-05-25',
    status: 'available',
    content: '清晨的阳光洒在森林里，鸟儿开始欢快地歌唱。',
    sentences: [
      { id: 1, text: '清晨的阳光洒在森林里，鸟儿开始欢快地歌唱。', pinyin: 'qīng chén de yáng guāng sǎ zài sēn lín lǐ, niǎo ér kāi shǐ huān kuài de gē chàng.' },
      { id: 2, text: '小溪潺潺流淌，奏响美妙的音乐。', pinyin: 'xiǎo xī chán chán liú tǎng, zòu xiǎng měi miào de yīn yuè.' },
      { id: 3, text: '微风吹过树叶，发出沙沙的响声。', pinyin: 'wēi fēng chuī guò shù yè, fā chū shā shā de xiǎng shēng.' }
    ]
  },
  {
    id: 'task-004',
    title: '《关爱老人》公益广告',
    type: 'charity',
    price: 60,
    wordCount: 500,
    difficulty: 1,
    requiredLevel: 1,
    deadline: '2026-05-10',
    status: 'available',
    content: '关爱老人，从我们做起。',
    sentences: [
      { id: 1, text: '关爱老人，从我们做起。', pinyin: 'guān ài lǎo rén, cóng wǒ men zuò qǐ.' },
      { id: 2, text: '陪伴是最好的礼物，常回家看看。', pinyin: 'péi bàn shì zuì hǎo de lǐ wù, cháng huí jiā kàn kan.' }
    ]
  },
  {
    id: 'task-005',
    title: '《小白兔学画画》儿童故事',
    type: 'children_book',
    price: 100,
    wordCount: 1500,
    difficulty: 1,
    requiredLevel: 1,
    deadline: '2026-05-18',
    status: 'available',
    content: '小白兔很喜欢画画，它决定学习画美丽的花朵。',
    sentences: [
      { id: 1, text: '小白兔很喜欢画画，它决定学习画美丽的花朵。', pinyin: 'xiǎo bái tù hěn xǐ huān huà huà, tā jué dìng xué xí huà měi lì de huā duǒ.' },
      { id: 2, text: '它拿起画笔，认真地画了起来。', pinyin: 'tā ná qǐ huà bǐ, rèn zhēn de huà le qǐ lái.' },
      { id: 3, text: '红色的花、黄色的花、紫色的花，好漂亮啊！', pinyin: 'hóng sè de huā, huáng sè de huā, zǐ sè de huā, hǎo piào liang a!' }
    ]
  },
  {
    id: 'task-006',
    title: '《星星的故事》绘本朗读',
    type: 'picture_book',
    price: 150,
    wordCount: 2000,
    difficulty: 2,
    requiredLevel: 2,
    deadline: '2026-05-22',
    status: 'available',
    content: '在很远很远的天空中，住着无数闪闪发光的星星。',
    sentences: [
      { id: 1, text: '在很远很远的天空中，住着无数闪闪发光的星星。', pinyin: 'zài hěn yuǎn hěn yuǎn de tiān kōng zhōng, zhù zhe wú shù shǎn shǎn fā guāng de xīng xīng.' },
      { id: 2, text: '每颗星星都有自己的故事。', pinyin: 'měi kē xīng xīng dōu yǒu zì jǐ de gù shì.' },
      { id: 3, text: '有的星星在讲勇敢的故事，有的星星在讲善良的故事。', pinyin: 'yǒu de xīng xīng zài jiǎng yǒng gǎn de gù shì, yǒu de xīng xīng zài jiǎng shàn liáng de gù shì.' }
    ]
  },
  {
    id: 'task-007',
    title: '《森林防火》公益宣传',
    type: 'charity',
    price: 80,
    wordCount: 800,
    difficulty: 2,
    requiredLevel: 2,
    deadline: '2026-05-12',
    status: 'available',
    content: '森林防火，人人有责。让我们一起保护绿色家园。',
    sentences: [
      { id: 1, text: '森林防火，人人有责。', pinyin: 'sēn lín fáng huǒ, rén rén yǒu zé.' },
      { id: 2, text: '让我们一起保护绿色家园。', pinyin: 'ràng wǒ men yī qǐ bǎo hù lǜ sè jiā yuán.' }
    ]
  },
  {
    id: 'task-008',
    title: '《春天的故事》纪录片',
    type: 'documentary',
    price: 180,
    wordCount: 2200,
    difficulty: 3,
    requiredLevel: 3,
    deadline: '2026-05-28',
    status: 'available',
    content: '春天来了，大地苏醒，万物复苏。',
    sentences: [
      { id: 1, text: '春天来了，大地苏醒，万物复苏。', pinyin: 'chūn tiān lái le, dà dì sū xǐng, wàn wù fù sū.' },
      { id: 2, text: '小草从土里探出头来，花儿绽放出美丽的笑容。', pinyin: 'xiǎo cǎo cóng tǔ lǐ tàn chū tóu lái, huā ér zhàn fàng chū měi lì de xiào róng.' }
    ]
  }
];

export const getTaskById = (id: string): Task | undefined => {
  return mockTasks.find(task => task.id === id);
};

export const getTasksByType = (type: Task['type']): Task[] => {
  return mockTasks.filter(task => task.type === type);
};

export const getAvailableTasks = (userLevel: number): Task[] => {
  return mockTasks.filter(task => 
    task.requiredLevel <= userLevel && task.status === 'available'
  );
};
