<template>
  <div class="daily-fortune">
    <div class="tool-header">
      <h2>今日运势</h2>
      <p>获取您的个性化每日运势预测，开启美好的一天</p>
    </div>

    <div class="fortune-container">
      <!-- 用户信息输入 -->
      <div v-if="!fortuneGenerated" class="user-input-section">
        <div class="input-card">
          <h3>请输入您的信息</h3>
          <p class="subtitle">我们将根据这些信息生成您的专属运势</p>
          
          <div class="input-group">
            <label for="user-name">您的姓名（可选）</label>
            <input 
              id="user-name"
              type="text" 
              v-model="userName" 
              placeholder="请输入您的名字"
              maxlength="20"
            >
          </div>
          
          <div class="input-group">
            <label for="zodiac">您的星座</label>
            <select id="zodiac" v-model="selectedZodiac">
              <option value="">请选择星座</option>
              <option v-for="zodiac in zodiacSigns" :key="zodiac.value" :value="zodiac.value">
                {{ zodiac.label }}
              </option>
            </select>
          </div>
          
          <div class="input-group">
            <label>今天的心情</label>
            <div class="mood-selector">
              <button 
                v-for="mood in moods" 
                :key="mood.value"
                class="mood-btn"
                :class="{ selected: selectedMood === mood.value }"
                @click="selectedMood = mood.value"
              >
                <span class="mood-icon">{{ mood.icon }}</span>
                <span class="mood-text">{{ mood.label }}</span>
              </button>
            </div>
          </div>
          
          <button 
            @click="generateFortune" 
            class="generate-btn"
            :disabled="!selectedZodiac"
          >
            <span class="icon">🔮</span> 生成今日运势
          </button>
        </div>
        
        <div class="fun-facts">
          <h4>趣味小知识</h4>
          <div class="fact-card">
            <p>{{ randomFact }}</p>
          </div>
        </div>
      </div>

      <!-- 运势结果显示 -->
      <div v-else class="fortune-result">
        <div class="fortune-card" :class="fortuneLevel">
          <div class="fortune-header">
            <h3>{{ fortuneDate }} 运势</h3>
            <p class="zodiac-info">{{ zodiacInfo.label }} · {{ zodiacInfo.dateRange }}</p>
          </div>
          
          <div class="fortune-content">
            <div class="main-fortune">
              <div class="fortune-level-icon">{{ fortuneIcon }}</div>
              <h4 class="fortune-title">{{ fortuneTitle }}</h4>
              <p class="fortune-description">{{ fortuneDescription }}</p>
            </div>
            
            <div class="fortune-details">
              <div class="detail-item">
                <div class="detail-icon">💖</div>
                <div class="detail-content">
                  <h5>感情运势</h5>
                  <p>{{ loveFortune }}</p>
                </div>
              </div>
              
              <div class="detail-item">
                <div class="detail-icon">💼</div>
                <div class="detail-content">
                  <h5>事业运势</h5>
                  <p>{{ careerFortune }}</p>
                </div>
              </div>
              
              <div class="detail-item">
                <div class="detail-icon">💰</div>
                <div class="detail-content">
                  <h5>财富运势</h5>
                  <p>{{ wealthFortune }}</p>
                </div>
              </div>
              
              <div class="detail-item">
                <div class="detail-icon">🌡️</div>
                <div class="detail-content">
                  <h5>健康运势</h5>
                  <p>{{ healthFortune }}</p>
                </div>
              </div>
            </div>
            
            <div class="lucky-info">
              <h5>幸运指数</h5>
              <div class="luck-meter">
                <div class="luck-bar" :style="{ width: luckPercentage + '%' }"></div>
                <span class="luck-text">{{ luckPercentage }}%</span>
              </div>
              
              <div class="lucky-items">
                <div class="lucky-item">
                  <span class="item-icon">🔢</span>
                  <span class="item-label">幸运数字</span>
                  <span class="item-value">{{ luckyNumber }}</span>
                </div>
                
                <div class="lucky-item">
                  <span class="item-icon">🎨</span>
                  <span class="item-label">幸运颜色</span>
                  <span class="item-value">{{ luckyColor }}</span>
                </div>
                
                <div class="lucky-item">
                  <span class="item-icon">⏰</span>
                  <span class="item-label">幸运时间</span>
                  <span class="item-value">{{ luckyTime }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="fortune-footer">
            <p class="fortune-message">{{ personalizedMessage }}</p>
            <div class="action-buttons">
              <button @click="regenerateFortune" class="action-btn">
                <span class="icon">🔄</span> 重新生成
              </button>
              <button @click="shareFortune" class="action-btn">
                <span class="icon">📤</span> 分享运势
              </button>
              <button @click="saveFortune" class="action-btn">
                <span class="icon">💾</span> 保存截图
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DailyFortune',
  data() {
    return {
      userName: '',
      selectedZodiac: '',
      selectedMood: 'happy',
      fortuneGenerated: false,
      fortuneDate: '',
      fortuneLevel: 'good',
      fortuneIcon: '🌟',
      fortuneTitle: '',
      fortuneDescription: '',
      loveFortune: '',
      careerFortune: '',
      wealthFortune: '',
      healthFortune: '',
      luckPercentage: 0,
      luckyNumber: '',
      luckyColor: '',
      luckyTime: '',
      personalizedMessage: '',
      
      zodiacSigns: [
        { value: 'aries', label: '白羊座 (3.21-4.19)', dateRange: '3月21日-4月19日' },
        { value: 'taurus', label: '金牛座 (4.20-5.20)', dateRange: '4月20日-5月20日' },
        { value: 'gemini', label: '双子座 (5.21-6.21)', dateRange: '5月21日-6月21日' },
        { value: 'cancer', label: '巨蟹座 (6.22-7.22)', dateRange: '6月22日-7月22日' },
        { value: 'leo', label: '狮子座 (7.23-8.22)', dateRange: '7月23日-8月22日' },
        { value: 'virgo', label: '处女座 (8.23-9.22)', dateRange: '8月23日-9月22日' },
        { value: 'libra', label: '天秤座 (9.23-10.23)', dateRange: '9月23日-10月23日' },
        { value: 'scorpio', label: '天蝎座 (10.24-11.22)', dateRange: '10月24日-11月22日' },
        { value: 'sagittarius', label: '射手座 (11.23-12.21)', dateRange: '11月23日-12月21日' },
        { value: 'capricorn', label: '摩羯座 (12.22-1.19)', dateRange: '12月22日-1月19日' },
        { value: 'aquarius', label: '水瓶座 (1.20-2.18)', dateRange: '1月20日-2月18日' },
        { value: 'pisces', label: '双鱼座 (2.19-3.20)', dateRange: '2月19日-3月20日' }
      ],
      
      moods: [
        { value: 'happy', label: '开心', icon: '😊' },
        { value: 'excited', label: '兴奋', icon: '😄' },
        { value: 'calm', label: '平静', icon: '😌' },
        { value: 'tired', label: '疲惫', icon: '😴' },
        { value: 'anxious', label: '焦虑', icon: '😰' }
      ],
      
      fortuneTitles: {
        excellent: ['大吉大利', '鸿运当头', '福星高照', '好运连连'],
        good: ['顺风顺水', '心想事成', '平稳顺利', '小有收获'],
        average: ['平平淡淡', '稳中有进', '略有波折', '需加努力'],
        challenging: ['稍有挑战', '谨慎行事', '调整心态', '等待时机']
      },
      
      loveFortunes: [
        "今天适合表达情感，单身的你可能会遇到有趣的人",
        "感情生活平稳，与伴侣的沟通更加顺畅",
        "需要多花时间关心身边的人，小惊喜能增进感情",
        "今天适合独处思考，理清自己的情感需求",
        "社交场合有机会结识新朋友，保持开放心态"
      ],
      
      careerFortunes: [
        "工作上有新机会，勇敢尝试会有收获",
        "团队合作顺利，同事间配合默契",
        "需要集中精力处理重要任务，避免分心",
        "创意灵感迸发，适合进行头脑风暴",
        "耐心处理细节问题，避免粗心错误"
      ],
      
      wealthFortunes: [
        "财运不错，可能有意外的小收获",
        "理性消费，避免冲动购物",
        "投资需谨慎，多做调研再决定",
        "适合规划长期财务目标",
        "有小幅进账机会，但不要过度期待"
      ],
      
      healthFortunes: [
        "精力充沛，适合进行体育锻炼",
        "注意作息规律，保证充足睡眠",
        "心情放松对身体有益，多做深呼吸",
        "注意饮食平衡，多吃蔬菜水果",
        "久坐后记得起身活动，保护脊椎"
      ],
      
      luckyColors: [
        "红色", "蓝色", "绿色", "黄色", "紫色", 
        "橙色", "粉色", "金色", "银色", "白色", "黑色"
      ],
      
      luckyTimes: [
        "上午9-11点", "中午12-1点", "下午3-5点", 
        "傍晚6-7点", "晚上8-10点", "午夜时分"
      ],
      
      messages: [
        "保持微笑，好运自然会来敲门",
        "今天的努力是明天成功的基石",
        "心怀感恩，生活处处是美好",
        "相信自己，你有无限可能",
        "小小的改变也能带来大大的不同",
        "善待他人，就是善待自己"
      ],
      
      facts: [
        "研究表明，积极的心态可以提升运气感知度25%",
        "星座起源于公元前3000年的巴比伦文明",
        "在中国文化中，红色象征吉祥和好运",
        "每周三是一周中生产力最高的一天",
        "微笑可以释放内啡肽，让你感觉更快乐",
        "每天感恩三件事可以显著提升幸福感"
      ]
    };
  },
  computed: {
    zodiacInfo() {
      return this.zodiacSigns.find(z => z.value === this.selectedZodiac) || {};
    },
    randomFact() {
      return this.facts[Math.floor(Math.random() * this.facts.length)];
    }
  },
  methods: {
    generateFortune() {
      // 设置当前日期
      const today = new Date();
      this.fortuneDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
      
      // 基于日期和用户输入生成种子，确保同一天同一用户得到相同运势
      const seed = today.toDateString() + this.selectedZodiac + this.userName;
      const random = this.seededRandom(seed);
      
      // 确定运势等级 (20% 极好, 50% 好, 20% 一般, 10% 挑战)
      const levelRandom = random();
      if (levelRandom < 0.2) {
        this.fortuneLevel = 'excellent';
        this.fortuneIcon = '✨';
        this.luckPercentage = Math.floor(80 + random() * 20);
      } else if (levelRandom < 0.7) {
        this.fortuneLevel = 'good';
        this.fortuneIcon = '🌟';
        this.luckPercentage = Math.floor(60 + random() * 20);
      } else if (levelRandom < 0.9) {
        this.fortuneLevel = 'average';
        this.fortuneIcon = '🔆';
        this.luckPercentage = Math.floor(40 + random() * 20);
      } else {
        this.fortuneLevel = 'challenging';
        this.fortuneIcon = '🌧️';
        this.luckPercentage = Math.floor(20 + random() * 20);
      }
      
      // 选择运势内容
      const titleIndex = Math.floor(random() * this.fortuneTitles[this.fortuneLevel].length);
      this.fortuneTitle = this.fortuneTitles[this.fortuneLevel][titleIndex];
      
      // 生成运势描述
      this.fortuneDescription = this.generateDescription(random);
      
      // 生成各项详细运势
      this.loveFortune = this.loveFortunes[Math.floor(random() * this.loveFortunes.length)];
      this.careerFortune = this.careerFortunes[Math.floor(random() * this.careerFortunes.length)];
      this.wealthFortune = this.wealthFortunes[Math.floor(random() * this.wealthFortunes.length)];
      this.healthFortune = this.healthFortunes[Math.floor(random() * this.healthFortunes.length)];
      
      // 生成幸运信息
      this.luckyNumber = Math.floor(1 + random() * 99);
      this.luckyColor = this.luckyColors[Math.floor(random() * this.luckyColors.length)];
      this.luckyTime = this.luckyTimes[Math.floor(random() * this.luckyTimes.length)];
      
      // 个性化消息
      const namePart = this.userName ? `${this.userName}，` : '';
      const message = this.messages[Math.floor(random() * this.messages.length)];
      this.personalizedMessage = `${namePart}${message}`;
      
      // 显示运势结果
      this.fortuneGenerated = true;
      
      // 滚动到顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    
    generateDescription(random) {
      const descriptions = {
        excellent: [
          "今天是充满惊喜的一天，好运将伴随你左右。抓住机会，大胆尝试新事物，会有意想不到的收获。",
          "吉星高照，万事顺遂。你的积极态度会吸引更多好事发生，保持这份能量。",
          "幸运女神对你微笑，无论是工作还是生活都将顺利进展。记得与他人分享你的快乐。"
        ],
        good: [
          "今天整体运势不错，事情会按照计划顺利进行。保持乐观心态，好事自然来。",
          "平稳中见进步，小小努力也能带来可喜成果。注意把握时机，适时行动。",
          "运势上升期，适合处理积压事务。你的耐心和坚持会得到回报。"
        ],
        average: [
          "今天运势平稳，没有大起大落。适合按部就班完成计划，避免冒险决策。",
          "普通的一天，适合反思和规划。小的调整可以帮助你更好地迎接明天的机会。",
          "运势中等，需要更多努力才能达成目标。保持耐心，结果会证明你的付出。"
        ],
        challenging: [
          "今天可能会遇到一些小挑战，保持冷静和耐心很重要。困难只是暂时的。",
          "运势稍有波动，需要更加谨慎行事。相信自己的能力，你有克服困难的智慧。",
          "今天适合内省和调整。挑战也是成长的机会，从中学习会让你变得更强大。"
        ]
      };
      
      return descriptions[this.fortuneLevel][Math.floor(random() * descriptions[this.fortuneLevel].length)];
    },
    
    seededRandom(seed) {
      // 基于种子创建伪随机数生成器
      let x = 0;
      for (let i = 0; i < seed.length; i++) {
        x = (x << 5) - x + seed.charCodeAt(i);
        x |= 0;
      }
      return () => {
        x = Math.sin(x) * 10000;
        return x - Math.floor(x);
      };
    },
    
    regenerateFortune() {
      this.fortuneGenerated = false;
    },
    
    shareFortune() {
      const shareText = `我的今日运势: ${this.fortuneTitle} - ${this.fortuneDate}`;
      
      if (navigator.share) {
        navigator.share({
          title: '今日运势',
          text: shareText,
          url: window.location.href
        }).catch(err => {
          console.log('分享失败:', err);
        });
      } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(shareText).then(() => {
          alert('运势已复制到剪贴板，可以粘贴分享给朋友了！');
        }).catch(err => {
          console.error('复制失败:', err);
          alert('您的浏览器不支持分享功能，请手动复制内容分享。');
        });
      }
    },
    
    saveFortune() {
      alert('截图功能需要额外实现，您可以手动截图保存今日运势。');
    }
  }
};
</script>

