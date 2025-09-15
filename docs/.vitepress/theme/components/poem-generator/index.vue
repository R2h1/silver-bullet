<template>
  <div class="poem-generator">
    <div class="tool-header">
      <h2><i class="fas fa-feather-alt"></i> 诗词生成器</h2>
      <p>探索中华诗词之美，生成古典与现代交融的诗句</p>
    </div>

    <div class="tool-body">
      <div class="controls-section">
        <div class="style-selector">
          <label>选择体裁</label>
          <div class="style-buttons">
            <button 
              v-for="style in poetryStyles" 
              :key="style.id" 
              :class="{ active: selectedStyle === style.id }" 
              @click="selectStyle(style.id)"
            >
              {{ style.name }}
            </button>
          </div>
        </div>

        <div class="theme-selector" v-if="selectedStyle">
          <label>选择主题</label>
          <div class="theme-buttons">
            <button 
              v-for="theme in getThemesForStyle(selectedStyle)" 
              :key="theme" 
              :class="{ active: selectedTheme === theme }" 
              @click="selectTheme(theme)"
            >
              {{ theme }}
            </button>
          </div>
        </div>

        <div class="options-group" v-if="selectedStyle === 'ci'">
          <label>选择词牌</label>
          <select v-model="selectedCipai">
            <option v-for="cipai in cipaiList" :key="cipai" :value="cipai">
              {{ cipai }}
            </option>
          </select>
        </div>

        <div class="options-group">
          <label>生成选项</label>
          <div class="generation-options">
            <label>
              <input type="checkbox" v-model="useClassicalLanguage"> 使用古典词汇
            </label>
            <label>
              <input type="checkbox" v-model="includeExplanation"> 包含赏析
            </label>
            <label>
              <input type="number" v-model="generateCount" min="1" max="5"> 生成数量
            </label>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="generatePoem" class="generate-btn">
            <i class="fas fa-magic"></i> 生成诗词
          </button>
          <button @click="speakPoem" :disabled="!currentPoem" class="speak-btn">
            <i class="fas fa-volume-up"></i> 朗读
          </button>
          <button @click="copyPoem" :disabled="!currentPoem" class="copy-btn">
            <i class="fas fa-copy"></i> 复制
          </button>
          <button @click="savePoem" :disabled="!currentPoem" class="save-btn">
            <i class="fas fa-heart"></i> 收藏
          </button>
        </div>
      </div>

      <div class="result-section" v-if="currentPoem">
        <div class="poem-display">
          <h3 class="poem-title">{{ currentPoem.title }}</h3>
          <div class="poem-author" v-if="currentPoem.author">——{{ currentPoem.author }}</div>
          
          <div class="poem-content" :class="selectedStyle">
            <div 
              v-for="(line, index) in currentPoem.content" 
              :key="index" 
              class="poem-line"
            >
              {{ line }}
            </div>
          </div>

          <div class="poem-explanation" v-if="currentPoem.explanation && includeExplanation">
            <h4>赏析</h4>
            <p>{{ currentPoem.explanation }}</p>
          </div>

          <div class="poem-meta">
            <span class="poem-style">{{ getStyleName(selectedStyle) }}</span>
            <span class="poem-theme">{{ selectedTheme }}</span>
            <span class="poem-date">{{ currentDate }}</span>
          </div>
        </div>
      </div>

      <div class="examples-section">
        <h3>诗词范例</h3>
        <div class="examples-grid">
          <div 
            v-for="(example, index) in examplePoems" 
            :key="index" 
            class="example-card"
            @click="loadExample(example)"
          >
            <div class="example-title">{{ example.title }}</div>
            <div class="example-author">{{ example.author }}</div>
            <div class="example-preview">
              {{ example.content.slice(0, 2).join('，') }}...
            </div>
            <div class="example-style">{{ getStyleName(example.style) }}</div>
          </div>
        </div>
      </div>

      <div class="knowledge-section">
        <h3>诗词知识</h3>
        <div class="knowledge-tabs">
          <button 
            v-for="tab in knowledgeTabs" 
            :key="tab.id" 
            :class="{ active: activeTab === tab.id }" 
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>

        <div class="knowledge-content">
          <div v-if="activeTab === 'history'" class="tab-content">
            <h4>中国诗词发展史</h4>
            <p>中国诗词有着三千多年的历史，经历了多个发展阶段：</p>
            <ul>
              <li><strong>先秦时期</strong>：《诗经》是中国最早的诗歌总集，收集了西周初年至春秋中叶的诗歌。</li>
              <li><strong>汉代</strong>：乐府诗盛行，代表作为《孔雀东南飞》。</li>
              <li><strong>魏晋南北朝</strong>：五言诗成熟，陶渊明开创田园诗派。</li>
              <li><strong>唐代</strong>：诗歌黄金时代，李白、杜甫、白居易等大家辈出。</li>
              <li><strong>宋代</strong>：词的发展达到顶峰，苏轼、李清照、辛弃疾等名家云集。</li>
              <li><strong>元明清</strong>：戏曲和散曲发展，诗词继续传承创新。</li>
            </ul>
          </div>

          <div v-if="activeTab === 'rules'" class="tab-content">
            <h4>诗词格律基础</h4>
            <div class="rules-grid">
              <div class="rule-item">
                <h5>五言绝句</h5>
                <p>每句5字，共4句。平仄相间，押韵严格。</p>
                <pre>
