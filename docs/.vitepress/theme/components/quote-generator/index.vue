<template>
  <div class="quote-generator">
    <div class="tool-header">
      <h2><i class="fas fa-quote-left"></i> 随机名言生成器</h2>
      <p>发现智慧的话语，激发灵感，丰富思想</p>
    </div>

    <div class="tool-body">
      <div class="controls-section">
        <div class="category-selector">
          <label>选择分类:</label>
          <div class="category-buttons">
            <button 
              v-for="category in categories" 
              :key="category.id" 
              :class="{ active: selectedCategory === category.id }" 
              @click="selectCategory(category.id)"
            >
              {{ category.name }}
            </button>
          </div>
        </div>

        <div class="generation-options">
          <button @click="generateQuote" class="generate-btn">
            <i class="fas fa-sync"></i> 随机生成
          </button>
          <button @click="autoPlay" :class="{ active: isAutoPlaying }" class="autoplay-btn">
            <i class="fas fa-play"></i> {{ isAutoPlaying ? '停止自动播放' : '自动播放' }}
          </button>
        </div>
      </div>

      <div class="quote-display" v-if="currentQuote">
        <div class="quote-card" :class="currentCategory.color">
          <div class="quote-text">
            <i class="fas fa-quote-left quote-icon"></i>
            {{ currentQuote.text }}
          </div>
          <div class="quote-author">
            — {{ currentQuote.author }}
            <span v-if="currentQuote.source">, 《{{ currentQuote.source }}》</span>
          </div>
          <div class="quote-tags" v-if="currentQuote.tags && currentQuote.tags.length">
            <span 
              v-for="tag in currentQuote.tags" 
              :key="tag" 
              class="quote-tag"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <div class="quote-actions">
          <button @click="likeQuote" :class="{ liked: isLiked }" class="like-btn">
            <i class="fas fa-heart"></i>
            {{ isLiked ? '已收藏' : '收藏' }}
          </button>
          <button @click="copyQuote" class="copy-btn">
            <i class="fas fa-copy"></i> 复制
          </button>
          <button @click="shareQuote" class="share-btn">
            <i class="fas fa-share-alt"></i> 分享
          </button>
          <button @click="speakQuote" class="speak-btn">
            <i class="fas fa-volume-up"></i> 朗读
          </button>
        </div>
      </div>

      <div class="favorites-section" v-if="favoriteQuotes.length > 0">
        <h3>
          <i class="fas fa-heart"></i> 我的收藏
          <button @click="clearFavorites" class="clear-btn">
            <i class="fas fa-trash"></i> 清空收藏
          </button>
        </h3>
        <div class="favorites-grid">
          <div 
            v-for="(quote, index) in favoriteQuotes" 
            :key="index" 
            class="favorite-quote"
          >
            <div class="favorite-text">{{ quote.text }}</div>
            <div class="favorite-author">— {{ quote.author }}</div>
            <button @click="removeFavorite(index)" class="remove-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>关于名言</h3>
        <div class="info-content">
          <p>名言是智慧的结晶，是历代思想家、文学家和领袖们留给我们的宝贵精神财富。它们能够:</p>
          <ul>
            <li>启发思考，提供新的视角</li>
            <li>激励行动，提供精神动力</li>
            <li>安慰心灵，提供情感支持</li>
            <li>传递智慧，提供人生指导</li>
          </ul>
          
          <div class="quote-stats">
            <h4>名言库统计</h4>
            <div class="stats-grid">
              <div class="stat">
                <span class="stat-number">{{ totalQuotes }}</span>
                <span class="stat-label">总名言数</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ categories.length }}</span>
                <span class="stat-label">分类数量</span>
              </div>
              <div class="stat">
                <span class="stat-number">{{ uniqueAuthors }}</span>
                <span class="stat-label">作者数量</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuoteGenerator',
  data() {
    return {
      selectedCategory: 'all',
      currentQuote: null,
      isAutoPlaying: false,
      autoPlayInterval: null,
      favoriteQuotes: [],
      isLiked: false,
      categories: [
        { id: 'all', name: '全部', color: 'color-all' },
        { id: 'wisdom', name: '智慧', color: 'color-wisdom' },
        { id: 'life', name: '人生', color: 'color-life' },
        { id: 'success', name: '成功', color: 'color-success' },
        { id: 'love', name: '爱情', color: 'color-love' },
        { id: 'friendship', name: '友谊', color: 'color-friendship' },
        { id: 'courage', name: '勇气', color: 'color-courage' },
        { id: 'inspiration', name: '励志', color: 'color-inspiration' }
      ],
      quotes: [
        // 智慧类
        { id: 1, text: "知之为知之，不知为不知，是知也。", author: "孔子", category: "wisdom", source: "论语", tags: ["知识", "诚实"] },
        { id: 2, text: "智慧不仅仅存在于知识之中，而且还存在于运用知识的能力。", author: "亚里士多德", category: "wisdom", tags: ["知识", "实践"] },
        { id: 3, text: "真正的智慧不仅在于能明察眼前，而且还能预见未来。", author: "忒壬斯", category: "wisdom", tags: ["预见", "洞察"] },
        
        // 人生类
        { id: 4, text: "人生应该如蜡烛一样，从顶燃到底，一直都是光明的。", author: "萧楚女", category: "life", tags: ["光明", "奉献"] },
        { id: 5, text: "人生的价值，并不是用时间，而是用深度去衡量的。", author: "列夫·托尔斯泰", category: "life", tags: ["价值", "深度"] },
        { id: 6, text: "人生如同故事。重要的并不在有多长，而是在有多好。", author: "塞涅卡", category: "life", tags: ["质量", "意义"] },
        
        // 成功类
        { id: 7, text: "成功=艰苦的劳动+正确的方法+少说空话。", author: "爱因斯坦", category: "success", tags: ["努力", "方法"] },
        { id: 8, text: "成功不是将来才有的，而是从决定去做的那一刻起，持续累积而成。", author: "佚名", category: "success", tags: ["积累", "行动"] },
        { id: 9, text: "成功的秘诀，在永不改变既定的目的。", author: "卢梭", category: "success", tags: ["坚持", "目标"] },
        
        // 爱情类
        { id: 10, text: "爱情不是用眼睛，而是用心灵看的，所以长翅膀的爱神被画成瞎子。", author: "莎士比亚", category: "love", tags: ["心灵", "盲目"] },
        { id: 11, text: "爱情是理解和体贴的别名。", author: "泰戈尔", category: "love", tags: ["理解", "体贴"] },
        { id: 12, text: "爱是亘古长明的灯塔，它定睛望着风暴却兀不为动。", author: "莎士比亚", category: "love", tags: ["坚定", "永恒"] },
        
        // 友谊类
        { id: 13, text: "友谊是两颗心真诚相待，而不是一颗心对另一颗心的敲打。", author: "鲁迅", category: "friendship", tags: ["真诚", "平等"] },
        { id: 14, text: "真正的友谊，是一株成长缓慢的植物。", author: "华盛顿", category: "friendship", tags: ["成长", "缓慢"] },
        { id: 15, text: "朋友间必须是患难相济，那才能说得上是真正的友谊。", author: "莎士比亚", category: "friendship", tags: ["患难", "真诚"] },
        
        // 勇气类
        { id: 16, text: "勇气是人类最重要的一种特质，倘若有了勇气，人类其他的特质自然也就具备了。", author: "丘吉尔", category: "courage", tags: ["特质", "基础"] },
        { id: 17, text: "勇敢来自于斗争，勇敢在同困难顽强奋斗中渐形成。我们青年人的座右铭就是勇敢、顽强、坚定，就是克服艰难险阻。", author: "奥斯特洛夫斯基", category: "courage", tags: ["斗争", "奋斗"] },
        { id: 18, text: "幸运喜欢照顾勇敢的人。", author: "达尔文", category: "courage", tags: ["幸运", "冒险"] },
        
        // 励志类
        { id: 19, text: "生活就像海洋，只有意志坚强的人，才能到达彼岸。", author: "马克思", category: "inspiration", tags: ["意志", "坚持"] },
        { id: 20, text: "世上无难事，只要肯登攀。", author: "毛泽东", category: "inspiration", tags: ["努力", "攀登"] },
        { id: 21, text: "黑发不知勤学早，白首方悔读书迟。", author: "颜真卿", category: "inspiration", tags: ["学习", "时间"] },
        
        // 添加更多名言...
        { id: 22, text: "读万卷书，行万里路。", author: "刘彝", category: "wisdom", tags: ["学习", "实践"] },
        { id: 23, text: "时间就是生命，时间就是速度，时间就是力量。", author: "郭沫若", category: "life", tags: ["时间", "珍贵"] },
        { id: 24, text: "失败乃成功之母。", author: "俗语", category: "success", tags: ["失败", "学习"] },
        { id: 25, text: "爱是恒久忍耐，又有恩慈；爱是不嫉妒，爱是不自夸，不张狂。", author: "圣经", category: "love", source: "哥林多前书", tags: ["忍耐", "恩慈"] },
        { id: 26, text: "海内存知己，天涯若比邻。", author: "王勃", category: "friendship", source: "送杜少府之任蜀州", tags: ["距离", "友情"] },
        { id: 27, text: "不入虎穴，焉得虎子。", author: "后汉书", category: "courage", tags: ["冒险", "收获"] },
        { id: 28, text: "天行健，君子以自强不息。", author: "周易", category: "inspiration", tags: ["自强", "坚持"] }
      ]
    };
  },
  computed: {
    filteredQuotes() {
      if (this.selectedCategory === 'all') {
        return this.quotes;
      }
      return this.quotes.filter(quote => quote.category === this.selectedCategory);
    },
    totalQuotes() {
      return this.quotes.length;
    },
    uniqueAuthors() {
      const authors = new Set(this.quotes.map(quote => quote.author));
      return authors.size;
    },
    currentCategory() {
      return this.categories.find(cat => cat.id === this.selectedCategory) || this.categories[0];
    }
  },
  mounted() {
    this.generateQuote();
    this.loadFavorites();
  },
  beforeUnmount() {
    this.stopAutoPlay();
  },
  methods: {
    selectCategory(categoryId) {
      this.selectedCategory = categoryId;
      this.generateQuote();
    },
    generateQuote() {
      if (this.filteredQuotes.length === 0) return;
      
      const randomIndex = Math.floor(Math.random() * this.filteredQuotes.length);
      this.currentQuote = this.filteredQuotes[randomIndex];
      this.checkIfLiked();
    },
    autoPlay() {
      if (this.isAutoPlaying) {
        this.stopAutoPlay();
      } else {
        this.isAutoPlaying = true;
        this.autoPlayInterval = setInterval(() => {
          this.generateQuote();
        }, 5000); // 每5秒切换一次
      }
    },
    stopAutoPlay() {
      this.isAutoPlaying = false;
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
      }
    },
    likeQuote() {
      if (!this.currentQuote) return;
      
      if (this.isLiked) {
        this.removeFavorite(this.currentQuote);
      } else {
        this.addToFavorites(this.currentQuote);
      }
    },
    addToFavorites(quote) {
      // 检查是否已经收藏
      const isAlreadyAdded = this.favoriteQuotes.some(
        fav => fav.id === quote.id && fav.text === quote.text
      );
      
      if (!isAlreadyAdded) {
        this.favoriteQuotes.push({...quote});
        this.saveFavorites();
        this.isLiked = true;
      }
    },
    removeFavorite(index) {
      if (typeof index === 'number') {
        this.favoriteQuotes.splice(index, 1);
      } else {
        // 通过quote对象删除
        const quoteToRemove = index;
        this.favoriteQuotes = this.favoriteQuotes.filter(
          fav => !(fav.id === quoteToRemove.id && fav.text === quoteToRemove.text)
        );
        this.isLiked = false;
      }
      this.saveFavorites();
    },
    checkIfLiked() {
      if (!this.currentQuote) {
        this.isLiked = false;
        return;
      }
      
      this.isLiked = this.favoriteQuotes.some(
        fav => fav.id === this.currentQuote.id && fav.text === this.currentQuote.text
      );
    },
    saveFavorites() {
      localStorage.setItem('favoriteQuotes', JSON.stringify(this.favoriteQuotes));
    },
    loadFavorites() {
      const savedFavorites = localStorage.getItem('favoriteQuotes');
      if (savedFavorites) {
        this.favoriteQuotes = JSON.parse(savedFavorites);
        this.checkIfLiked();
      }
    },
    clearFavorites() {
      if (confirm('确定要清空所有收藏的名言吗？')) {
        this.favoriteQuotes = [];
        this.saveFavorites();
        this.isLiked = false;
      }
    },
    copyQuote() {
      if (!this.currentQuote) return;
      
      const textToCopy = `"${this.currentQuote.text}" — ${this.currentQuote.author}`;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert('名言已复制到剪贴板！');
      }).catch(err => {
        console.error('复制失败:', err);
        // 降级方案
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('名言已复制到剪贴板！');
      });
    },
    shareQuote() {
      if (!this.currentQuote) return;
      
      const textToShare = `"${this.currentQuote.text}" — ${this.currentQuote.author}`;
      
      if (navigator.share) {
        navigator.share({
          title: '名言分享',
          text: textToShare,
          url: window.location.href
        }).catch(err => {
          console.log('分享失败:', err);
        });
      } else {
        this.copyQuote();
        alert('名言已复制，请手动分享！');
      }
    },
    speakQuote() {
      if (!this.currentQuote || !('speechSynthesis' in window)) return;
      
      const utterance = new SpeechSynthesisUtterance(
        `${this.currentQuote.text}，作者：${this.currentQuote.author}`
      );
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      
      speechSynthesis.speak(utterance);
    }
  }
}
</script>

