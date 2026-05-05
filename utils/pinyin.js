const PINYIN_MAP = {
  '啊': 'a', '阿': 'a', '爱': 'ai', '安': 'an', '暗': 'an',
  '把': 'ba', '八': 'ba', '巴': 'ba', '爸': 'ba', '吧': 'ba', '白': 'bai', '百': 'bai', '摆': 'bai', '败': 'bai',
  '班': 'ban', '半': 'ban', '办': 'ban', '帮': 'bang', '棒': 'bang', '包': 'bao', '保': 'bao', '报': 'bao',
  '北': 'bei', '被': 'bei', '备': 'bei', '背': 'bei', '倍': 'bei', '本': 'ben', '比': 'bi', '笔': 'bi',
  '边': 'bian', '变': 'bian', '便': 'bian', '别': 'bie', '病': 'bing', '冰': 'bing', '饼': 'bing',
  '不': 'bu', '步': 'bu', '部': 'bu', '布': 'bu',
  '才': 'cai', '彩': 'cai', '菜': 'cai', '参': 'can', '餐': 'can', '残': 'can', '草': 'cao',
  '测': 'ce', '层': 'ceng', '茶': 'cha', '查': 'cha', '产': 'chan', '常': 'chang', '场': 'chang',
  '唱': 'chang', '长': 'chang', '厂': 'chang', '超': 'chao', '朝': 'chao', '吵': 'chao', '车': 'che',
  '成': 'cheng', '城': 'cheng', '程': 'cheng', '吃': 'chi', '持': 'chi', '池': 'chi', '出': 'chu',
  '除': 'chu', '楚': 'chu', '处': 'chu', '穿': 'chuan', '传': 'chuan', '船': 'chuan', '窗': 'chuang',
  '床': 'chuang', '春': 'chun', '词': 'ci', '此': 'ci', '次': 'ci', '从': 'cong', '丛': 'cong',
  '粗': 'cu', '错': 'cuo', '大': 'da', '打': 'da', '带': 'dai', '代': 'dai', '待': 'dai',
  '单': 'dan', '但': 'dan', '蛋': 'dan', '当': 'dang', '刀': 'dao', '导': 'dao', '到': 'dao',
  '道': 'dao', '得': 'de', '的': 'de', '灯': 'deng', '等': 'deng', '低': 'di', '底': 'di',
  '地': 'di', '弟': 'di', '点': 'dian', '电': 'dian', '店': 'dian', '定': 'ding', '丢': 'diu',
  '东': 'dong', '冬': 'dong', '懂': 'dong', '动': 'dong', '冻': 'dong', '都': 'dou', '斗': 'dou',
  '读': 'du', '肚': 'du', '段': 'duan', '短': 'duan', '段': 'duan', '断': 'duan', '对': 'dui',
  '队': 'dui', '多': 'duo', '朵': 'duo', '躲': 'duo', '饿': 'e', '儿': 'er', '耳': 'er',
  '二': 'er', '发': 'fa', '法': 'fa', '翻': 'fan', '烦': 'fan', '反': 'fan', '饭': 'fan',
  '方': 'fang', '房': 'fang', '防': 'fang', '放': 'fang', '非': 'fei', '飞': 'fei', '费': 'fei',
  '分': 'fen', '份': 'fen', '粉': 'fen', '份': 'fen', '风': 'feng', '封': 'feng', '蜂': 'feng',
  '夫': 'fu', '服': 'fu', '父': 'fu', '付': 'fu', '附': 'fu', '复': 'fu', '该': 'gai',
  '改': 'gai', '干': 'gan', '感': 'gan', '刚': 'gang', '高': 'gao', '告': 'gao', '歌': 'ge',
  '个': 'ge', '给': 'gei', '跟': 'gen', '根': 'gen', '工': 'gong', '公': 'gong', '共': 'gong',
  '够': 'gou', '狗': 'gou', '古': 'gu', '故': 'gu', '瓜': 'gua', '挂': 'gua', '关': 'guan',
  '管': 'guan', '光': 'guang', '广': 'guang', '逛': 'guang', '贵': 'gui', '国': 'guo', '果': 'guo',
  '过': 'guo', '还': 'hai', '孩': 'hai', '海': 'hai', '害': 'hai', '汉': 'han', '号': 'hao',
  '好': 'hao', '号': 'hao', '喝': 'he', '河': 'he', '黑': 'hei', '很': 'hen', '红': 'hong',
  '后': 'hou', '候': 'hou', '厚': 'hou', '呼': 'hu', '湖': 'hu', '虎': 'hu', '护': 'hu',
  '户': 'hu', '花': 'hua', '化': 'hua', '画': 'hua', '话': 'hua', '华': 'hua', '划': 'hua',
  '坏': 'huai', '欢': 'huan', '环': 'huan', '换': 'huan', '黄': 'huang', '慌': 'huang', '皇': 'huang',
  '回': 'hui', '汇': 'hui', '会': 'hui', '绘': 'hui', '昏': 'hun', '活': 'huo', '火': 'huo',
  '或': 'huo', '货': 'huo', '获': 'huo', '机': 'ji', '鸡': 'ji', '积': 'ji', '基': 'ji',
  '级': 'ji', '极': 'ji', '季': 'ji', '继': 'ji', '纪': 'ji', '继': 'ji', '济': 'ji',
  '既': 'ji', '继': 'ji', '继': 'ji', '家': 'jia', '加': 'jia', '价': 'jia', '架': 'jia',
  '假': 'jia', '嫁': 'jia', '尖': 'jian', '间': 'jian', '肩': 'jian', '艰': 'jian', '简': 'jian',
  '见': 'jian', '件': 'jian', '建': 'jian', '剑': 'jian', '健': 'jian', '江': 'jiang', '讲': 'jiang',
  '奖': 'jiang', '降': 'jiang', '交': 'jiao', '郊': 'jiao', '教': 'jiao', '叫': 'jiao', '轿': 'jiao',
  '街': 'jie', '节': 'jie', '姐': 'jie', '解': 'jie', '借': 'jie', '届': 'jie', '金': 'jin',
  '今': 'jin', '仅': 'jin', '进': 'jin', '近': 'jin', '劲': 'jin', '尽': 'jin', '京': 'jing',
  '经': 'jing', '精': 'jing', '景': 'jing', '静': 'jing', '境': 'jing', '镜': 'jing', '九': 'jiu',
  '久': 'jiu', '酒': 'jiu', '旧': 'jiu', '就': 'jiu', '举': 'ju', '巨': 'ju', '具': 'ju',
  '剧': 'ju', '据': 'ju', '距': 'ju', '句': 'ju', '聚': 'ju', '决': 'jue', '觉': 'jue',
  '绝': 'jue', '开': 'kai', '看': 'kan', '康': 'kang', '考': 'kao', '靠': 'kao', '科': 'ke',
  '可': 'ke', '课': 'ke', '刻': 'ke', '客': 'ke', '空': 'kong', '恐': 'kong', '口': 'kou',
  '扣': 'kou', '苦': 'ku', '快': 'kuai', '块': 'kuai', '宽': 'kuan', '款': 'kuan', '困': 'kun',
  '拉': 'la', '落': 'la', '腊': 'la', '来': 'lai', '赖': 'lai', '蓝': 'lan', '兰': 'lan',
  '拦': 'lan', '栏': 'lan', '懒': 'lan', '烂': 'lan', '浪': 'lang', '老': 'lao', '乐': 'le',
  '了': 'le', '雷': 'lei', '累': 'lei', '冷': 'leng', '离': 'li', '里': 'li', '理': 'li',
  '礼': 'li', '力': 'li', '历': 'li', '立': 'li', '利': 'li', '连': 'lian', '脸': 'lian',
  '练': 'lian', '凉': 'liang', '两': 'liang', '亮': 'liang', '量': 'liang', '辆': 'liang', '林': 'lin',
  '临': 'lin', '邻': 'lin', '灵': 'ling', '零': 'ling', '领': 'ling', '另': 'ling', '留': 'liu',
  '流': 'liu', '六': 'liu', '龙': 'long', '楼': 'lou', '路': 'lu', '旅': 'lv', '绿': 'lv',
  '律': 'lv', '虑': 'lv', '率': 'lv', '妈': 'ma', '马': 'ma', '吗': 'ma', '麻': 'ma',
  '码': 'ma', '骂': 'ma', '忙': 'mang', '毛': 'mao', '冒': 'mao', '帽': 'mao', '么': 'me',
  '没': 'mei', '每': 'mei', '美': 'mei', '妹': 'mei', '门': 'men', '们': 'men', '梦': 'meng',
  '迷': 'mi', '米': 'mi', '面': 'mian', '民': 'min', '明': 'ming', '名': 'ming', '命': 'ming',
  '摸': 'mo', '模': 'mo', '母': 'mu', '木': 'mu', '墓': 'mu', '幕': 'mu', '拿': 'na',
  '哪': 'na', '那': 'na', '奶': 'nai', '男': 'nan', '南': 'nan', '难': 'nan', '呢': 'ne',
  '内': 'nei', '嫩': 'nen', '能': 'neng', '你': 'ni', '年': 'nian', '念': 'nian', '娘': 'niang',
  '鸟': 'niao', '您': 'nin', '牛': 'niu', '农': 'nong', '弄': 'nong', '暖': 'nuan', '女': 'nv',
  '挪': 'nuo', '怕': 'pa', '拍': 'pai', '排': 'pai', '派': 'pai', '盘': 'pan', '判': 'pan',
  '旁': 'pang', '跑': 'pao', '泡': 'pao', '朋': 'peng', '朋': 'peng', '棚': 'peng', '皮': 'pi',
  '片': 'pian', '骗': 'pian', '票': 'piao', '漂': 'piao', '飘': 'piao', '品': 'pin', '平': 'ping',
  '苹': 'ping', '评': 'ping', '凭': 'ping', '破': 'po', '迫': 'po', '坡': 'po', '普': 'pu',
  '七': 'qi', '期': 'qi', '其': 'qi', '奇': 'qi', '骑': 'qi', '起': 'qi', '气': 'qi',
  '汽': 'qi', '器': 'qi', '恰': 'qia', '恰': 'qia', '千': 'qian', '前': 'qian', '钱': 'qian',
  '浅': 'qian', '强': 'qiang', '墙': 'qiang', '抢': 'qiang', '悄': 'qiao', '桥': 'qiao', '巧': 'qiao',
  '敲': 'qiao', '悄': 'qiao', '壳': 'qiao', '且': 'qie', '切': 'qie', '茄': 'qie', '青': 'qing',
  '轻': 'qing', '清': 'qing', '晴': 'qing', '情': 'qing', '请': 'qing', '庆': 'qing', '穷': 'qiong',
  '秋': 'qiu', '求': 'qiu', '球': 'qiu', '区': 'qu', '去': 'qu', '取': 'qu', '趣': 'qu',
  '全': 'quan', '泉': 'quan', '犬': 'quan', '劝': 'quan', '却': 'que', '确': 'que', '群': 'qun',
  '然': 'ran', '燃': 'ran', '让': 'rang', '绕': 'rao', '热': 're', '人': 'ren', '认': 'ren',
  '任': 'ren', '日': 'ri', '容': 'rong', '线': 'rong', '肉': 'rou', '如': 'ru', '入': 'ru',
  '软': 'ruan', '锐': 'rui', '瑞': 'rui', '润': 'run', '若': 'ruo', '弱': 'ruo', '撒': 'sa',
  '洒': 'sa', '萨': 'sa', '三': 'san', '散': 'san', '桑': 'sang', '嗓': 'sang', '扫': 'sao',
  '色': 'se', '森': 'sen', '僧': 'seng', '杀': 'sha', '沙': 'sha', '纱': 'sha', '傻': 'sha',
  '啥': 'sha', '山': 'shan', '删': 'shan', '衫': 'shan', '闪': 'shan', '善': 'shan', '商': 'shang',
  '伤': 'shang', '上': 'shang', '尚': 'shang', '烧': 'shao', '少': 'shao', '绍': 'shao', '社': 'she',
  '舍': 'she', '射': 'she', '涉': 'she', '谁': 'shei', '深': 'shen', '什': 'shen', '神': 'shen',
  '审': 'shen', '肾': 'shen', '甚': 'shen', '生': 'sheng', '声': 'sheng', '升': 'sheng', '绳': 'sheng',
  '省': 'sheng', '胜': 'sheng', '剩': 'sheng', '师': 'shi', '失': 'shi', '施': 'shi', '狮': 'shi',
  '湿': 'shi', '诗': 'shi', '十': 'shi', '石': 'shi', '时': 'shi', '识': 'shi', '实': 'shi',
  '拾': 'shi', '食': 'shi', '史': 'shi', '使': 'shi', '始': 'shi', '驶': 'shi', '士': 'shi',
  '市': 'shi', '示': 'shi', '式': 'shi', '试': 'shi', '视': 'shi', '室': 'shi', '是': 'shi',
  '适': 'shi', '释': 'shi', '收': 'shou', '手': 'shou', '守': 'shou', '首': 'shou', '寿': 'shou',
  '受': 'shou', '兽': 'shou', '授': 'shou', '售': 'shou', '书': 'shu', '术': 'shu', '树': 'shu',
  '竖': 'shu', '数': 'shu', '双': 'shuang', '爽': 'shuang', '谁': 'shui', '水': 'shui', '睡': 'shui',
  '顺': 'shun', '说': 'shuo', '思': 'si', '私': 'si', '司': 'si', '丝': 'si', '死': 'si',
  '四': 'si', '寺': 'si', '已': 'si', '松': 'song', '送': 'song', '颂': 'song', '搜': 'sou',
  '苏': 'su', '俗': 'su', '诉': 'su', '速': 'su', '素': 'su', '宿': 'su', '酸': 'suan',
  '算': 'suan', '虽': 'sui', '随': 'sui', '岁': 'sui', '碎': 'sui', '孙': 'sun', '损': 'sun',
  '所': 'suo', '索': 'suo', '锁': 'suo', '他': 'ta', '她': 'ta', '它': 'ta', '塔': 'ta',
  '抬': 'tai', '太': 'tai', '态': 'tai', '台': 'tai', '态': 'tai', '谈': 'tan', '弹': 'tan',
  '坦': 'tan', '叹': 'tan', '探': 'tan', '汤': 'tang', '糖': 'tang', '躺': 'tang', '趟': 'tang',
  '逃': 'tao', '桃': 'tao', '淘': 'tao', '讨': 'tao', '套': 'tao', '特': 'te', '疼': 'teng',
  '踢': 'ti', '提': 'ti', '题': 'ti', '体': 'ti', '替': 'ti', '天': 'tian', '田': 'tian',
  '甜': 'tian', '填': 'tian', '跳': 'tiao', '贴': 'tie', '铁': 'tie', '厅': 'ting', '听': 'ting',
  '停': 'ting', '庭': 'ting', '通': 'tong', '同': 'tong', '桐': 'tong', '铜': 'tong', '童': 'tong',
  '统': 'tong', '痛': 'tong', '头': 'tou', '投': 'tou', '透': 'tou', '突': 'tu', '图': 'tu',
  '土': 'tu', '团': 'tuan', '推': 'tui', '腿': 'tui', '退': 'tui', '吞': 'tun', '托': 'tuo',
  '拖': 'tuo', '挖': 'wa', '娃': 'wa', '瓦': 'wa', '袜': 'wa', '外': 'wai', '弯': 'wan',
  '湾': 'wan', '完': 'wan', '玩': 'wan', '晚': 'wan', '万': 'wan', '王': 'wang', '往': 'wang',
  '网': 'wang', '忘': 'wang', '望': 'wang', '危': 'wei', '微': 'wei', '为': 'wei', '围': 'wei',
  '维': 'wei', '伟': 'wei', '尾': 'wei', '未': 'wei', '位': 'wei', '味': 'wei', '卫': 'wei',
  '温': 'wen', '文': 'wen', '问': 'wen', '我': 'wo', '卧': 'wo', '握': 'wo', '屋': 'wu',
  '无': 'wu', '五': 'wu', '午': 'wu', '舞': 'wu', '物': 'wu', '务': 'wu', '误': 'wu',
  '西': 'xi', '吸': 'xi', '希': 'xi', '息': 'xi', '稀': 'xi', '息': 'xi', '洗': 'xi',
  '喜': 'xi', '系': 'xi', '戏': 'xi', '细': 'xi', '夏': 'xia', '下': 'xia', '吓': 'xia',
  '先': 'xian', '仙': 'xian', '纤': 'xian', '咸': 'xian', '衔': 'xian', '闲': 'xian', '显': 'xian',
  '现': 'xian', '线': 'xian', '限': 'xian', '县': 'xian', '想': 'xiang', '向': 'xiang', '象': 'xiang',
  '像': 'xiang', '项': 'xiang', '相': 'xiang', '香': 'xiang', '箱': 'xiang', '详': 'xiang', '想': 'xiang',
  '响': 'xiang', '想': 'xiang', '享': 'xiang', '小': 'xiao', '晓': 'xiao', '孝': 'xiao', '校': 'xiao',
  '笑': 'xiao', '效': 'xiao', '些': 'xie', '歇': 'xie', '协': 'xie', '斜': 'xie', '写': 'xie',
  '谢': 'xie', '解': 'xie', '心': 'xin', '辛': 'xin', '新': 'xin', '信': 'xin', '兴': 'xing',
  '星': 'xing', '行': 'xing', '形': 'xing', '醒': 'xing', '姓': 'xing', '性': 'xing', '凶': 'xiong',
  '胸': 'xiong', '熊': 'xiong', '休': 'xiu', '修': 'xiu', '羞': 'xiu', '秀': 'xiu', '袖': 'xiu',
  '需': 'xu', '虚': 'xu', '须': 'xu', '许': 'xu', '续': 'xu', '宣': 'xuan', '悬': 'xuan',
  '选': 'xuan', '旋': 'xuan', '雪': 'xue', '血': 'xue', '寻': 'xun', '巡': 'xun', '询': 'xun',
  '循': 'xun', '迅': 'xun', '压': 'ya', '呀': 'ya', '鸭': 'ya', '牙': 'ya', '芽': 'ya',
  '呀': 'ya', '哑': 'ya', '亚': 'ya', '研': 'yan', '言': 'yan', '岩': 'yan', '炎': 'yan',
  '沿': 'yan', '眼': 'yan', '演': 'yan', '阳': 'yang', '养': 'yang', '羊': 'yang', '洋': 'yang',
  '仰': 'yang', '氧': 'yang', '样': 'yang', '要': 'yao', '腰': 'yao', '摇': 'yao', '药': 'yao',
  '爷': 'ye', '也': 'ye', '夜': 'ye', '页': 'ye', '业': 'ye', '叶': 'ye', '一': 'yi',
  '医': 'yi', '衣': 'yi', '依': 'yi', '仪': 'yi', '姨': 'yi', '移': 'yi', '遗': 'yi',
  '疑': 'yi', '已': 'yi', '以': 'yi', '意': 'yi', '易': 'yi', '益': 'yi', '义': 'yi',
  '亿': 'yi', '忆': 'yi', '艺': 'yi', '议': 'yi', '译': 'yi', '异': 'yi', '因': 'yin',
  '音': 'yin', '银': 'yin', '引': 'yin', '印': 'yin', '应': 'ying', '英': 'ying', '鹰': 'ying',
  '樱': 'ying', '迎': 'ying', '影': 'ying', '映': 'ying', '硬': 'ying', '用': 'yong', '勇': 'yong',
  '涌': 'yong', '永': 'yong', '泳': 'yong', '勇': 'yong', '涌': 'yong', '由': 'you', '油': 'you',
  '游': 'you', '友': 'you', '有': 'you', '又': 'you', '右': 'you', '幼': 'you', '于': 'yu',
  '鱼': 'yu', '雨': 'yu', '与': 'yu', '语': 'yu', '预': 'yu', '域': 'yu', '欲': 'yu',
  '遇': 'yu', '育': 'yu', '元': 'yuan', '原': 'yuan', '园': 'yuan', '圆': 'yuan', '员': 'yuan',
  '袁': 'yuan', '园': 'yuan', '远': 'yuan', '院': 'yuan', '愿': 'yuan', '月': 'yue', '约': 'yue',
  '越': 'yue', '跃': 'yue', '阅': 'yue', '云': 'yun', '允': 'yun', '运': 'yun', '韵': 'yun',
  '杂': 'za', '咱': 'zan', '暂': 'zan', '脏': 'zang', '早': 'zao', '枣': 'zao', '怎': 'zen',
  '曾': 'zeng', '扎': 'zha', '眨': 'zha', '炸': 'zha', '渣': 'zha', '闸': 'zha', '栅': 'zha',
  '榨': 'zha', '摘': 'zhai', '宅': 'zhai', '窄': 'zhai', '债': 'zhai', '寨': 'zhai', '站': 'zhan',
  '战': 'zhan', '张': 'zhang', '掌': 'zhang', '丈': 'zhang', '涨': 'zhang', '障': 'zhang', '招': 'zhao',
  '找': 'zhao', '召': 'zhao', '照': 'zhao', '者': 'zhe', '这': 'zhe', '着': 'zhe', '折': 'zhe',
  '哲': 'zhe', '真': 'zhen', '针': 'zhen', '振': 'zhen', '震': 'zhen', '镇': 'zhen', '阵': 'zhen',
  '争': 'zheng', '正': 'zheng', '政': 'zheng', '证': 'zheng', '郑': 'zheng', '症': 'zheng', '支': 'zhi',
  '枝': 'zhi', '知': 'zhi', '织': 'zhi', '执': 'zhi', '直': 'zhi', '值': 'zhi', '植': 'zhi',
  '止': 'zhi', '只': 'zhi', '纸': 'zhi', '指': 'zhi', '至': 'zhi', '志': 'zhi', '治': 'zhi',
  '质': 'zhi', '致': 'zhi', '制': 'zhi', '智': 'zhi', '置': 'zhi', '中': 'zhong', '忠': 'zhong',
  '终': 'zhong', '钟': 'zhong', '种': 'zhong', '重': 'zhong', '众': 'zhong', '州': 'zhou', '周': 'zhou',
  '洲': 'zhou', '粥': 'zhou', '粥': 'zhou', '轴': 'zhou', '肘': 'zhou', '皱': 'zhou', '骤': 'zhou',
  '竹': 'zhu', '逐': 'zhu', '主': 'zhu', '住': 'zhu', '助': 'zhu', '注': 'zhu', '祝': 'zhu',
  '柱': 'zhu', '驻': 'zhu', '著': 'zhu', '筑': 'zhu', '抓': 'zhua', '爪': 'zhua', '专': 'zhuan',
  '转': 'zhuan', '赚': 'zhuan', '桩': 'zhuang', '装': 'zhuang', '壮': 'zhuang', '撞': 'zhuang', '追': 'zhui',
  '准': 'zhun', '捉': 'zhuo', '桌': 'zhuo', '卓': 'zhuo', '浊': 'zhuo', '着': 'zhuo', '资': 'zi',
  '子': 'zi', '自': 'zi', '字': 'zi', '紫': 'zi', '仔': 'zi', '姿': 'zi', '兹': 'zi',
  '宗': 'zong', '棕': 'zong', '总': 'zong', '纵': 'zong', '走': 'zou', '租': 'zu', '足': 'zu',
  '组': 'zu', '祖': 'zu', '阻': 'zu', '组': 'zu', '最': 'zui', '罪': 'zui', '醉': 'zui',
  '尊': 'zun', '遵': 'zun', '昨': 'zuo', '左': 'zuo', '作': 'zuo', '坐': 'zuo', '座': 'zuo',
  '做': 'zuo', '柞': 'zuo', '做': 'zuo'
};

