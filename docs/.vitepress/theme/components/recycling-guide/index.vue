<template>
  <div class="recycling-guide">
    <div class="tool-header">
      <h2>垃圾分类指导助手</h2>
      <p>快速查询物品分类，学习垃圾分类知识，共建环保家园</p>
    </div>

    <div class="guide-container">
      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="输入物品名称，如'塑料瓶'、'电池'等"
            @keyup.enter="searchItem"
            ref="searchInput"
          >
          <button @click="searchItem" class="search-btn">
            <span class="icon">🔍</span> 查询
          </button>
        </div>
        
        <div class="quick-categories">
          <h4>常用分类快速查看</h4>
          <div class="category-buttons">
            <button 
              v-for="category in garbageCategories" 
              :key="category.type"
              class="category-btn"
              :class="category.type"
              @click="showCategoryItems(category.type)"
            >
              <span class="category-icon">{{ category.icon }}</span>
              {{ category.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div v-if="searchResult" class="result-section">
        <div class="result-card" :class="searchResult.category">
          <div class="result-header">
            <h3>{{ searchResult.name }}</h3>
            <span class="category-badge" :class="searchResult.category">
              {{ getCategoryName(searchResult.category) }}
            </span>
          </div>
          
          <div class="result-content">
            <div class="category-info">
              <div class="category-icon-large">
                {{ getCategoryIcon(searchResult.category) }}
              </div>
              <div class="category-details">
                <h4>{{ getCategoryName(searchResult.category) }}投放要求</h4>
                <p>{{ getCategoryDescription(searchResult.category) }}</p>
              </div>
            </div>
            
            <div class="disposal-guide">
              <h4>具体投放指南</h4>
              <ul>
                <li v-for="(guide, index) in searchResult.guide" :key="index">
                  {{ guide }}
                </li>
              </ul>
            </div>
            
            <div v-if="searchResult.tips" class="additional-tips">
              <h4>小贴士</h4>
              <p>{{ searchResult.tips }}</p>
            </div>
          </div>
        </div>
        
        <div class="similar-items" v-if="similarItems.length > 0">
          <h4>类似物品分类</h4>
          <div class="similar-list">
            <div 
              v-for="item in similarItems" 
              :key="item.name"
              class="similar-item"
              @click="selectSimilarItem(item)"
            >
              <span class="item-name">{{ item.name }}</span>
              <span class="item-category" :class="item.category">
                {{ getCategoryName(item.category) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 分类物品列表 -->
      <div v-if="currentCategory" class="category-section">
        <div class="category-header">
          <button @click="backToSearch" class="back-btn">
            ← 返回搜索
          </button>
          <h3>
            <span class="category-icon">{{ getCategoryIcon(currentCategory) }}</span>
            {{ getCategoryName(currentCategory) }}
          </h3>
          <p>{{ getCategoryDescription(currentCategory) }}</p>
        </div>
        
        <div class="items-grid">
          <div 
            v-for="item in getCategoryItems(currentCategory)" 
            :key="item.name"
            class="item-card"
            @click="selectCategoryItem(item)"
          >
            <div class="item-name">{{ item.name }}</div>
            <div class="item-guide-preview">
              {{ item.guide[0] }}
            </div>
          </div>
        </div>
      </div>

      <!-- 垃圾分类知识 -->
      <div v-if="!searchResult && !currentCategory" class="knowledge-section">
        <h3>垃圾分类知识</h3>
        
        <div class="knowledge-cards">
          <div class="knowledge-card">
            <h4>为什么要垃圾分类？</h4>
            <ul>
              <li>减少土地占用和环境污染</li>
              <li>提高资源回收利用率</li>
              <li>减少垃圾处理成本</li>
              <li>培养环保意识，建设美丽家园</li>
            </ul>
          </div>
          
          <div class="knowledge-card">
            <h4>垃圾分类基本原则</h4>
            <ul>
              <li>可回收物：适宜回收利用和资源化利用的生活废弃物</li>
              <li>有害垃圾：对人体健康或自然环境造成直接或潜在危害的废弃物</li>
              <li>厨余垃圾：易腐垃圾，包括食材废料、剩菜剩饭等</li>
              <li>其他垃圾：除上述三类外的其他生活废弃物</li>
            </ul>
          </div>
          
          <div class="knowledge-card">
            <h4>分类小技巧</h4>
            <ul>
              <li>不确定如何分类时，可先查询再投放</li>
              <li>投放前尽量保持物品清洁干燥</li>
              <li>有害垃圾应轻拿轻放，避免破损</li>
              <li>厨余垃圾应沥干水分后再投放</li>
            </ul>
          </div>
        </div>
        
        <div class="statistics">
          <h4>垃圾分类的效益</h4>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">30%</div>
              <div class="stat-label">垃圾减量率</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">50%</div>
              <div class="stat-label">资源回收潜力</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">60%</div>
              <div class="stat-label">填埋场寿命延长</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">40%</div>
              <div class="stat-label">碳排放减少</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 地区差异提示 -->
      <div class="region-notice">
        <p>💡 注意：垃圾分类标准可能因地区而异，请以当地规定为准。本工具提供通用分类指导。</p>
      </div>
    </div>
  </div>
</template>

<script>
// 垃圾分类数据库
const garbageItems = [
  // 可回收物
  {
    name: "塑料瓶",
    category: "recyclable",
    guide: [
      "清洗干净瓶内残留物",
      "压扁后投放",
      "瓶盖属于其他垃圾，应分开投放"
    ],
    tips: "PET材质的塑料瓶回收价值较高"
  },
  {
    name: "纸箱",
    category: "recyclable",
    guide: [
      "拆开压扁后投放",
      "清除胶带等异物",
      "保持干燥清洁"
    ]
  },
  {
    name: "玻璃瓶",
    category: "recyclable",
    guide: [
      "清洗干净后投放",
      "小心轻放，防止破碎",
      "瓶盖属于其他垃圾"
    ],
    tips: "有色和无色玻璃最好分开回收"
  },
  {
    name: "旧衣服",
    category: "recyclable",
    guide: [
      "清洗干净后投放",
      "放入专门的旧衣回收箱",
      "破损衣物可作为抹布再利用"
    ]
  },
  {
    name: "易拉罐",
    category: "recyclable",
    guide: [
      "清洗干净后投放",
      "压扁减少体积",
      "与塑料瓶分开投放"
    ]
  },

  // 有害垃圾
  {
    name: "电池",
    category: "hazardous",
    guide: [
      "投放至有害垃圾收集容器",
      "避免破损和短路",
      "不要与其他垃圾混合"
    ],
    tips: "纽扣电池和充电电池都属有害垃圾"
  },
  {
    name: "过期药品",
    category: "hazardous",
    guide: [
      "保持原包装投放",
      "不要拆散或混合",
      "投放到指定收集点"
    ]
  },
  {
    name: "荧光灯管",
    category: "hazardous",
    guide: [
      "小心轻放，防止破损",
      "投放至有害垃圾收集容器",
      "碎片应妥善包裹"
    ]
  },
  {
    name: "油漆桶",
    category: "hazardous",
    guide: [
      "残留物干化后投放",
      "密封好后投放",
      "空桶可回收利用"
    ]
  },

  // 厨余垃圾
  {
    name: "剩饭菜",
    category: "kitchen",
    guide: [
      "沥干水分后投放",
      "去除包装物",
      "投放到厨余垃圾收集容器"
    ]
  },
  {
    name: "果皮",
    category: "kitchen",
    guide: [
      "直接投放到厨余垃圾收集容器",
      "柑橘类果皮可制作清洁剂",
      "不要与塑料袋一起投放"
    ]
  },
  {
    name: "茶叶渣",
    category: "kitchen",
    guide: [
      "沥干水分后投放",
      "可作堆肥原料",
      "茶包需分开投放"
    ]
  },
  {
    name: "骨头",
    category: "kitchen",
    guide: [
      "小型骨头属于厨余垃圾",
      "大型骨头属于其他垃圾",
      "投放前尽量沥干"
    ]
  },

  // 其他垃圾
  {
    name: "塑料袋",
    category: "other",
    guide: [
      "尽量重复使用",
      "干净干燥的投放",
      "污染严重的属于其他垃圾"
    ],
    tips: "尽量减少使用一次性塑料袋"
  },
  {
    name: "餐巾纸",
    category: "other",
    guide: [
      "污染后属于其他垃圾",
      "尽量减少使用",
      "投放时保持干燥"
    ]
  },
  {
    name: "尿不湿",
    category: "other",
    guide: [
      "属于其他垃圾",
      "投放前尽量包裹好",
      "投放到指定收集容器"
    ]
  },
  {
    name: "烟头",
    category: "other",
    guide: [
      "完全熄灭后投放",
      "属于其他垃圾",
      "不要随意丢弃"
    ]
  }
];

export default {
  name: 'RecyclingGuide',
  data() {
    return {
      searchQuery: '',
      searchResult: null,
      currentCategory: null,
      similarItems: [],
      
      garbageCategories: [
        { type: 'recyclable', name: '可回收物', icon: '♻️' },
        { type: 'hazardous', name: '有害垃圾', icon: '⚠️' },
        { type: 'kitchen', name: '厨余垃圾', icon: '🍃' },
        { type: 'other', name: '其他垃圾', icon: '🗑️' }
      ],
      
      categoryInfo: {
        recyclable: {
          name: '可回收物',
          icon: '♻️',
          description: '适宜回收利用和资源化利用的生活废弃物',
          color: '#4CAF50'
        },
        hazardous: {
          name: '有害垃圾',
          icon: '⚠️',
          description: '对人体健康或自然环境造成直接或潜在危害的废弃物',
          color: '#F44336'
        },
        kitchen: {
          name: '厨余垃圾',
          icon: '🍃',
          description: '易腐垃圾，包括食材废料、剩菜剩饭、过期食品等',
          color: '#8BC34A'
        },
        other: {
          name: '其他垃圾',
          icon: '🗑️',
          description: '除可回收物、有害垃圾、厨余垃圾以外的其他生活废弃物',
          color: '#9E9E9E'
        }
      }
    };
  },
  mounted() {
    this.$refs.searchInput.focus();
  },
  methods: {
    searchItem() {
      if (!this.searchQuery.trim()) return;
      
      const query = this.searchQuery.toLowerCase().trim();
      const result = garbageItems.find(item => 
        item.name.toLowerCase().includes(query)
      );
      
      if (result) {
        this.searchResult = result;
        this.findSimilarItems(result.category, result.name);
        this.currentCategory = null;
      } else {
        alert(`未找到"${this.searchQuery}"的分类信息，请尝试其他关键词`);
        this.searchResult = null;
        this.similarItems = [];
      }
    },
    
    findSimilarItems(category, excludeName) {
      this.similarItems = garbageItems
        .filter(item => item.category === category && item.name !== excludeName)
        .slice(0, 5); // 显示最多5个类似物品
    },
    
    showCategoryItems(category) {
      this.currentCategory = category;
      this.searchResult = null;
      this.similarItems = [];
    },
    
    backToSearch() {
      this.currentCategory = null;
      this.searchResult = null;
      this.similarItems = [];
      this.searchQuery = '';
      this.$refs.searchInput.focus();
    },
    
    selectSimilarItem(item) {
      this.searchResult = item;
      this.findSimilarItems(item.category, item.name);
    },
    
    selectCategoryItem(item) {
      this.searchResult = item;
      this.findSimilarItems(item.category, item.name);
    },
    
    getCategoryItems(category) {
      return garbageItems.filter(item => item.category === category);
    },
    
    getCategoryName(category) {
      return this.categoryInfo[category]?.name || '未知分类';
    },
    
    getCategoryIcon(category) {
      return this.categoryInfo[category]?.icon || '❓';
    },
    
    getCategoryDescription(category) {
      return this.categoryInfo[category]?.description || '';
    }
  }
};
</script>

<style scoped>
.recycling-guide {
  max-width: 1000px;
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

.guide-container {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-section {
  margin-bottom: 30px;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-box input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
}

.search-btn {
  padding: 12px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 5px;
}

.quick-categories h4 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.category-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.category-btn.recyclable {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.category-btn.hazardous {
  background-color: #FFEBEE;
  color: #C62828;
}

.category-btn.kitchen {
  background-color: #F1F8E9;
  color: #558B2F;
}

.category-btn.other {
  background-color: #F5F5F5;
  color: #616161;
}

.category-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.result-section {
  margin-bottom: 30px;
}

.result-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.result-card.recyclable {
  border-left: 4px solid #4CAF50;
}

.result-card.hazardous {
  border-left: 4px solid #F44336;
}

.result-card.kitchen {
  border-left: 4px solid #8BC34A;
}

.result-card.other {
  border-left: 4px solid #9E9E9E;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.result-header h3 {
  margin: 0;
  color: #2c3e50;
}

.category-badge {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 0.9em;
  font-weight: bold;
}

.category-badge.recyclable {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.category-badge.hazardous {
  background-color: #FFEBEE;
  color: #C62828;
}

.category-badge.kitchen {
  background-color: #F1F8E9;
  color: #558B2F;
}

.category-badge.other {
  background-color: #F5F5F5;
  color: #616161;
}

.result-content {
  padding: 20px;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.category-icon-large {
  font-size: 3em;
  flex-shrink: 0;
}

.category-details h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.category-details p {
  margin: 0;
  color: #7f8c8d;
}

.disposal-guide {
  margin-bottom: 20px;
}

.disposal-guide h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.disposal-guide ul {
  margin: 0;
  padding-left: 20px;
}

.disposal-guide li {
  margin-bottom: 5px;
  color: #555;
}

.additional-tips {
  background-color: #E3F2FD;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #2196F3;
}

.additional-tips h4 {
  margin: 0 0 10px 0;
  color: #1565C0;
}

.additional-tips p {
  margin: 0;
  color: #1976D2;
}

.similar-items h4 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.similar-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.similar-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.similar-item:hover {
  background-color: #f1f8e9;
  transform: translateX(5px);
}

.item-name {
  font-weight: 500;
}

.item-category {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}

.item-category.recyclable {
  background-color: #E8F5E9;
  color: #2E7D32;
}

.item-category.hazardous {
  background-color: #FFEBEE;
  color: #C62828;
}

.item-category.kitchen {
  background-color: #F1F8E9;
  color: #558B2F;
}

.item-category.other {
  background-color: #F5F5F5;
  color: #616161;
}

.category-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.back-btn {
  background: none;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  margin-bottom: 10px;
  padding: 0;
}

.back-btn:hover {
  color: #2c3e50;
}

.category-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.item-card {
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.item-card:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.item-name {
  font-weight: bold;
  margin-bottom: 8px;
  color: #2c3e50;
}

.item-guide-preview {
  font-size: 0.9em;
  color: #7f8c8d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.knowledge-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.knowledge-section h3 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 20px;
}

.knowledge-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.knowledge-card {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
}

.knowledge-card h4 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 15px;
}

.knowledge-card ul {
  margin: 0;
  padding-left: 20px;
}

.knowledge-card li {
  margin-bottom: 8px;
  color: #555;
}

.statistics {
  background-color: #E8F5E9;
  padding: 20px;
  border-radius: 8px;
}

.statistics h4 {
  margin-top: 0;
  color: #2E7D32;
  text-align: center;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-item {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 1.8em;
  font-weight: bold;
  color: #4CAF50;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9em;
  color: #7f8c8d;
}

.region-notice {
  margin-top: 20px;
  padding: 15px;
  background-color: #FFF3E0;
  border-radius: 6px;
  border-left: 4px solid #FF9800;
}

.region-notice p {
  margin: 0;
  color: #EF6C00;
}

@media (max-width: 768px) {
  .search-box {
    flex-direction: column;
  }
  
  .category-buttons {
    flex-direction: column;
  }
  
  .category-info {
    flex-direction: column;
    text-align: center;
  }
  
  .items-grid {
    grid-template-columns: 1fr;
  }
  
  .knowledge-cards {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>