平平仄仄平
仄仄仄平平
仄仄平平仄
平平仄仄平</pre>
              </div>
              <div class="rule-item">
                <h5>七言律诗</h5>
                <p>每句7字，共8句。中间两联需对仗。</p>
                <pre>
平平仄仄仄平平
仄仄平平仄仄平
仄仄平平平仄仄
平平仄仄仄平平
平平仄仄平平仄
仄仄平平仄仄平
仄仄平平平仄仄
平平仄仄仄平平</pre>
              </div>
              <div class="rule-item">
                <h5>词牌规则</h5>
                <p>每种词牌有固定格律，包括字数、平仄和押韵要求。</p>
                <p>如《浣溪沙》共42字，上片三平韵，下片两平韵。</p>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'terms'" class="tab-content">
            <h4>诗词术语解释</h4>
            <div class="terms-grid">
              <div class="term-item">
                <h5>平仄</h5>
                <p>平声和仄声的合称。平声指平直的音调，仄声指曲折的音调。</p>
              </div>
              <div class="term-item">
                <h5>押韵</h5>
                <p>诗句末尾使用相同或相近韵母的字，使诗歌朗朗上口。</p>
              </div>
              <div class="term-item">
                <h5>对仗</h5>
                <p>诗句中相应位置的词语在词性、意义上相互对应。</p>
              </div>
              <div class="term-item">
                <h5>意象</h5>
                <p>诗歌中融入作者主观情感的客观物象。</p>
              </div>
              <div class="term-item">
                <h5>意境</h5>
                <p>诗歌中情景交融、虚实相生的艺术境界。</p>
              </div>
              <div class="term-item">
                <h5>词牌</h5>
                <p>词的格式名称，规定词的字数、句数、平仄和押韵。</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="collection-section" v-if="collectedPoems.length > 0">
        <h3>我的收藏</h3>
        <div class="collection-list">
          <div 
            v-for="(poem, index) in collectedPoems" 
            :key="index" 
            class="collection-item"
          >
            <div class="collection-content">
              <h4>{{ poem.title }}</h4>
              <p>{{ poem.content.slice(0, 2).join('，') }}...</p>
              <span class="collection-date">{{ formatDate(poem.date) }}</span>
            </div>
            <button @click="removeFromCollection(index)" class="remove-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PoemGenerator',
  data() {
    return {
      selectedStyle: 'wujue',
      selectedTheme: '山水',
      selectedCipai: '浣溪沙',
      useClassicalLanguage: true,
      includeExplanation: true,
      generateCount: 1,
      currentPoem: null,
      activeTab: 'history',
      collectedPoems: [],
      poetryStyles: [
        { id: 'wujue', name: '五言绝句', themes: ['山水', '田园', '思乡', '离别', '咏物'] },
        { id: 'qijue', name: '七言绝句', themes: ['抒情', '咏史', '边塞', '四季', '感怀'] },
        { id: 'cilv', name: '七言律诗', themes: ['怀古', '抒情', '叙事', '议论', '写景'] },
        { id: 'ci', name: '词', themes: ['婉约', '豪放', '爱情', '闲适', '忧国'] }
      ],
      cipaiList: ['浣溪沙', '水调歌头', '念奴娇', '菩萨蛮', '蝶恋花', '清平乐', '如梦令', '满江红'],
      themes: {
        '山水': ['山', '水', '云', '雾', '峰', '涧', '溪', '林'],
        '田园': ['田', '园', '农', '耕', '牧', '渔', '桑', '麻'],
        '思乡': ['乡', '家', '归', '客', '旅', '愁', '思', '忆'],
        '离别': ['别', '离', '送', '泪', '舟', '亭', '柳', '酒'],
        '咏物': ['梅', '兰', '竹', '菊', '月', '风', '花', '雪'],
        '抒情': ['心', '情', '意', '绪', '感', '怀', '悲', '欢'],
        '咏史': ['古', '今', '史', '朝', '代', '帝', '王', '将'],
        '边塞': ['塞', '关', '戍', '征', '战', '戈', '马', '箭'],
        '四季': ['春', '夏', '秋', '冬', '暖', '热', '凉', '寒'],
        '感怀': ['人', '生', '世', '事', '命', '运', '时', '光'],
        '怀古': ['古', '迹', '址', '陵', '墓', '碑', '铭', '钟'],
        '叙事': ['事', '件', '遇', '见', '闻', '听', '说', '讲'],
        '议论': ['理', '道', '义', '是', '非', '对', '错', '评'],
        '写景': ['景', '色', '光', '影', '形', '声', '香', '味'],
        '婉约': ['柔', '婉', '约', '纤', '细', '微', '轻', '淡'],
        '豪放': ['豪', '放', '壮', '阔', '宏', '伟', '雄', '奇'],
        '爱情': ['爱', '情', '恋', '思', '慕', '念', '怨', '恨'],
        '闲适': ['闲', '适', '逸', '静', '安', '宁', '舒', '畅'],
        '忧国': ['国', '民', '社', '稷', '忧', '患', '兴', '亡']
      },
      classicalWords: [
        '阑干', '阡陌', '迤逦', '缱绻', '氤氲', '旖旎', '潋滟', '蹁跹',
        '婵娟', '璎珞', '琉璃', '翡翠', '玳瑁', '胭脂', '茱萸', '菡萏',
        '蒹葭', '荻花', '蓼蓝', '薜荔', '蘼芜', '薁李', '芰荷', '茝兰'
      ],
      examplePoems: [
        {
          title: '静夜思',
          author: '李白',
          style: 'wujue',
          content: ['床前明月光', '疑是地上霜', '举头望明月', '低头思故乡'],
          explanation: '这首诗通过明月与霜的比喻，表达了游子思乡之情。'
        },
        {
          title: '望庐山瀑布',
          author: '李白',
          style: 'qijue',
          content: ['日照香炉生紫烟', '遥看瀑布挂前川', '飞流直下三千尺', '疑是银河落九天'],
          explanation: '以夸张手法描绘庐山瀑布的壮丽景象，展现大自然的鬼斧神工。'
        },
        {
          title: '春望',
          author: '杜甫',
          style: 'cilv',
          content: ['国破山河在', '城春草木深', '感时花溅泪', '恨别鸟惊心', '烽火连三月', '家书抵万金', '白头搔更短', '浑欲不胜簪'],
          explanation: '此诗描写战乱中国破家亡的悲痛，表达诗人忧国忧民的情怀。'
        },
        {
          title: '水调歌头·明月几时有',
          author: '苏轼',
          style: 'ci',
          content: ['明月几时有', '把酒问青天', '不知天上宫阙', '今夕是何年'],
          explanation: '此词以明月为引，抒发对人生和宇宙的思考，表达豁达超脱的人生态度。'
        }
      ],
      knowledgeTabs: [
        { id: 'history', name: '诗词历史' },
        { id: 'rules', name: '格律规则' },
        { id: 'terms', name: '术语解释' }
      ]
    };
  },
  computed: {
    currentDate() {
      return new Date().toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  mounted() {
    this.loadCollection();
  },
  methods: {
    selectStyle(styleId) {
      this.selectedStyle = styleId;
      // 重置主题为第一个可选主题
      const style = this.poetryStyles.find(s => s.id === styleId);
      if (style && style.themes.length > 0) {
        this.selectedTheme = style.themes[0];
      }
    },
    selectTheme(theme) {
      this.selectedTheme = theme;
    },
    getThemesForStyle(styleId) {
      const style = this.poetryStyles.find(s => s.id === styleId);
      return style ? style.themes : [];
    },
    getStyleName(styleId) {
      const style = this.poetryStyles.find(s => s.id === styleId);
      return style ? style.name : '';
    },
    generatePoem() {
      // 根据选择的体裁和主题生成诗词
      let content = [];
      let title = '';
      
      switch (this.selectedStyle) {
        case 'wujue':
          content = this.generateWujue();
          title = `${this.selectedTheme}·五绝`;
          break;
        case 'qijue':
          content = this.generateQijue();
          title = `${this.selectedTheme}·七绝`;
          break;
        case 'cilv':
          content = this.generateCilv();
          title = `${this.selectedTheme}·七律`;
          break;
        case 'ci':
          content = this.generateCi();
          title = `${this.selectedCipai}·${this.selectedTheme}`;
          break;
      }
      
      this.currentPoem = {
        title,
        content,
        explanation: this.generateExplanation(content, this.selectedTheme),
        date: new Date()
      };
    },
    generateWujue() {
      // 生成五言绝句（4句，每句5字）
      const lines = [];
      for (let i = 0; i < 4; i++) {
        lines.push(this.generateLine(5, this.selectedTheme));
      }
      return lines;
    },
    generateQijue() {
      // 生成七言绝句（4句，每句7字）
      const lines = [];
      for (let i = 0; i < 4; i++) {
        lines.push(this.generateLine(7, this.selectedTheme));
      }
      return lines;
    },
    generateCilv() {
      // 生成七言律诗（8句，每句7字）
      const lines = [];
      for (let i = 0; i < 8; i++) {
        lines.push(this.generateLine(7, this.selectedTheme));
      }
      return lines;
    },
    generateCi() {
      // 根据词牌生成词（简化版）
      const lines = [];
      let lineCount = 4; // 简化处理，实际应根据词牌变化
      
      for (let i = 0; i < lineCount; i++) {
        const wordCount = i % 2 === 0 ? 5 : 7; // 交替5字和7字
        lines.push(this.generateLine(wordCount, this.selectedTheme));
      }
      return lines;
    },
    generateLine(length, theme) {
      // 生成一行诗
      let line = '';
      const themeWords = this.themes[theme] || [];
      
      for (let i = 0; i < length; i++) {
        if (this.useClassicalLanguage && Math.random() > 0.7) {
          // 使用古典词汇
          line += this.classicalWords[Math.floor(Math.random() * this.classicalWords.length)];
        } else if (themeWords.length > 0) {
          // 使用主题词汇
          line += themeWords[Math.floor(Math.random() * themeWords.length)];
        } else {
          // 使用通用词汇
          line += '天地人';
        }
      }
      
      return line;
    },
    generateExplanation(content, theme) {
      // 生成简单的诗词赏析
      const explanations = {
        '山水': `此诗描绘${content[0]}的${theme}景色，表达了对自然风光的赞美之情。`,
        '田园': `这首诗描写${content[0]}的${theme}生活，展现了田园牧歌般的宁静美好。`,
        '思乡': `通过${content[0]}的描写，表达了${theme}之情，寄托了游子对故乡的深深思念。`,
        '离别': `此诗以${content[0]}为背景，抒发了${theme}时的依依不舍和深情厚谊。`,
        '咏物': `诗人借${content[0]}咏物言志，通过${theme}表达了自己的品格和志向。`,
        '抒情': `这首诗直抒胸臆，通过${content[0]}等意象，表达了${theme}的内心感受。`,
        '咏史': `此诗凭吊${content[0]}的历史遗迹，${theme}抒怀，感慨时代变迁。`,
        '边塞': `描写${content[0]}的${theme}风光，展现了边关将士的豪情与艰辛。`,
        '四季': `诗人捕捉${content[0]}的${theme}特征，描绘了季节变换的自然美景。`,
        '感怀': `此诗通过${content[0]}等生活场景，表达了${theme}的人生感悟。`,
        '怀古': `借${content[0]}的历史典故，${theme}伤今，抒发对往昔的追忆。`,
        '叙事': `这首诗记述了${content[0]}的事件，${theme}生动，富有故事性。`,
        '议论': `诗人就${content[0]}发表见解，${theme}精辟，富有哲理意味。`,
        '写景': `细腻描绘${content[0]}的${theme}风光，语言优美，意境深远。`,
        '婉约': `此词风格${theme}，通过${content[0]}等意象，表达了细腻婉转的情感。`,
        '豪放': `这首词气势${theme}，${content[0]}等句展现了作者的豪迈气概。`,
        '爱情': `通过${content[0]}的描写，表达了${theme}的甜蜜与苦涩，动人肺腑。`,
        '闲适': `此诗描写${content[0]}的${theme}生活，表现了淡泊宁静的心境。`,
        '忧国': `诗人借${content[0]}抒怀，表达了${theme}忧民的深沉情感。`
      };
      
      return explanations[theme] || '此诗词意境优美，语言精练，值得细细品味。';
    },
    speakPoem() {
      if (!this.currentPoem || !('speechSynthesis' in window)) return;
      
      const utterance = new SpeechSynthesisUtterance(
        `${this.currentPoem.title}。${this.currentPoem.content.join('，')}。${this.currentPoem.explanation}`
      );
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      
      speechSynthesis.speak(utterance);
    },
    copyPoem() {
      if (!this.currentPoem) return;
      
      const text = `${this.currentPoem.title}\n${this.currentPoem.content.join('\n')}`;
      
      navigator.clipboard.writeText(text).then(() => {
        alert('诗词已复制到剪贴板！');
      }).catch(err => {
        console.error('复制失败:', err);
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('诗词已复制到剪贴板！');
      });
    },
    savePoem() {
      if (!this.currentPoem) return;
      
      this.collectedPoems.unshift({...this.currentPoem});
      this.saveCollection();
      alert('诗词已收藏！');
    },
    loadExample(example) {
      this.selectedStyle = example.style;
      this.currentPoem = {...example};
    },
    removeFromCollection(index) {
      this.collectedPoems.splice(index, 1);
      this.saveCollection();
    },
    saveCollection() {
      localStorage.setItem('collectedPoems', JSON.stringify(this.collectedPoems));
    },
    loadCollection() {
      const saved = localStorage.getItem('collectedPoems');
      if (saved) {
        this.collectedPoems = JSON.parse(saved);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    }
  }
}
</script>

<style scoped>
.poem-generator {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.tool-header {
  text-align: center;
  margin-bottom: 25px;
}

.tool-header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.tool-header p {
  color: #7f8c8d;
}

.controls-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.style-selector,
.theme-selector {
  margin-bottom: 20px;
}

.style-selector label,
.theme-selector label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #2c3e50;
}

.style-buttons,
.theme-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.style-buttons button,
.theme-buttons button {
  padding: 8px 12px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.style-buttons button:hover,
.theme-buttons button:hover {
  background: #e9ecef;
}

.style-buttons button.active,
.theme-buttons button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.options-group {
  margin-bottom: 15px;
}

.options-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.options-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.generation-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.generation-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: normal;
}

.generation-options input[type="number"] {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.generate-btn,
.speak-btn,
.copy-btn,
.save-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.generate-btn {
  background: #2ecc71;
  color: white;
}

.generate-btn:hover {
  background: #27ae60;
}

.speak-btn {
  background: #3498db;
  color: white;
}

.speak-btn:hover:not(:disabled) {
  background: #2980b9;
}

.speak-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.copy-btn {
  background: #9b59b6;
  color: white;
}

.copy-btn:hover:not(:disabled) {
  background: #8e44ad;
}

.copy-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.save-btn {
  background: #e74c3c;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #c0392b;
}

.save-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.result-section {
  margin-bottom: 30px;
}

.poem-display {
  background: #fffaf0;
  padding: 30px;
  border-radius: 8px;
  border-left: 4px solid #d35400;
  text-align: center;
}

.poem-title {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 10px;
}

.poem-author {
  font-style: italic;
  color: #7f8c8d;
  margin-bottom: 20px;
}

.poem-content {
  margin-bottom: 25px;
}

.poem-line {
  font-size: 18px;
  line-height: 2;
  color: #34495e;
}

.poem-content.wujue .poem-line,
.poem-content.ci .poem-line {
  font-size: 20px;
}

.poem-explanation {
  background: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 6px;
  margin-top: 20px;
  text-align: left;
}

.poem-explanation h4 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.poem-explanation p {
  line-height: 1.6;
  color: #34495e;
}

.poem-meta {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  font-size: 14px;
  color: #7f8c8d;
}

.examples-section {
  margin-bottom: 30px;
}

.examples-section h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.example-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid #3498db;
}

.example-card:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.example-title {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
}

.example-author {
  font-style: italic;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.example-preview {
  color: #34495e;
  margin-bottom: 10px;
}

.example-style {
  font-size: 12px;
  color: #3498db;
  font-weight: 500;
}

.knowledge-section {
  margin-bottom: 30px;
}

.knowledge-section h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.knowledge-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.knowledge-tabs button {
  padding: 10px 20px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.knowledge-tabs button:hover {
  background: #f8f9fa;
}

.knowledge-tabs button.active {
  border-bottom-color: #3498db;
  color: #3498db;
  font-weight: 600;
}

.tab-content {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.tab-content h4 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.tab-content p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.tab-content ul {
  padding-left: 20px;
  margin-bottom: 15px;
}

.tab-content li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.rules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.rule-item {
  background: white;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.rule-item h5 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.rule-item p {
  margin-bottom: 10px;
}

.rule-item pre {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 4px;
  font-family: 'SimSun', serif;
  overflow-x: auto;
}

.terms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.term-item {
  background: white;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.term-item h5 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.term-item p {
  font-size: 14px;
  line-height: 1.5;
  color: #34495e;
}

.collection-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.collection-section h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.collection-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.collection-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #3498db;
}

.collection-content h4 {
  margin-bottom: 5px;
  color: #2c3e50;
}

.collection-content p {
  margin-bottom: 5px;
  color: #34495e;
}

.collection-date {
  font-size: 12px;
  color: #7f8c8d;
}

.remove-btn {
  padding: 5px;
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
}

.remove-btn:hover {
  color: #e74c3c;
}

@media (max-width: 768px) {
  .style-buttons,
  .theme-buttons {
    justify-content: center;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .examples-grid {
    grid-template-columns: 1fr;
  }
  
  .rules-grid,
  .terms-grid {
    grid-template-columns: 1fr;
  }
  
  .poem-meta {
    flex-direction: column;
    gap: 5px;
  }
}
</style>