<template>
  <div class="timestamp-converter">
    <div class="tool-header">
      <h2>⏰ 时间戳转换工具</h2>
      <p>转换时间戳与日期时间，支持多种格式和时区</p>
    </div>

    <div class="current-time">
      <div class="current-time-card">
        <h3>当前时间</h3>
        <div class="time-display">
          <div class="time-value">{{ currentTime.formatted }}</div>
          <div class="timestamp-value">
            <span>秒级时间戳: {{ currentTime.timestamp }}</span>
            <span>毫秒级时间戳: {{ currentTime.timestampMs }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="conversion-sections">
      <!-- 时间戳转日期 -->
      <div class="conversion-section">
        <div class="section-header">
          <h3>时间戳 → 日期时间</h3>
        </div>
        
        <div class="conversion-input">
          <div class="input-group">
            <label for="timestamp-input">时间戳值:</label>
            <input
              id="timestamp-input"
              type="text"
              v-model="timestampInput"
              placeholder="输入秒级或毫秒级时间戳"
              @input="convertTimestampToDate"
            >
            <div class="input-hint">
              支持秒级(10位)或毫秒级(13位)时间戳
            </div>
          </div>

          <div class="input-group">
            <label for="timezone-select">时区:</label>
            <select id="timezone-select" v-model="timestampTimezone">
              <option value="local">本地时间</option>
              <option value="utc">UTC时间</option>
            </select>
          </div>

          <div class="input-group">
            <label for="format-select">输出格式:</label>
            <select id="format-select" v-model="timestampFormat">
              <option value="full">完整格式</option>
              <option value="date">仅日期</option>
              <option value="time">仅时间</option>
              <option value="custom">自定义格式</option>
            </select>
          </div>

          <div class="input-group" v-if="timestampFormat === 'custom'">
            <label for="custom-format">自定义格式:</label>
            <input
              id="custom-format"
              type="text"
              v-model="customTimestampFormat"
              placeholder="例如: YYYY-MM-DD HH:mm:ss"
            >
            <div class="input-hint">
              可用格式: YYYY(年), MM(月), DD(日), HH(时), mm(分), ss(秒)
            </div>
          </div>
        </div>

        <div class="conversion-result" v-if="timestampResult">
          <h4>转换结果:</h4>
          <div class="result-display">
            {{ timestampResult }}
          </div>
          <button class="copy-btn" @click="copyResult(timestampResult)">
            📋 复制结果
          </button>
        </div>
      </div>

      <!-- 日期转时间戳 -->
      <div class="conversion-section">
        <div class="section-header">
          <h3>日期时间 → 时间戳</h3>
        </div>
        
        <div class="conversion-input">
          <div class="input-group">
            <label for="date-input">日期时间:</label>
            <input
              id="date-input"
              type="datetime-local"
              v-model="dateInput"
              @input="convertDateToTimestamp"
            >
          </div>

          <div class="input-group">
            <label for="date-timezone-select">时区:</label>
            <select id="date-timezone-select" v-model="dateTimezone">
              <option value="local">本地时间</option>
              <option value="utc">UTC时间</option>
            </select>
          </div>

          <div class="input-group">
            <label for="timestamp-type">时间戳类型:</label>
            <select id="timestamp-type" v-model="timestampType">
              <option value="seconds">秒级时间戳 (10位)</option>
              <option value="milliseconds">毫秒级时间戳 (13位)</option>
            </select>
          </div>
        </div>

        <div class="conversion-result" v-if="dateResult">
          <h4>转换结果:</h4>
          <div class="result-display">
            {{ dateResult }}
          </div>
          <button class="copy-btn" @click="copyResult(dateResult)">
            📋 复制结果
          </button>
        </div>
      </div>
    </div>

    <!-- 常用时间戳 -->
    <div class="common-timestamps">
      <div class="section-header">
        <h3>常用时间戳</h3>
      </div>
      
      <div class="timestamp-list">
        <div 
          v-for="item in commonTimestamps" 
          :key="item.label"
          class="timestamp-item"
          @click="selectCommonTimestamp(item)"
        >
          <div class="timestamp-label">{{ item.label }}</div>
          <div class="timestamp-value">{{ item.value }}</div>
          <div class="timestamp-datetime">{{ item.datetime }}</div>
        </div>
      </div>
    </div>

    <!-- 通知 -->
    <div class="notification" :class="{ show: showNotify }">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

export default {
  name: 'TimestampConverter',
  setup() {
    // 当前时间
    const currentTime = reactive({
      formatted: '',
      timestamp: 0,
      timestampMs: 0
    })

    // 时间戳转日期相关数据
    const timestampInput = ref('')
    const timestampTimezone = ref('local')
    const timestampFormat = ref('full')
    const customTimestampFormat = ref('YYYY-MM-DD HH:mm:ss')
    const timestampResult = ref('')

    // 日期转时间戳相关数据
    const dateInput = ref('')
    const dateTimezone = ref('local')
    const timestampType = ref('seconds')
    const dateResult = ref('')

    // 常用时间戳
    const commonTimestamps = ref([])

    // 通知
    const showNotify = ref(false)
    const notificationMessage = ref('')

    // 更新当前时间
    let timeInterval = null
    function updateCurrentTime() {
      const now = new Date()
      currentTime.formatted = formatDate(now, 'full', 'local')
      currentTime.timestamp = Math.floor(now.getTime() / 1000)
      currentTime.timestampMs = now.getTime()
    }

    // 格式化日期
    function formatDate(date, format, timezone) {
      let d = date
      
      // 处理时区
      if (timezone === 'utc') {
        d = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
      }
      
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hours = String(d.getHours()).padStart(2, '0')
      const minutes = String(d.getMinutes()).padStart(2, '0')
      const seconds = String(d.getSeconds()).padStart(2, '0')
      
      // 根据格式返回
      switch (format) {
        case 'full':
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        case 'date':
          return `${year}-${month}-${day}`
        case 'time':
          return `${hours}:${minutes}:${seconds}`
        case 'custom':
          return customTimestampFormat.value
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds)
        default:
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
      }
    }

    // 时间戳转日期
    function convertTimestampToDate() {
      if (!timestampInput.value) {
        timestampResult.value = ''
        return
      }
      
      try {
        let timestamp = parseInt(timestampInput.value)
        
        // 判断是秒级还是毫秒级
        if (timestampInput.value.length === 10) {
          timestamp *= 1000 // 秒级转毫秒级
        } else if (timestampInput.value.length !== 13) {
          throw new Error('时间戳长度应为10位(秒)或13位(毫秒)')
        }
        
        const date = new Date(timestamp)
        
        if (isNaN(date.getTime())) {
          throw new Error('无效的时间戳')
        }
        
        timestampResult.value = formatDate(date, timestampFormat.value, timestampTimezone.value)
      } catch (error) {
        timestampResult.value = '错误: ' + error.message
      }
    }

    // 日期转时间戳
    function convertDateToTimestamp() {
      if (!dateInput.value) {
        dateResult.value = ''
        return
      }
      
      try {
        const date = new Date(dateInput.value)
        
        if (isNaN(date.getTime())) {
          throw new Error('无效的日期时间')
        }
        
        // 处理时区
        let timestamp = date.getTime()
        if (dateTimezone.value === 'utc') {
          timestamp -= date.getTimezoneOffset() * 60000
        }
        
        // 根据类型返回
        if (timestampType.value === 'seconds') {
          dateResult.value = Math.floor(timestamp / 1000)
        } else {
          dateResult.value = timestamp
        }
      } catch (error) {
        dateResult.value = '错误: ' + error.message
      }
    }

    // 初始化常用时间戳
    function initCommonTimestamps() {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      const yesterdayStart = new Date(todayStart)
      yesterdayStart.setDate(yesterdayStart.getDate() - 1)
      const yesterdayEnd = new Date(todayEnd)
      yesterdayEnd.setDate(yesterdayEnd.getDate() - 1)
      
      commonTimestamps.value = [
        {
          label: '当前时间',
          value: Math.floor(now.getTime() / 1000),
          datetime: formatDate(now, 'full', 'local'),
          type: 'seconds'
        },
        {
          label: '今天开始',
          value: Math.floor(todayStart.getTime() / 1000),
          datetime: formatDate(todayStart, 'full', 'local'),
          type: 'seconds'
        },
        {
          label: '今天结束',
          value: Math.floor(todayEnd.getTime() / 1000),
          datetime: formatDate(todayEnd, 'full', 'local'),
          type: 'seconds'
        },
        {
          label: '昨天开始',
          value: Math.floor(yesterdayStart.getTime() / 1000),
          datetime: formatDate(yesterdayStart, 'full', 'local'),
          type: 'seconds'
        },
        {
          label: 'UNIX纪元',
          value: 0,
          datetime: '1970-01-01 00:00:00',
          type: 'seconds'
        },
        {
          label: '2038问题',
          value: 2147483647,
          datetime: '2038-01-19 03:14:07',
          type: 'seconds'
        }
      ]
    }

    // 选择常用时间戳
    function selectCommonTimestamp(item) {
      timestampInput.value = item.value
      convertTimestampToDate()
    }

    // 复制结果
    function copyResult(text) {
      navigator.clipboard.writeText(text.toString())
        .then(() => {
          showNotification('已复制到剪贴板')
        })
        .catch(() => {
          showNotification('复制失败，请手动复制')
        })
    }

    // 显示通知
    function showNotification(message) {
      notificationMessage.value = message
      showNotify.value = true
      setTimeout(() => {
        showNotify.value = false
      }, 2000)
    }

    // 生命周期钩子
    onMounted(() => {
      updateCurrentTime()
      timeInterval = setInterval(updateCurrentTime, 1000)
      initCommonTimestamps()
      
      // 设置默认日期时间为当前时间
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      
      dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`
    })

    onUnmounted(() => {
      if (timeInterval) {
        clearInterval(timeInterval)
      }
    })

    return {
      currentTime,
      timestampInput,
      timestampTimezone,
      timestampFormat,
      customTimestampFormat,
      timestampResult,
      dateInput,
      dateTimezone,
      timestampType,
      dateResult,
      commonTimestamps,
      showNotification,
      notificationMessage,
      convertTimestampToDate,
      convertDateToTimestamp,
      selectCommonTimestamp,
      copyResult
    }
  }
}
</script>

<style scoped>
.timestamp-converter {
  max-width: 1000px;
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

.current-time {
  margin-bottom: 30px;
}

.current-time-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.current-time-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.4em;
}

.time-display {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.time-value {
  font-size: 2em;
  font-weight: 600;
  color: #3498db;
}

.timestamp-value {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-family: 'Fira Code', monospace;
  color: #7f8c8d;
}

.conversion-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.conversion-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f1f2f6;
}

.section-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3em;
}

.conversion-input {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 25px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95em;
}

.input-group input,
.input-group select {
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1em;
  transition: border-color 0.3s;
}

.input-group input:focus,
.input-group select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.input-hint {
  font-size: 0.85em;
  color: #7f8c8d;
  margin-top: 4px;
}

.conversion-result {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.conversion-result h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
}

.result-display {
  font-family: 'Fira Code', monospace;
  font-size: 1.1em;
  margin-bottom: 15px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  word-break: break-all;
}

.copy-btn {
  padding: 10px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.copy-btn:hover {
  background: #2980b9;
}

.common-timestamps {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.timestamp-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}

.timestamp-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.timestamp-item:hover {
  background: #e9ecef;
  transform: translateY(-2px);
  border-color: #3498db;
}

.timestamp-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.timestamp-value {
  font-family: 'Fira Code', monospace;
  color: #3498db;
  margin-bottom: 6px;
  font-size: 1.1em;
}

.timestamp-datetime {
  color: #7f8c8d;
  font-size: 0.9em;
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
  .conversion-sections {
    grid-template-columns: 1fr;
  }
  
  .timestamp-value {
    flex-direction: column;
    gap: 10px;
  }
  
  .timestamp-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .timestamp-converter {
    padding: 15px;
  }
  
  .tool-header h2 {
    font-size: 1.5em;
  }
  
  .time-value {
    font-size: 1.5em;
  }
  
  .conversion-section {
    padding: 20px;
  }
}
</style>