<style scoped>
.daily-fortune {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.tool-header {
  text-align: center;
  margin-bottom: 30px;
}

.tool-header h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.tool-header p {
  color: #7f8c8d;
  font-size: 1.1em;
}

.fortune-container {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-input-section {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.input-card {
  flex: 1;
  min-width: 300px;
  background-color: #fff;
  border-radius: 8px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.input-card h3 {
  color: #2c3e50;
  margin-top: 0;
  text-align: center;
}

.subtitle {
  text-align: center;
  color: #7f8c8d;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #2c3e50;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #6c5ce7;
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.2);
}

.mood-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.mood-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 70px;
}

.mood-btn:hover {
  border-color: #6c5ce7;
  transform: translateY(-2px);
}

.mood-btn.selected {
  border-color: #6c5ce7;
  background-color: rgba(108, 92, 231, 0.1);
  box-shadow: 0 2px 6px rgba(108, 92, 231, 0.2);
}

.mood-icon {
  font-size: 1.5em;
  margin-bottom: 5px;
}

.mood-text {
  font-size: 0.85em;
  color: #495057;
}

.generate-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(108, 92, 231, 0.4);
}

.generate-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.fun-facts {
  flex: 1;
  min-width: 250px;
}

.fun-facts h4 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.fact-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-style: italic;
  color: #6c757d;
  border-left: 4px solid #6c5ce7;
}

