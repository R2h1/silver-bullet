<template>
  <div class="unit-converter">
    <div class="tool-header">
      <h2>📏 单位转换器</h2>
      <p>转换各种度量单位，包括长度、重量、温度、时间、速度等</p>
    </div>

    <div class="converter-container">
      <!-- 类别选择 -->
      <div class="category-tabs">
        <button
          v-for="category in categories"
          :key="category.id"
          :class="['category-btn', { active: activeCategory === category.id }]"
          @click="setActiveCategory(category.id)"
        >
          {{ category.icon }} {{ category.name }}
        </button>
      </div>

      <!-- 转换区域 -->
      <div class="conversion-area">
        <div class="input-section">
          <h3>输入</h3>
          <input
            type="number"
            v-model="inputValue"
            placeholder="输入数值"
            class="value-input"
            step="any"
            @input="convertUnits"
          >
          <select v-model="fromUnit" @change="convertUnits" class="unit-select">
            <option v-for="unit in getUnitsForCategory(activeCategory)" :key="unit.id" :value="unit.id">
              {{ unit.name }} ({{ unit.symbol }})
            </option>
          </select>
        </div>

        <div class="conversion-actions">
          <button class="action-btn" @click="swapUnits" title="交换单位">
            🔄
          </button>
          <div class="equals-sign">=</div>
        </div>

        <div class="output-section">
          <h3>结果</h3>
          <input
            type="text"
            :value="outputValue"
            readonly
            class="value-input output"
            placeholder="结果将显示在这里"
          >
          <select v-model="toUnit" @change="convertUnits" class="unit-select">
            <option v-for="unit in getUnitsForCategory(activeCategory)" :key="unit.id" :value="unit.id">
              {{ unit.name }} ({{ unit.symbol }})
            </option>
          </select>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="primary-btn" @click="addToHistory" :disabled="!inputValue || !outputValue">
          💾 保存到历史
        </button>
        <button class="secondary-btn" @click="clearAll">
          🗑️ 清空
        </button>
        <button class="secondary-btn" @click="copyResult" :disabled="!outputValue">
          📋 复制结果
        </button>
      </div>

      <!-- 历史记录 -->
      <div class="history-section" v-if="history.length > 0">
        <h3>历史记录</h3>
        <div class="history-list">
          <div
            v-for="(item, index) in history"
            :key="index"
            class="history-item"
            @click="loadFromHistory(item)"
          >
            <div class="history-value">{{ item.input }} {{ getUnitSymbol(item.fromUnit) }}</div>
            <div class="history-arrow">→</div>
            <div class="history-value">{{ item.output }} {{ getUnitSymbol(item.toUnit) }}</div>
            <button class="history-delete" @click.stop="deleteHistoryItem(index)">×</button>
          </div>
        </div>
      </div>

      <!-- 常用转换 -->
      <div class="common-conversions">
        <h3>常用转换</h3>
        <div class="common-list">
          <button
            v-for="conversion in getCommonConversions(activeCategory)"
            :key="conversion.name"
            class="common-btn"
            @click="setCommonConversion(conversion)"
          >
            {{ conversion.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- 通知 -->
    <div class="notification" :class="{ show: showNotification }">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

// 单位数据
const unitData = {
  length: [
    { id: 'm', name: '米', symbol: 'm', factor: 1 },
    { id: 'cm', name: '厘米', symbol: 'cm', factor: 0.01 },
    { id: 'mm', name: '毫米', symbol: 'mm', factor: 0.001 },
    { id: 'km', name: '千米', symbol: 'km', factor: 1000 },
    { id: 'in', name: '英寸', symbol: 'in', factor: 0.0254 },
    { id: 'ft', name: '英尺', symbol: 'ft', factor: 0.3048 },
    { id: 'yd', name: '码', symbol: 'yd', factor: 0.9144 },
    { id: 'mi', name: '英里', symbol: 'mi', factor: 1609.34 },
    { id: 'nmi', name: '海里', symbol: 'nmi', factor: 1852 },
    { id: 'ly', name: '光年', symbol: 'ly', factor: 9.461e15 }
  ],
  weight: [
    { id: 'g', name: '克', symbol: 'g', factor: 1 },
    { id: 'kg', name: '千克', symbol: 'kg', factor: 1000 },
    { id: 'mg', name: '毫克', symbol: 'mg', factor: 0.001 },
    { id: 't', name: '吨', symbol: 't', factor: 1e6 },
    { id: 'oz', name: '盎司', symbol: 'oz', factor: 28.3495 },
    { id: 'lb', name: '磅', symbol: 'lb', factor: 453.592 },
    { id: 'st', name: '英石', symbol: 'st', factor: 6350.29 }
  ],
  temperature: [
    { id: 'c', name: '摄氏度', symbol: '°C', isTemperature: true },
    { id: 'f', name: '华氏度', symbol: '°F', isTemperature: true },
    { id: 'k', name: '开尔文', symbol: 'K', isTemperature: true },
    { id: 'r', name: '兰氏度', symbol: '°R', isTemperature: true }
  ],
  time: [
    { id: 's', name: '秒', symbol: 's', factor: 1 },
    { id: 'ms', name: '毫秒', symbol: 'ms', factor: 0.001 },
    { id: 'μs', name: '微秒', symbol: 'μs', factor: 1e-6 },
    { id: 'ns', name: '纳秒', symbol: 'ns', factor: 1e-9 },
    { id: 'min', name: '分钟', symbol: 'min', factor: 60 },
    { id: 'h', name: '小时', symbol: 'h', factor: 3600 },
    { id: 'day', name: '天', symbol: 'day', factor: 86400 },
    { id: 'week', name: '周', symbol: 'week', factor: 604800 },
    { id: 'month', name: '月', symbol: 'month', factor: 2.628e6 },
    { id: 'year', name: '年', symbol: 'year', factor: 3.154e7 }
  ],
  speed: [
    { id: 'm_s', name: '米/秒', symbol: 'm/s', factor: 1 },
    { id: 'km_h', name: '千米/小时', symbol: 'km/h', factor: 0.277778 },
    { id: 'mph', name: '英里/小时', symbol: 'mph', factor: 0.44704 },
    { id: 'kn', name: '节', symbol: 'kn', factor: 0.514444 },
    { id: 'mach', name: '马赫', symbol: 'Mach', factor: 340.3 },
    { id: 'c', name: '光速', symbol: 'c', factor: 299792458 }
  ],
  area: [
    { id: 'm2', name: '平方米', symbol: 'm²', factor: 1 },
    { id: 'km2', name: '平方千米', symbol: 'km²', factor: 1e6 },
    { id: 'ha', name: '公顷', symbol: 'ha', factor: 10000 },
    { id: 'in2', name: '平方英寸', symbol: 'in²', factor: 0.00064516 },
    { id: 'ft2', name: '平方英尺', symbol: 'ft²', factor: 0.092903 },
    { id: 'yd2', name: '平方码', symbol: 'yd²', factor: 0.836127 },
    { id: 'acre', name: '英亩', symbol: 'acre', factor: 4046.86 },
    { id: 'mi2', name: '平方英里', symbol: 'mi²', factor: 2.59e6 }
  ],
  volume: [
    { id: 'm3', name: '立方米', symbol: 'm³', factor: 1 },
    { id: 'l', name: '升', symbol: 'L', factor: 0.001 },
    { id: 'ml', name: '毫升', symbol: 'mL', factor: 1e-6 },
    { id: 'in3', name: '立方英寸', symbol: 'in³', factor: 1.6387e-5 },
    { id: 'ft3', name: '立方英尺', symbol: 'ft³', factor: 0.0283168 },
    { id: 'yd3', name: '立方码', symbol: 'yd³', factor: 0.764555 },
    { id: 'gal', name: '加仑', symbol: 'gal', factor: 0.00378541 },
    { id: 'qt', name: '夸脱', symbol: 'qt', factor: 0.000946353 },
    { id: 'pt', name: '品脱', symbol: 'pt', factor: 0.000473176 }
  ],
  data: [
    { id: 'b', name: '位', symbol: 'b', factor: 1 },
    { id: 'B', name: '字节', symbol: 'B', factor: 8 },
    { id: 'KB', name: '千字节', symbol: 'KB', factor: 8192 },
    { id: 'MB', name: '兆字节', symbol: 'MB', factor: 8388608 },
    { id: 'GB', name: '千兆字节', symbol: 'GB', factor: 8589934592 },
    { id: 'TB', name: '太字节', symbol: 'TB', factor: 8.796e12 },
    { id: 'PB', name: '拍字节', symbol: 'PB', factor: 9.007e15 },
    { id: 'EB', name: '艾字节', symbol: 'EB', factor: 9.223e18 }
  ]
}

// 常用转换预设
const commonConversions = {
  length: [
    { name: '英寸到厘米', from: 'in', to: 'cm' },
    { name: '英尺到米', from: 'ft', to: 'm' },
    { name: '英里到千米', from: 'mi', to: 'km' },
    { name: '厘米到英寸', from: 'cm', to: 'in' },
    { name: '米到英尺', from: 'm', to: 'ft' },
    { name: '千米到英里', from: 'km', to: 'mi' }
  ],
  weight: [
    { name: '磅到千克', from: 'lb', to: 'kg' },
    { name: '盎司到克', from: 'oz', to: 'g' },
    { name: '千克到磅', from: 'kg', to: 'lb' },
    { name: '克到盎司', from: 'g', to: 'oz' }
  ],
  temperature: [
    { name: '摄氏度到华氏度', from: 'c', to: 'f' },
    { name: '华氏度到摄氏度', from: 'f', to: 'c' },
    { name: '摄氏度到开尔文', from: 'c', to: 'k' }
  ],
  time: [
    { name: '小时到分钟', from: 'h', to: 'min' },
    { name: '天到小时', from: 'day', to: 'h' },
    { name: '周到天', from: 'week', to: 'day' }
  ],
  speed: [
    { name: '千米/小时到米/秒', from: 'km_h', to: 'm_s' },
    { name: '英里/小时到千米/小时', from: 'mph', to: 'km_h' }
  ],
  area: [
    { name: '平方米到平方英尺', from: 'm2', to: 'ft2' },
    { name: '英亩到平方米', from: 'acre', to: 'm2' }
  ],
  volume: [
    { name: '升到加仑', from: 'l', to: 'gal' },
    { name: '加仑到升', from: 'gal', to: 'l' }
  ],
  data: [
    { name: '兆字节到千字节', from: 'MB', to: 'KB' },
    { name: '千兆字节到兆字节', from: 'GB', to: 'MB' }
  ]
}

export default {
  name: 'UnitConverter',
  setup() {
    // 类别数据
    const categories = [
      { id: 'length', name: '长度', icon: '📏' },
      { id: 'weight', name: '重量', icon: '⚖️' },
      { id: 'temperature', name: '温度', icon: '🌡️' },
      { id: 'time', name: '时间', icon: '⏰' },
      { id: 'speed', name: '速度', icon: '🚀' },
      { id: 'area', name: '面积', icon: '📐' },
      { id: 'volume', name: '体积', icon: '🧪' },
      { id: 'data', name: '数据存储', icon: '💾' }
    ]

    // 响应式数据
    const activeCategory = ref('length')
    const inputValue = ref('')
    const outputValue = ref('')
    const fromUnit = ref('')
    const toUnit = ref('')
    const history = ref([])
    const showNotification = ref(false)
    const notificationMessage = ref('')

    // 设置默认单位
    const setDefaultUnits = () => {
      const units = unitData[activeCategory.value]
      if (units && units.length >= 2) {
        fromUnit.value = units[0].id
        toUnit.value = units[1].id
      }
    }

    // 设置活动类别
    const setActiveCategory = (categoryId) => {
      activeCategory.value = categoryId
      setDefaultUnits()
      inputValue.value = ''
      outputValue.value = ''
    }

    // 获取当前类别的单位列表
    const getUnitsForCategory = (category) => {
      return unitData[category] || []
    }

    // 获取单位符号
    const getUnitSymbol = (unitId) => {
      const units = getUnitsForCategory(activeCategory.value)
      const unit = units.find(u => u.id === unitId)
      return unit ? unit.symbol : ''
    }

    // 温度转换函数
    const convertTemperature = (value, from, to) => {
      // 先转换为摄氏度
      let celsius
      switch (from) {
        case 'c':
          celsius = value
          break
        case 'f':
          celsius = (value - 32) * 5 / 9
          break
        case 'k':
          celsius = value - 273.15
          break
        case 'r':
          celsius = (value - 491.67) * 5 / 9
          break
        default:
          return 0
      }

      // 从摄氏度转换为目标单位
      switch (to) {
        case 'c':
          return celsius
        case 'f':
          return celsius * 9 / 5 + 32
        case 'k':
          return celsius + 273.15
        case 'r':
          return (celsius + 273.15) * 9 / 5
        default:
          return 0
      }
    }

    // 单位转换
    const convertUnits = () => {
      if (!inputValue.value || isNaN(inputValue.value)) {
        outputValue.value = ''
        return
      }

      const numValue = parseFloat(inputValue.value)
      
      // 获取单位数据
      const units = getUnitsForCategory(activeCategory.value)
      const fromUnitData = units.find(u => u.id === fromUnit.value)
      const toUnitData = units.find(u => u.id === toUnit.value)

      if (!fromUnitData || !toUnitData) {
        outputValue.value = ''
        return
      }

      // 处理温度转换
      if (fromUnitData.isTemperature && toUnitData.isTemperature) {
        const result = convertTemperature(numValue, fromUnit.value, toUnit.value)
        outputValue.value = result.toFixed(6).replace(/\.?0+$/, '')
        return
      }

      // 处理普通单位转换
      if (fromUnitData.factor && toUnitData.factor) {
        const result = numValue * fromUnitData.factor / toUnitData.factor
        outputValue.value = result.toFixed(6).replace(/\.?0+$/, '')
      } else {
        outputValue.value = ''
      }
    }

    // 交换单位
    const swapUnits = () => {
      const temp = fromUnit.value
      fromUnit.value = toUnit.value
      toUnit.value = temp
      convertUnits()
    }

    // 添加到历史记录
    const addToHistory = () => {
      if (!inputValue.value || !outputValue.value) return

      history.value.unshift({
        input: inputValue.value,
        output: outputValue.value,
        fromUnit: fromUnit.value,
        toUnit: toUnit.value,
        category: activeCategory.value,
        timestamp: new Date()
      })

      // 限制历史记录数量
      if (history.value.length > 10) {
        history.value = history.value.slice(0, 10)
      }

      // 保存到本地存储
      localStorage.setItem('unitConverterHistory', JSON.stringify(history.value))

      showNotification('已保存到历史记录')
    }

    // 从历史记录加载
    const loadFromHistory = (item) => {
      activeCategory.value = item.category
      inputValue.value = item.input
      fromUnit.value = item.fromUnit
      toUnit.value = item.toUnit
      convertUnits()
    }

    // 删除历史记录项
    const deleteHistoryItem = (index) => {
      history.value.splice(index, 1)
      localStorage.setItem('unitConverterHistory', JSON.stringify(history.value))
    }

    // 清空所有
    const clearAll = () => {
      inputValue.value = ''
      outputValue.value = ''
    }

    // 复制结果
    const copyResult = () => {
      if (!outputValue.value) return

      navigator.clipboard.writeText(outputValue.value)
        .then(() => {
          showNotification('已复制到剪贴板')
        })
        .catch(() => {
          showNotification('复制失败，请手动复制')
        })
    }

    // 获取常用转换
    const getCommonConversions = (category) => {
      return commonConversions[category] || []
    }

    // 设置常用转换
    const setCommonConversion = (conversion) => {
      fromUnit.value = conversion.from
      toUnit.value = conversion.to
      convertUnits()
    }

    // 显示通知
    const showNotify = (message) => {
      notificationMessage.value = message
      showNotification.value = true
      setTimeout(() => {
        showNotification.value = false
      }, 2000)
    }

    // 初始化
    onMounted(() => {
      setDefaultUnits()
      
      // 从本地存储加载历史记录
      const savedHistory = localStorage.getItem('unitConverterHistory')
      if (savedHistory) {
        try {
          history.value = JSON.parse(savedHistory)
        } catch (e) {
          console.error('Failed to parse history:', e)
        }
      }
    })

    return {
      categories,
      activeCategory,
      inputValue,
      outputValue,
      fromUnit,
      toUnit,
      history,
      showNotification,
      notificationMessage,
      setActiveCategory,
      getUnitsForCategory,
      getUnitSymbol,
      convertUnits,
      swapUnits,
      addToHistory,
      loadFromHistory,
      deleteHistoryItem,
      clearAll,
      copyResult,
      getCommonConversions,
      setCommonConversion,
      showNotify
    }
  }
}
</script>

<style scoped>
.unit-converter {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #2c3e50;
}

.tool-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

.tool-header h2 {
  margin-bottom: 8px;
  font-size: 2em;
}

.tool-header p {
  font-size: 1.1em;
  margin: 0;
  opacity: 0.9;
}

.converter-container {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
  justify-content: center;
}

.category-btn {
  padding: 10px 15px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-btn:hover {
  background: #e9ecef;
}

.category-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.conversion-area {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: end;
  margin-bottom: 25px;
}

.input-section, .output-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-section h3, .output-section h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1em;
}

.value-input {
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1.1em;
  transition: border-color 0.3s;
}

.value-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.value-input.output {
  background: #f8f9fa;
  cursor: not-allowed;
}

.unit-select {
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.unit-select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.conversion-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding-bottom: 20px;
}

.action-btn {
  padding: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2em;
  transition: background 0.3s;
}

.action-btn:hover {
  background: #2980b9;
}

.equals-sign {
  font-size: 1.5em;
  font-weight: bold;
  color: #7f8c8d;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
}

.primary-btn, .secondary-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary-btn {
  background: #3498db;
  color: white;
}

.primary-btn:hover:not(:disabled) {
  background: #2980b9;
}

.primary-btn:disabled {
  background: #b2bec3;
  cursor: not-allowed;
}

.secondary-btn {
  background: #f8f9fa;
  color: #2c3e50;
  border: 2px solid #e9ecef;
}

.secondary-btn:hover {
  background: #e9ecef;
}

.history-section, .common-conversions {
  margin-bottom: 25px;
}

.history-section h3, .common-conversions h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.2em;
  padding-bottom: 10px;
  border-bottom: 2px solid #f1f2f6;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  position: relative;
}

.history-item:hover {
  background: #e9ecef;
}

.history-value {
  font-weight: 600;
}

.history-arrow {
  color: #7f8c8d;
}

.history-delete {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
  color: #e74c3c;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.common-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.common-btn {
  padding: 8px 15px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.common-btn:hover {
  background: #e9ecef;
  border-color: #3498db;
}

.notification {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  padding: 15px 25px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  border-radius: 10px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1000;
  font-weight: 500;
}

.notification.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .conversion-area {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .conversion-actions {
    flex-direction: row;
    justify-content: center;
    padding-bottom: 0;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .category-tabs {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .unit-converter {
    padding: 15px;
  }
  
  .tool-header h2 {
    font-size: 1.5em;
  }
  
  .category-btn {
    padding: 8px 12px;
    font-size: 0.9em;
  }
  
  .value-input, .unit-select {
    font-size: 1em;
  }
}
</style>