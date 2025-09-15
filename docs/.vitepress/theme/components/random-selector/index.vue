<template>
  <div class="random-selector">
    <div class="tool-header">
      <h2>随机选择器</h2>
      <p>从多个选项中随机选择，解决您的选择困难症</p>
    </div>

    <div class="selector-container">
      <div class="input-section">
        <div class="input-group">
          <label for="options-input">输入选项（每行一个选项）</label>
          <textarea
            id="options-input"
            v-model="optionsText"
            placeholder="请输入选项，每行一个
例如：
火锅
烧烤
日料
西餐"
            rows="8"
            @input="updateOptions"
          ></textarea>
          <div class="input-info">
            <span>当前选项数: {{ options.length }}</span>
            <span v-if="options.length > 0">示例: {{ sampleOption }}</span>
          </div>
        </div>

        <div class="quick-options">
          <h4>快速添加常用选项</h4>
          <div class="quick-buttons">
            <button 
              v-for="preset in presetOptions" 
              :key="preset.name"
              @click="addPresetOptions(preset.options)"
              class="preset-btn"
            >
              {{ preset.name }}
            </button>
          </div>
        </div>
      </div>

      <div class="control-section">
        <div class="settings">
          <h4>选择设置</h4>
          <div class="setting-group">
            <label>
              <input type="checkbox" v-model="allowDuplicates" />
              允许重复选择同一选项
            </label>
            <label v-if="allowDuplicates">
              选择次数:
              <input 
                type="number" 
                v-model.number="selectionCount" 
                min="1" 
                :max="maxSelections"
                class="number-input"
              />
            </label>
          </div>
        </div>

        <div class="action-buttons">
          <button 
            @click="startSelection" 
            :disabled="options.length < 2"
            class="select-btn"
          >
            {{ isSelecting ? '停止选择' : '开始选择' }}
          </button>
          <button @click="clearAll" class="clear-btn">清空所有</button>
        </div>
      </div>

      <div class="result-section" v-if="selectedOptions.length > 0">
        <h3>选择结果</h3>
        <div class="results">
          <div 
            v-for="(option, index) in selectedOptions" 
            :key="index"
            class="result-item"
            :class="{ highlight: index === selectedOptions.length - 1 && !isSelecting }"
          >
            <span class="result-number">{{ index + 1 }}.</span>
            <span class="result-text">{{ option }}</span>
          </div>
        </div>
        
        <div class="result-actions" v-if="selectedOptions.length > 0">
          <button @click="copyResults" class="action-btn">
            <span class="icon">📋</span> 复制结果
          </button>
          <button @click="shareResults" class="action-btn">
            <span class="icon">🔗</span> 分享结果
          </button>
        </div>
      </div>

      <div class="animation-container" v-if="isSelecting">
        <div class="spinning-wheel">
          <div class="wheel-content">
            <div class="option-display">{{ currentOption }}</div>
            <div class="spinner"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RandomSelector',
  data() {
    return {
      optionsText: '',
      options: [],
      selectedOptions: [],
      isSelecting: false,
      selectionInterval: null,
      currentOption: '',
      allowDuplicates: false,
      selectionCount: 1,
      presetOptions: [
        {
          name: '午餐选择',
          options: ['米饭', '面条', '饺子', '汉堡', '沙拉', '三明治']
        },
        {
          name: '晚餐选择',
          options: ['火锅', '烧烤', '日料', '西餐', '中餐', '快餐']
        },
        {
          name: '周末活动',
          options: ['看电影', '逛街', '公园散步', '运动', '读书', '玩游戏']
        },
        {
          name: '颜色选择',
          options: ['红色', '蓝色', '绿色', '黄色', '紫色', '橙色']
        }
      ]
    };
  },
  computed: {
    sampleOption() {
      return this.options[Math.floor(Math.random() * this.options.length)];
    },
    maxSelections() {
      return this.allowDuplicates ? 100 : this.options.length;
    }
  },
  watch: {
    selectionCount(newVal) {
      if (newVal > this.maxSelections) {
        this.selectionCount = this.maxSelections;
      } else if (newVal < 1) {
        this.selectionCount = 1;
      }
    },
    allowDuplicates(newVal) {
      if (!newVal && this.selectionCount > this.options.length) {
        this.selectionCount = this.options.length;
      }
    }
  },
  methods: {
    updateOptions() {
      this.options = this.optionsText
        .split('\n')
        .map(option => option.trim())
        .filter(option => option.length > 0);
    },
    
    addPresetOptions(presetOptions) {
      const newOptions = [...this.options];
      presetOptions.forEach(option => {
        if (!newOptions.includes(option)) {
          newOptions.push(option);
        }
      });
      
      this.optionsText = newOptions.join('\n');
      this.updateOptions();
    },
    
    startSelection() {
      if (this.options.length < 2) {
        alert('请至少添加两个选项');
        return;
      }
      
      if (this.isSelecting) {
        // 停止选择
        this.stopSelection();
        return;
      }
      
      // 开始选择
      this.isSelecting = true;
      this.selectedOptions = [];
      
      // 设置选项切换动画
      let speed = 100; // 初始速度
      const slowDownThreshold = 1500; // 2秒后开始减速
      const startTime = Date.now();
      
      const animateSelection = () => {
        const elapsed = Date.now() - startTime;
        
        // 随时间减慢速度
        if (elapsed > slowDownThreshold) {
          const progress = (elapsed - slowDownThreshold) / 2000; // 再花2秒减速
          speed = 100 + Math.floor(progress * 300);
          
          if (progress > 1) {
            this.finalizeSelection();
            return;
          }
        }
        
        this.currentOption = this.getRandomOption();
        this.selectionInterval = setTimeout(animateSelection, speed);
      };
      
      animateSelection();
    },
    
    stopSelection() {
      if (this.selectionInterval) {
        clearTimeout(this.selectionInterval);
        this.selectionInterval = null;
      }
      this.isSelecting = false;
    },
    
    finalizeSelection() {
      this.stopSelection();
      
      // 确定最终选择
      const availableOptions = this.allowDuplicates 
        ? this.options 
        : this.options.filter(option => !this.selectedOptions.includes(option));
      
      for (let i = 0; i < this.selectionCount; i++) {
        if (availableOptions.length === 0) break;
        
        const randomIndex = Math.floor(Math.random() * availableOptions.length);
        const selectedOption = availableOptions[randomIndex];
        
        this.selectedOptions.push(selectedOption);
        
        if (!this.allowDuplicates) {
          availableOptions.splice(randomIndex, 1);
        }
      }
      
      this.currentOption = this.selectedOptions[this.selectedOptions.length - 1];
    },
    
    getRandomOption() {
      return this.options[Math.floor(Math.random() * this.options.length)];
    },
    
    clearAll() {
      this.optionsText = '';
      this.options = [];
      this.selectedOptions = [];
      this.stopSelection();
    },
    
    copyResults() {
      const text = this.selectedOptions.join('\n');
      navigator.clipboard.writeText(text).then(() => {
        alert('结果已复制到剪贴板');
      }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制');
      });
    },
    
    shareResults() {
      if (navigator.share) {
        navigator.share({
          title: '随机选择结果',
          text: this.selectedOptions.join('\n')
        }).catch(err => {
          console.error('分享失败:', err);
        });
      } else {
        alert('您的浏览器不支持分享功能，请使用复制功能');
      }
    }
  },
  beforeUnmount() {
    this.stopSelection();
  }
};
</script>