.fortune-result {
  display: flex;
  justify-content: center;
}

.fortune-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.fortune-card.excellent {
  border-top: 6px solid #fdcb6e;
}

.fortune-card.good {
  border-top: 6px solid #00b894;
}

.fortune-card.average {
  border-top: 6px solid #74b9ff;
}

.fortune-card.challenging {
  border-top: 6px solid #ff7675;
}

.fortune-header {
  background: linear-gradient(135deg, #6c5ce7, #a29bfe);
  color: white;
  padding: 20px;
  text-align: center;
}

.fortune-header h3 {
  margin: 0 0 5px 0;
  font-size: 1.5em;
}

.zodiac-info {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9em;
}

.fortune-content {
  padding: 25px;
}

.main-fortune {
  text-align: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.fortune-level-icon {
  font-size: 3em;
  margin-bottom: 15px;
}

.fortune-title {
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-size: 1.4em;
}

.fortune-description {
  color: #7f8c8d;
  line-height: 1.6;
  margin: 0;
}

.fortune-details {
  margin-bottom: 25px;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
}

.detail-icon {
  font-size: 1.5em;
  margin-right: 15px;
  flex-shrink: 0;
}

.detail-content h5 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.detail-content p {
  margin: 0;
  color: #6c757d;
  line-height: 1.5;
}

.lucky-info h5 {
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.luck-meter {
  position: relative;
  height: 20px;
  background: #f1f2f6;
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
}

.luck-bar {
  height: 100%;
  border-radius: 10px;
  transition: width 1s ease-in-out;
}

.fortune-card.excellent .luck-bar {
  background: linear-gradient(to right, #fdcb6e, #e17055);
}

.fortune-card.good .luck-bar {
  background: linear-gradient(to right, #00b894, #00cec9);
}

.fortune-card.average .luck-bar {
  background: linear-gradient(to right, #74b9ff, #0984e3);
}

.fortune-card.challenging .luck-bar {
  background: linear-gradient(to right, #ff7675, #e84393);
}

.luck-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #2c3e50;
  font-weight: bold;
  font-size: 0.8em;
  text-shadow: 0 0 2px white;
}

.lucky-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.lucky-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.item-icon {
  font-size: 1.5em;
  margin-bottom: 5px;
}

.item-label {
  font-size: 0.8em;
  color: #6c757d;
  margin-bottom: 3px;
}

.item-value {
  font-weight: bold;
  color: #2c3e50;
}

.fortune-footer {
  padding: 20px;
  background: #f8f9fa;
  text-align: center;
}

.fortune-message {
  font-style: italic;
  color: #6c757d;
  margin: 0 0 15px 0;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 15px;
  background: #fff;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .user-input-section {
    flex-direction: column;
  }
  
  .mood-selector {
    justify-content: center;
  }
  
  .lucky-items {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 100%;
    max-width: 200px;
    justify-content: center;
  }
}
</style>