export function splitIntoSentences(text) {
  if (!text.trim()) return [];

  const sentenceEndings = /([。！？.!?]+)/g;
  const parts = text.split(sentenceEndings);

  const sentences = [];
  let current = '';

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;

    current += part;

    if (sentenceEndings.test(part) || i === parts.length - 1) {
      if (current.trim()) {
        sentences.push(current.trim());
      }
      current = '';
    }
  }

  if (current.trim()) {
    sentences.push(current.trim());
  }

  return sentences;
}

export function textToPinyin(text) {
  let pinyin = '';

  for (const char of text) {
    if (char.trim() === '') {
      pinyin += ' ';
      continue;
    }

    if (PINYIN_MAP[char]) {
      pinyin += PINYIN_MAP[char] + ' ';
    } else if (/[a-zA-Z]/.test(char)) {
      pinyin += char + ' ';
    } else if (/[0-9]/.test(char)) {
      pinyin += char + ' ';
    } else if (/[，。！？、；：""''（）【】《》]/.test(char)) {
      pinyin += ' ';
    } else {
      pinyin += char + ' ';
    }
  }

  return pinyin.trim();
}

export function processManuscript(text) {
  const sentences = splitIntoSentences(text);

  return sentences.map((sentence, index) => ({
    id: index + 1,
    text: sentence,
    pinyin: textToPinyin(sentence)
  }));
}
