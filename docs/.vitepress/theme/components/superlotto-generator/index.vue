<template>
  <div class="superlotto-generator">
    <div class="generator-header">
      <h2>超级大乐透生成器</h2>
      <p>随机生成符合规则的大乐透号码</p>
    </div>

    <div class="generator-controls">
      <div class="control-group">
        <label for="batch-count">生成注数：</label>
        <select id="batch-count" v-model="batchCount">
          <option v-for="n in 10" :key="n" :value="n">{{ n }}注</option>
        </select>
      </div>
      
      <div class="control-buttons">
        <button class="generate-btn" @click="generateNumbers">生成号码</button>
        <button class="clear-btn" @click="clearHistory">清空记录</button>
      </div>
    </div>

    <div class="results-container">
      <div class="current-result" v-if="currentNumbers.length > 0">
        <h3>最新生成</h3>
        <div class="numbers-display">
          <div class="front-area">
            <span class="area-label">前区</span>
            <span 
              v-for="num in currentNumbers.front" 
              :key="'front-'+num" 
              class="ball front-ball"
            >{{ num }}</span>
          </div>
          <div class="back-area">
            <span class="area-label">后区</span>
            <span 
              v-for="num in currentNumbers.back" 
              :key="'back-'+num" 
              class="ball back-ball"
            >{{ num }}</span>
          </div>
        </div>
      </div>

      <div class="batch-results" v-if="batchResults.length > 0">
        <h3>批量生成结果 ({{ batchCount }}注)</h3>
        <div class="batch-list">
          <div 
            v-for="(result, index) in batchResults" 
            :key="'batch-'+index" 
            class="batch-item"
          >
            <div class="batch-index">第{{ index + 1 }}注：</div>
            <div class="batch-numbers">
              <span class="ball front-ball" v-for="num in result.front" :key="'batch-front-'+num">{{ num }}</span>
              <span class="separator">+</span>
              <span class="ball back-ball" v-for="num in result.back" :key="'batch-back-'+num">{{ num }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="history-section" v-if="history.length > 0">
      <div class="section-header">
        <h3>历史记录</h3>
        <span class="history-count">({{ history.length }}条)</span>
      </div>
      <div class="history-list">
        <div 
          v-for="(item, index) in history" 
          :key="'history-'+index" 
          class="history-item"
          @click="selectFromHistory(item)"
        >
          <div class="history-numbers">
            <span class="ball front-ball" v-for="num in item.front" :key="'history-front-'+num">{{ num }}</span>
            <span class="separator">+</span>
            <span class="ball back-ball" v-for="num in item.back" :key="'history-back-'+num">{{ num }}</span>
          </div>
          <div class="history-time">{{ formatTime(item.time) }}</div>
        </div>
      </div>
    </div>

    <div class="stats-section" v-if="stats.front.length > 0 || stats.back.length > 0">
      <h3>号码出现频率统计</h3>
      <div class="stats-container">
        <div class="front-stats">
          <h4>前区号码 (1-35)</h4>
          <div class="stats-bars">
            <div 
              v-for="n in 35" 
              :key="'stat-front-'+n" 
              class="stat-item"
              :class="{ highlighted: stats.front[n] > 0 }"
            >
              <span class="stat-number">{{ n }}</span>
              <div class="stat-bar-container">
                <div 
                  class="stat-bar" 
                  :style="{ width: calculateBarWidth(stats.front[n] || 0, Math.max(...Object.values(stats.front))) }"
                ></div>
              </div>
              <span class="stat-count">{{ stats.front[n] || 0 }}</span>
            </div>
          </div>
        </div>
        
        <div class="back-stats">
          <h4>后区号码 (1-12)</h4>
          <div class="stats-bars">
            <div 
              v-for="n in 12" 
              :key="'stat-back-'+n" 
              class="stat-item"
              :class="{ highlighted: stats.back[n] > 0 }"
            >
              <span class="stat-number">{{ n }}</span>
              <div class="stat-bar-container">
                <div 
                  class="stat-bar" 
                  :style="{ width: calculateBarWidth(stats.back[n] || 0, Math.max(...Object.values(stats.back))) }"
                ></div>
              </div>
              <span class="stat-count">{{ stats.back[n] || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="empty-state" v-if="history.length === 0">
      <div class="empty-icon">🎰</div>
      <p>点击"生成号码"开始生成大乐透号码</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 常量定义
const FRONT_POOL = Array.from({ length: 35 }, (_, i) => i + 1)
const BACK_POOL = Array.from({ length: 12 }, (_, i) => i + 1)
const FRONT_COUNT = 5
const BACK_COUNT = 2
const MAX_HISTORY = 50

// 响应式数据
const batchCount = ref(1)
const currentNumbers = ref({ front: [], back: [] })
const batchResults = ref([])
const history = ref([])
const stats = ref({ front: {}, back: {} })

// 生成随机号码
const generateRandomNumbers = () => {
  // 复制数组以避免修改原数组
  const frontPool = [...FRONT_POOL]
  const backPool = [...BACK_POOL]
  const frontNumbers = []
  const backNumbers = []
  
  // 随机选择前区号码
  for (let i = 0; i < FRONT_COUNT; i++) {
    const randomIndex = Math.floor(Math.random() * frontPool.length)
    frontNumbers.push(frontPool.splice(randomIndex, 1)[0])
  }
  
  // 随机选择后区号码
  for (let i = 0; i < BACK_COUNT; i++) {
    const randomIndex = Math.floor(Math.random() * backPool.length)
    backNumbers.push(backPool.splice(randomIndex, 1)[0])
  }
  
  // 排序号码
  return {
    front: frontNumbers.sort((a, b) => a - b),
    back: backNumbers.sort((a, b) => a - b)
  }
}

// 生成号码
const generateNumbers = () => {
  const results = []
  
  for (let i = 0; i < batchCount.value; i++) {
    results.push(generateRandomNumbers())
  }
  
  // 更新当前显示
  currentNumbers.value = results[0]
  batchResults.value = results
  
  // 添加到历史记录
  const timestamp = new Date()
  results.forEach(result => {
    history.value.unshift({
      ...result,
      time: timestamp
    })
  })
  
  // 限制历史记录数量
  if (history.value.length > MAX_HISTORY) {
    history.value = history.value.slice(0, MAX_HISTORY)
  }
  
  // 更新统计
  updateStats()
}

// 更新统计信息
const updateStats = () => {
  const newStats = { front: {}, back: {} }
  
  history.value.forEach(item => {
    item.front.forEach(num => {
      newStats.front[num] = (newStats.front[num] || 0) + 1
    })
    
    item.back.forEach(num => {
      newStats.back[num] = (newStats.back[num] || 0) + 1
    })
  })
  
  stats.value = newStats
}

// 清空历史记录
const clearHistory = () => {
  history.value = []
  stats.value = { front: {}, back: {} }
  batchResults.value = []
  currentNumbers.value = { front: [], back: [] }
}

// 从历史记录中选择
const selectFromHistory = (item) => {
  currentNumbers.value = { ...item }
}

// 格式化时间
const formatTime = (time) => {
  return new Date(time).toLocaleTimeString()
}

// 计算条形图宽度
const calculateBarWidth = (value, maxValue) => {
  if (maxValue === 0) return '0%'
  return `${(value / maxValue) * 100}%`
}

// 初始化
onMounted(() => {
  // 可以在这里加载本地存储的历史记录
})
</script>

<style scoped>
.superlotto-generator {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.generator-header {
  text-align: center;
  margin-bottom: 30px;
}

.generator-header h2 {
  color: #2c3e50;
  margin-bottom: 8px;
}

.generator-header p {
  color: #7f8c8d;
  margin: 0;
}

.generator-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-group label {
  font-weight: 500;
}

.control-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: white;
}

.control-buttons {
  display: flex;
  gap: 10px;
}

.generate-btn, .clear-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.generate-btn {
  background-color: #3498db;
  color: white;
}

.generate-btn:hover {
  background-color: #2980b9;
}

.clear-btn {
  background-color: #e74c3c;
  color: white;
}

.clear-btn:hover {
  background-color: #c0392b;
}

.results-container {
  margin-bottom: 30px;
}

.current-result, .batch-results {
  margin-bottom: 25px;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h3 {
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.numbers-display {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.front-area, .back-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.area-label {
  font-weight: 600;
  min-width: 40px;
  color: #7f8c8d;
}

.ball {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: 600;
  color: white;
}

.front-ball {
  background-color: #3498db;
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.3);
}

.back-ball {
  background-color: #e74c3c;
  box-shadow: 0 2px 4px rgba(231, 76, 60, 0.3);
}

.batch-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 348px;
  overflow-y: auto;
}

.batch-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.batch-index {
  font-weight: 500;
  min-width: 60px;
}

.batch-numbers {
  display: flex;
  align-items: center;
  gap: 8px;
}

.separator {
  margin: 0 5px;
  font-weight: 600;
  color: #7f8c8d;
}

.history-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.history-count {
  color: #7f8c8d;
  font-size: 0.9em;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 348px;
  overflow-y: auto;
  padding: 6px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  background-color: #f1f8ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.history-numbers {
  display: flex;
  align-items: center;
  gap: 8px;
}

.history-time {
  color: #7f8c8d;
  font-size: 0.9em;
}

.stats-section {
  margin-bottom: 30px;
}

.stats-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.front-stats, .back-stats {
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.stats-bars {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px;
}

.stat-item.highlighted .stat-number {
  font-weight: 600;
  color: #2c3e50;
}

.stat-number {
  min-width: 20px;
  text-align: center;
  font-size: 0.9em;
  color: #7f8c8d;
}

.stat-bar-container {
  flex-grow: 1;
  height: 8px;
  background-color: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.stat-bar {
  height: 100%;
  background-color: #3498db;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.back-stats .stat-bar {
  background-color: #e74c3c;
}

.stat-count {
  min-width: 20px;
  text-align: right;
  font-size: 0.9em;
  font-weight: 600;
  color: #2c3e50;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .generator-controls {
    flex-direction: column;
  }
  
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .history-time {
    align-self: flex-end;
  }
  
  .stats-bars {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }
}

@media (max-width: 480px) {
  .superlotto-generator {
    padding: 15px;
  }
  
  .front-area, .back-area {
    flex-wrap: wrap;
  }
  
  .batch-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .stats-bars {
    grid-template-columns: 1fr;
  }
}
</style>