<style scoped>
.quote-generator {
  max-width: 800px;
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
  margin-bottom: 25px;
}

.category-selector {
  margin-bottom: 15px;
}

.category-selector label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #2c3e50;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-buttons button {
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-buttons button:hover {
  background: #e9ecef;
}

.category-buttons button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.generation-options {
  display: flex;
  gap: 10px;
}

.generate-btn, .autoplay-btn {
  padding: 10px 15px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.generate-btn:hover {
  background: #27ae60;
}

.autoplay-btn {
  background: #f39c12;
}

.autoplay-btn:hover {
  background: #e67e22;
}

.autoplay-btn.active {
  background: #e74c3c;
}

.quote-display {
  margin-bottom: 30px;
}

.quote-card {
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: relative;
}

.quote-text {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 15px;
  font-style: italic;
  text-align: center;
}

.quote-icon {
  opacity: 0.3;
  margin-right: 5px;
  font-size: 16px;
}

.quote-author {
  text-align: right;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.quote-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 15px;
  justify-content: center;
}

.quote-tag {
  padding: 3px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.quote-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.quote-actions button {
  padding: 8px 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.quote-actions button:hover {
  background: #f8f9fa;
}

.like-btn.liked {
  background: #ffebee;
  color: #e53935;
  border-color: #ffcdd2;
}

.favorites-section {
  margin-bottom: 30px;
}

.favorites-section h3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  color: #2c3e50;
}

.clear-btn {
  padding: 5px 10px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
}

.clear-btn:hover {
  background: #c0392b;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.favorite-quote {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
  position: relative;
}

.favorite-text {
  margin-bottom: 8px;
  font-style: italic;
}

.favorite-author {
  font-size: 14px;
  color: #7f8c8d;
}

.remove-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  padding: 5px;
}

.remove-btn:hover {
  color: #e74c3c;
}

.info-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.info-section h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.info-content {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.info-content p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.info-content ul {
  padding-left: 20px;
  margin-bottom: 15px;
}

.info-content li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.quote-stats {
  margin-top: 20px;
}

.quote-stats h4 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #7f8c8d;
}

/* 更新分类颜色 - 提高对比度 */
.color-all {
  background: linear-gradient(135deg, #2980b9, #1a5276);
  color: white;
}

.color-wisdom {
  background: linear-gradient(135deg, #2c3e50, #1c2833);
  color: white;
}

.color-life {
  background: linear-gradient(135deg, #27ae60, #1e8449);
  color: white;
}

.color-success {
  background: linear-gradient(135deg, #f39c12, #b7950b);
  color: white;
}

.color-love {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.color-friendship {
  background: linear-gradient(135deg, #3498db, #2874a6);
  color: white;
}

.color-courage {
  background: linear-gradient(135deg, #8e44ad, #6c3483);
  color: white;
}

.color-inspiration {
  background: linear-gradient(135deg, #d35400, #a04000);
  color: white;
}

@media (max-width: 768px) {
  .category-buttons {
    justify-content: center;
  }
  
  .generation-options {
    flex-direction: column;
  }
  
  .quote-actions {
    flex-direction: column;
  }
  
  .favorites-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>