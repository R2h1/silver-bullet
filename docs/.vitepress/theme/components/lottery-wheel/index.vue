<template>
  <div class="lottery-wheel">
    <div class="tool-header">
      <h2><i class="fas fa-gift"></i> 抽奖/转盘工具</h2>
      <p>创建自定义抽奖活动，支持转盘和抽奖箱两种模式</p>
    </div>

    <div class="tool-body">
      <div class="mode-selector">
        <button 
          :class="{ active: mode === 'wheel' }" 
          @click="mode = 'wheel'"
        >
          <i class="fas fa-circle"></i> 转盘模式
        </button>
        <button 
          :class="{ active: mode === 'box' }" 
          @click="mode = 'box'"
        >
          <i class="fas fa-cube"></i> 抽奖箱模式
        </button>
      </div>

      <div class="configuration-section">
        <div class="input-group">
          <label>奖项设置</label>
          <div class="prizes-input">
            <div 
              v-for="(prize, index) in prizes" 
              :key="index" 
              class="prize-item"
            >
              <input 
                type="text" 
                v-model="prize.name" 
                :placeholder="`奖项 ${index + 1}`"
              >
              <input 
                type="number" 
                v-model="prize.weight" 
                min="1" 
                max="100" 
                class="weight-input"
                title="权重越高，中奖概率越大"
              >
              <select v-model="prize.color" class="color-select">
                <option 
                  v-for="(color, colorName) in colorOptions" 
                  :key="colorName" 
                  :value="color"
                >
                  {{ colorName }}
                </option>
              </select>
              <button @click="removePrize(index)" class="remove-btn" v-if="prizes.length > 2">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <button @click="addPrize" class="add-prize-btn">
            <i class="fas fa-plus"></i> 添加奖项
          </button>
        </div>

        <div class="settings-group">
          <div class="setting-item">
            <label>抽奖次数</label>
            <input type="number" v-model.number="drawCount" min="1" max="10">
          </div>

          <div class="setting-item">
            <label>是否允许重复中奖</label>
            <input type="checkbox" v-model="allowDuplicates">
          </div>

          <div class="setting-item" v-if="mode === 'wheel'">
            <label>转盘速度</label>
            <input type="range" v-model.number="wheelSpeed" min="1" max="10">
            <span>{{ wheelSpeed }}x</span>
          </div>

          <div class="setting-item" v-if="mode === 'wheel'">
            <label>转盘大小</label>
            <input type="range" v-model.number="wheelSize" min="200" max="500" step="50">
            <span>{{ wheelSize }}px</span>
          </div>
        </div>
      </div>

      <div class="action-section">
        <button @click="startDraw" :disabled="isSpinning || prizes.length < 2" class="draw-btn">
          <i class="fas fa-star"></i> 开始抽奖
        </button>
        <button @click="reset" class="reset-btn">
          <i class="fas fa-redo"></i> 重置
        </button>
      </div>

      <div class="display-section">
        <!-- 转盘模式 -->
        <div v-if="mode === 'wheel'" class="wheel-container">
          <div 
            class="wheel" 
            :style="{ 
              width: `${wheelSize}px`, 
              height: `${wheelSize}px`,
              transform: `rotate(${wheelRotation}deg)`,
              transition: isSpinning ? `transform ${wheelDuration}s cubic-bezier(0.17, 0.67, 0.83, 0.67)` : 'none'
            }"
          >
            <div 
              v-for="(prize, index) in prizes" 
              :key="index" 
              class="wheel-segment"
              :style="{
                transform: `rotate(${index * (360 / prizes.length)}deg)`,
                backgroundColor: prize.color
              }"
            >
              <div class="segment-content">
                <span class="prize-name">{{ prize.name }}</span>
                <span class="prize-weight">{{ prize.weight }}%</span>
              </div>
            </div>
            <div class="wheel-center"></div>
          </div>
          <div class="wheel-pointer"></div>
        </div>

        <!-- 抽奖箱模式 -->
        <div v-if="mode === 'box'" class="box-container">
          <div class="lottery-box">
            <div class="box-content">
              <div 
                v-if="isSpinning" 
                class="spinning-item"
                :style="{ animationDuration: `${boxSpeed}s` }"
              >
                {{ spinningText }}
              </div>
              <div v-else-if="currentResult" class="result-item">
                {{ currentResult }}
              </div>
              <div v-else class="placeholder">
                点击开始抽奖
              </div>
            </div>
          </div>
        </div>

        <div class="results-section" v-if="results.length > 0">
          <h3>抽奖结果</h3>
          <div class="results-list">
            <div 
              v-for="(result, index) in results" 
              :key="index" 
              class="result-item"
            >
              <span class="result-number">#{{ index + 1 }}</span>
              <span class="result-prize">{{ result }}</span>
              <span class="result-time">{{ formatTime(result.timestamp) }}</span>
            </div>
          </div>
          <div class="results-actions">
            <button @click="exportResults" class="export-btn">
              <i class="fas fa-download"></i> 导出结果
            </button>
            <button @click="clearResults" class="clear-btn">
              <i class="fas fa-trash"></i> 清空记录
            </button>
          </div>
        </div>
      </div>

      <div class="statistics-section" v-if="results.length > 0">
        <h3>中奖统计</h3>
        <div class="stats-chart">
          <div 
            v-for="prize in prizes" 
            :key="prize.name" 
            class="stat-item"
          >
            <div class="stat-info">
              <span class="stat-name">{{ prize.name }}</span>
              <span class="stat-count">
                {{ getPrizeCount(prize.name) }}次 ({{ getPrizePercentage(prize.name) }}%)
              </span>
            </div>
            <div class="stat-bar">
              <div 
                class="stat-progress" 
                :style="{ 
                  width: `${getPrizePercentage(prize.name)}%`,
                  backgroundColor: prize.color
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LotteryWheel',
  data() {
    return {
      mode: 'wheel', // 'wheel' or 'box'
      prizes: [
        { name: '一等奖', weight: 10, color: '#ff6b6b' },
        { name: '二等奖', weight: 20, color: '#feca57' },
        { name: '三等奖', weight: 30, color: '#48dbfb' },
        { name: '参与奖', weight: 40, color: '#1dd1a1' }
      ],
      drawCount: 1,
      allowDuplicates: false,
      wheelSpeed: 5,
      wheelSize: 350,
      wheelRotation: 0,
      wheelDuration: 5,
      isSpinning: false,
      results: [],
      currentResult: null,
      boxSpeed: 0.5,
      spinningText: '',
      colorOptions: {
        '红色': '#ff6b6b',
        '橙色': '#ff9ff3',
        '黄色': '#feca57',
        '绿色': '#1dd1a1',
        '蓝色': '#48dbfb',
        '紫色': '#a29bfe',
        '粉色': '#ff9ff3',
        '灰色': '#c8d6e5'
      }
    };
  },
  computed: {
    totalWeight() {
      return this.prizes.reduce((sum, prize) => sum + prize.weight, 0);
    }
  },
  methods: {
    addPrize() {
      const colors = Object.values(this.colorOptions);
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      this.prizes.push({
        name: '',
        weight: 10,
        color: randomColor
      });
    },
    removePrize(index) {
      this.prizes.splice(index, 1);
    },
    startDraw() {
      if (this.prizes.length < 2) {
        alert('请至少添加两个奖项');
        return;
      }

      this.isSpinning = true;
      
      if (this.mode === 'wheel') {
        this.spinWheel();
      } else {
        this.drawFromBox();
      }
    },
    spinWheel() {
      // 计算权重并随机选择奖项
      const randomNum = Math.random() * this.totalWeight;
      let accumulatedWeight = 0;
      let selectedPrize = null;
      
      for (const prize of this.prizes) {
        accumulatedWeight += prize.weight;
        if (randomNum <= accumulatedWeight) {
          selectedPrize = prize;
          break;
        }
      }
      
      // 计算旋转角度（多转几圈然后停在选中的奖项）
      const segmentAngle = 360 / this.prizes.length;
      const currentRotation = this.wheelRotation % 360;
      const targetSegment = this.prizes.findIndex(p => p.name === selectedPrize.name);
      const targetAngle = 3600 + (targetSegment * segmentAngle) - (currentRotation % 360);
      
      this.wheelRotation += targetAngle;
      this.wheelDuration = 3 + (this.wheelSpeed / 2);
      
      // 动画结束后显示结果
      setTimeout(() => {
        this.isSpinning = false;
        this.showResult(selectedPrize.name);
      }, this.wheelDuration * 1000);
    },
    drawFromBox() {
      // 抽奖箱模式的动画效果
      let iterations = 0;
      const maxIterations = 20;
      const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * this.prizes.length);
        this.spinningText = this.prizes[randomIndex].name;
        
        iterations++;
        if (iterations >= maxIterations) {
          clearInterval(interval);
          
          // 计算权重并选择最终奖项
          const randomNum = Math.random() * this.totalWeight;
          let accumulatedWeight = 0;
          let selectedPrize = null;
          
          for (const prize of this.prizes) {
            accumulatedWeight += prize.weight;
            if (randomNum <= accumulatedWeight) {
              selectedPrize = prize;
              break;
            }
          }
          
          this.isSpinning = false;
          this.showResult(selectedPrize.name);
        }
      }, this.boxSpeed * 100);
    },
    showResult(prizeName) {
      this.currentResult = prizeName;
      
      // 检查是否允许重复中奖
      if (!this.allowDuplicates) {
        // 如果不允许重复，减少该奖项的权重
        const prizeIndex = this.prizes.findIndex(p => p.name === prizeName);
        if (prizeIndex !== -1) {
          // 保存原始权重以便后续恢复
          if (!this.prizes[prizeIndex].originalWeight) {
            this.prizes[prizeIndex].originalWeight = this.prizes[prizeIndex].weight;
          }
          this.prizes[prizeIndex].weight = 0;
        }
      }
      
      // 记录结果
      this.results.unshift({
        prize: prizeName,
        timestamp: new Date()
      });
      
      // 如果抽奖次数大于1，继续抽奖
      if (this.drawCount > 1 && this.results.length < this.drawCount) {
        setTimeout(() => {
          this.startDraw();
        }, 1000);
      }
    },
    reset() {
      // 恢复所有奖项的原始权重
      this.prizes.forEach(prize => {
        if (prize.originalWeight) {
          prize.weight = prize.originalWeight;
          delete prize.originalWeight;
        }
      });
      
      this.wheelRotation = 0;
      this.isSpinning = false;
      this.currentResult = null;
    },
    clearResults() {
      this.results = [];
    },
    exportResults() {
      const content = this.results.map((result, index) => 
        `${index + 1}. ${result.prize} - ${this.formatTime(result.timestamp)}`
      ).join('\n');
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `抽奖结果_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    formatTime(timestamp) {
      const date = new Date(timestamp);
      return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    },
    getPrizeCount(prizeName) {
      return this.results.filter(result => result.prize === prizeName).length;
    },
    getPrizePercentage(prizeName) {
      if (this.results.length === 0) return 0;
      const count = this.getPrizeCount(prizeName);
      return ((count / this.results.length) * 100).toFixed(1);
    }
  }
}
</script>

<style scoped>
.lottery-wheel {
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

.mode-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  gap: 15px;
}

.mode-selector button {
  padding: 10px 20px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-selector button:hover {
  background: #e9ecef;
}

.mode-selector button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.configuration-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 25px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-weight: 600;
  margin-bottom: 10px;
  color: #2c3e50;
}

.prizes-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.prize-item {
  display: grid;
  grid-template-columns: 1fr 80px 100px auto;
  gap: 10px;
  align-items: center;
}

.prize-item input[type="text"] {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.weight-input {
  width: 60px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.color-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.remove-btn {
  padding: 6px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-prize-btn {
  padding: 8px 12px;
  background: #2ecc71;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  align-self: flex-start;
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.setting-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.setting-item label {
  font-weight: 600;
  color: #2c3e50;
}

.setting-item input[type="number"] {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 80px;
}

.action-section {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
}

.draw-btn, .reset-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.draw-btn {
  background: #2ecc71;
  color: white;
}

.draw-btn:hover:not(:disabled) {
  background: #27ae60;
}

.draw-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.reset-btn {
  background: #e74c3c;
  color: white;
}

.reset-btn:hover {
  background: #c0392b;
}

.display-section {
  margin-bottom: 30px;
}

.wheel-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.wheel {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.wheel-segment {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 50%;
  transform-origin: 0% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.segment-content {
  position: absolute;
  left: 30px;
  bottom: 30px;
  transform: rotate(45deg);
  text-align: center;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.prize-name {
  display: block;
  font-weight: bold;
  font-size: 14px;
}

.prize-weight {
  font-size: 12px;
}

.wheel-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  border: 4px solid #3498db;
  z-index: 10;
}

.wheel-pointer {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 30px solid #e74c3c;
  z-index: 5;
}

.box-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.lottery-box {
  width: 200px;
  height: 150px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.lottery-box::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
}

.box-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
}

.spinning-item {
  animation: spin 0.5s infinite;
}

@keyframes spin {
  0% { transform: translateY(-20px); opacity: 0; }
  50% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(20px); opacity: 0; }
}

.results-section {
  margin-top: 30px;
}

.results-section h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.results-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 15px;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 10px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #f1f1f1;
}

.result-item:last-child {
  border-bottom: none;
}

.result-number {
  font-weight: bold;
  color: #3498db;
  min-width: 30px;
}

.result-prize {
  flex: 1;
  font-weight: 500;
}

.result-time {
  color: #7f8c8d;
  font-size: 12px;
}

.results-actions {
  display: flex;
  gap: 10px;
}

.export-btn, .clear-btn {
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.export-btn:hover {
  background: #3498db;
  color: white;
}

.clear-btn:hover {
  background: #e74c3c;
  color: white;
}

.statistics-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.statistics-section h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.stats-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-info {
  display: flex;
  justify-content: space-between;
  min-width: 200px;
}

.stat-name {
  font-weight: 500;
}

.stat-count {
  color: #7f8c8d;
  font-size: 14px;
}

.stat-bar {
  flex: 1;
  height: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  overflow: hidden;
}

.stat-progress {
  height: 100%;
  border-radius: 10px;
  transition: width 0.5s ease;
}

@media (max-width: 768px) {
  .configuration-section {
    grid-template-columns: 1fr;
  }
  
  .prize-item {
    grid-template-columns: 1fr;
    gap: 5px;
  }
  
  .wheel {
    width: 250px !important;
    height: 250px !important;
  }
  
  .segment-content {
    left: 20px;
    bottom: 20px;
  }
  
  .prize-name {
    font-size: 12px;
  }
  
  .prize-weight {
    font-size: 10px;
  }
}
</style>