<style scoped>
.random-selector {
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

.selector-container {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: relative;
}

.input-section {
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

.input-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.3s;
}

.input-group textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.input-info {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.9em;
  color: #95a5a6;
}

.quick-options h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quick-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-btn {
  padding: 8px 12px;
  background-color: #e9ecef;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s;
}

.preset-btn:hover {
  background-color: #dee2e6;
}

.control-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.settings h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95em;
}

.number-input {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.select-btn, .clear-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.select-btn {
  background-color: #3498db;
  color: white;
}

.select-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.select-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.clear-btn {
  background-color: #e74c3c;
  color: white;
}

.clear-btn:hover {
  background-color: #c0392b;
}

.result-section {
  border-top: 1px solid #e9ecef;
  padding-top: 20px;
}

.result-section h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.results {
  margin-bottom: 15px;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.result-item.highlight {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
  transform: scale(1.02);
}

.result-number {
  font-weight: bold;
  color: #3498db;
  margin-right: 10px;
  min-width: 25px;
}

.result-text {
  flex: 1;
}

.result-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  padding: 8px 16px;
  background-color: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #e9ecef;
}

.animation-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.spinning-wheel {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: pop-in 0.3s ease-out;
}

.wheel-content {
  position: relative;
}

.option-display {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 20px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pop-in {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 768px) {
  .control-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: space-between;
  }
  
  .select-btn, .clear-btn {
    flex: 1;
  }
  
  .spinning-wheel {
    width: 80%;
    padding: 20px;
  }
  
  .option-display {
    font-size: 20px;
  }
}
</style>