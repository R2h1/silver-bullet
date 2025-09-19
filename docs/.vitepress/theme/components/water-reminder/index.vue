<template>
  <div class="water-reminder">
    <div class="tool-header">
      <h2>喝水提醒器</h2>
      <p>帮助您保持充足的水分摄入，培养健康的饮水习惯</p>
    </div>

    <div class="reminder-container">
      <!-- 主要控制面板 -->
      <div class="control-panel">
        <div class="water-display">
          <div class="water-bottle" :class="{ active: isFilling }">
            <div class="bottle-outline">
              <div class="water-level" :style="{ height: waterLevel + '%' }"></div>
              <div class="bottle-cap"></div>
            </div>
            <div class="water-amount">{{ currentIntake }} / {{ dailyGoal }} ml</div>
          </div>
          
          <div class="intake-buttons">
            <button 
              v-for="amount in presetAmounts" 
              :key="amount"
              class="intake-btn"
              @click="addWater(amount)"
            >
              +{{ amount }}ml
            </button>
            <button class="intake-btn custom" @click="showCustomInput = true">
              自定义
            </button>
          </div>
        </div>

        <div class="stats-panel">
          <div class="stat-item">
            <div class="stat-label">今日进度</div>
            <div class="stat-value">{{ Math.round((currentIntake / dailyGoal) * 100) }}%</div>
          </div>
          
          <div class="stat-item">
            <div class="stat-label">剩余目标</div>
            <div class="stat-value">{{ dailyGoal - currentIntake }}ml</div>
          </div>
          
          <div class="stat-item">
            <div class="stat-label">提醒次数</div>
            <div class="stat-value">{{ reminderCount }}</div>
          </div>
        </div>
      </div>

      <!-- 设置面板 -->
      <div class="settings-panel">
        <h3>提醒设置</h3>
        
        <div class="setting-group">
          <label>每日饮水目标 (ml)</label>
          <input 
            type="number" 
            v-model.number="dailyGoal" 
            min="1000" 
            max="5000" 
            step="100"
          >
        </div>
        
        <div class="setting-group">
          <label>提醒间隔 (分钟)</label>
          <select v-model="reminderInterval">
            <option v-for="interval in intervalOptions" :key="interval" :value="interval">
              {{ interval }}分钟
            </option>
          </select>
        </div>
        
        <div class="setting-group">
          <label>
            <input type="checkbox" v-model="enableReminders"> 启用提醒
          </label>
        </div>
        
        <div class="setting-group">
          <label>
            <input type="checkbox" v-model="enableSound"> 启用声音提醒
          </label>
        </div>
        
        <div class="setting-group" v-if="enableReminders">
          <label>提醒时间段</label>
          <div class="time-range">
            <input type="time" v-model="startTime"> 至
            <input type="time" v-model="endTime">
          </div>
        </div>
        
        <div class="action-buttons">
          <button @click="saveSettings" class="save-btn">保存设置</button>
          <button @click="resetToday" class="reset-btn">重置今日记录</button>
        </div>
      </div>

      <!-- 历史记录 -->
      <div class="history-panel">
        <h3>饮水记录</h3>
        
        <div class="history-list" v-if="todayRecords.length > 0">
          <div 
            v-for="(record, index) in todayRecords" 
            :key="index"
            class="history-item"
          >
            <div class="record-time">{{ formatTime(record.time) }}</div>
            <div class="record-amount">+{{ record.amount }}ml</div>
          </div>
        </div>
        
        <div v-else class="empty-history">
          <p>今日尚未记录饮水</p>
        </div>
        
        <div class="weekly-stats" v-if="weeklyData.length > 0">
          <h4>本周饮水情况</h4>
          <div class="week-chart">
            <div 
              v-for="day in weeklyData" 
              :key="day.date"
              class="day-bar"
              :style="{ height: (day.intake / dailyGoal) * 100 + '%' }"
              :class="{ today: day.isToday }"
            >
              <span class="bar-label">{{ day.intake }}ml</span>
              <span class="day-label">{{ day.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义输入模态框 -->
    <div v-if="showCustomInput" class="modal-overlay">
      <div class="modal-content">
        <h3>自定义饮水量</h3>
        <input 
          type="number" 
          v-model.number="customAmount" 
          placeholder="输入毫升数"
          min="1"
          max="1000"
          ref="customInput"
        >
        <div class="modal-actions">
          <button @click="addCustomWater" class="confirm-btn">确认</button>
          <button @click="showCustomInput = false" class="cancel-btn">取消</button>
        </div>
      </div>
    </div>

    <!-- 提醒通知 -->
    <div v-if="showReminder" class="reminder-notification">
      <div class="notification-content">
        <h3>💧 该喝水啦！</h3>
        <p>您已经 {{ reminderInterval }} 分钟没有喝水了</p>
        <p>当前进度: {{ Math.round((currentIntake / dailyGoal) * 100) }}%</p>
        <button @click="dismissReminder" class="dismiss-btn">知道了</button>
      </div>
    </div>
    <!-- 音频元素 -->
  </div>
</template>

<script>
export default {
  name: 'WaterReminder',
  data() {
    return {
      currentIntake: 0,
      dailyGoal: 2000,
      reminderInterval: 60,
      enableReminders: true,
      enableSound: true,
      startTime: '08:00',
      endTime: '22:00',
      reminderCount: 0,
      todayRecords: [],
      weeklyData: [],
      isFilling: false,
      showCustomInput: false,
      customAmount: 0,
      showReminder: false,
      reminderTimer: null,
      lastDrinkTime: null,
      
      presetAmounts: [100, 200, 300, 500],
      intervalOptions: [30, 45, 60, 90, 120],
      
      // 模拟本周数据
      mockWeekData: [
        { date: '2023-10-15', intake: 1800, label: '周日', isToday: false },
        { date: '2023-10-16', intake: 2200, label: '周一', isToday: false },
        { date: '2023-10-17', intake: 1900, label: '周二', isToday: false },
        { date: '2023-10-18', intake: 2100, label: '周三', isToday: false },
        { date: '2023-10-19', intake: 2300, label: '周四', isToday: false },
        { date: '2023-10-20', intake: 1700, label: '周五', isToday: false },
        { date: '2023-10-21', intake: 0, label: '周六', isToday: true }
      ]
    };
  },
  computed: {
    waterLevel() {
      return Math.min(100, (this.currentIntake / this.dailyGoal) * 100);
    }
  },
  mounted() {
    // 加载保存的数据
    this.loadData();
    
    // 初始化本周数据
    this.weeklyData = this.mockWeekData;
    
    // 设置今日数据
    const todayIndex = this.weeklyData.findIndex(day => day.isToday);
    if (todayIndex !== -1) {
      this.currentIntake = this.weeklyData[todayIndex].intake;
    }
    
    // 启动提醒计时器
    this.setupReminder();
    
    // 设置最后喝水时间为当前时间
    this.lastDrinkTime = new Date();
  },
  methods: {
    addWater(amount) {
      this.currentIntake += amount;
      this.recordIntake(amount);
      this.lastDrinkTime = new Date();
      
      // 更新今日数据
      const todayIndex = this.weeklyData.findIndex(day => day.isToday);
      if (todayIndex !== -1) {
        this.weeklyData[todayIndex].intake = this.currentIntake;
      }
      
      // 动画效果
      this.isFilling = true;
      setTimeout(() => {
        this.isFilling = false;
      }, 1000);
      
      // 保存数据
      this.saveData();
    },
    
    addCustomWater() {
      if (this.customAmount > 0) {
        this.addWater(this.customAmount);
        this.showCustomInput = false;
        this.customAmount = 0;
      }
    },
    
    recordIntake(amount) {
      this.todayRecords.unshift({
        time: new Date(),
        amount: amount
      });
    },
    
    formatTime(date) {
      return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    
    setupReminder() {
      if (this.reminderTimer) {
        clearInterval(this.reminderTimer);
      }
      
      if (this.enableReminders) {
        this.reminderTimer = setInterval(() => {
          this.checkReminder();
        }, 60000); // 每分钟检查一次
      }
    },
    
    checkReminder() {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const start = parseInt(this.startTime.split(':')[0]) * 60 + parseInt(this.startTime.split(':')[1]);
      const end = parseInt(this.endTime.split(':')[0]) * 60 + parseInt(this.endTime.split(':')[1]);
      
      // 检查是否在提醒时间段内
      if (currentTime >= start && currentTime <= end) {
        // 检查是否到了提醒时间
        const timeSinceLastDrink = (now - this.lastDrinkTime) / 60000; // 分钟
        
        if (timeSinceLastDrink >= this.reminderInterval) {
          this.showReminderNotification();
        }
      }
    },
    
    showReminderNotification() {
      this.showReminder = true;
      this.reminderCount++;
      
      if (this.enableSound && this.$refs.reminderSound) {
        this.$refs.reminderSound.play().catch(e => console.log('音频播放失败:', e));
      }
      
      // 5秒后自动关闭
      setTimeout(() => {
        if (this.showReminder) {
          this.dismissReminder();
        }
      }, 10000);
    },
    
    dismissReminder() {
      this.showReminder = false;
      this.lastDrinkTime = new Date();
    },
    
    saveSettings() {
      this.setupReminder();
      this.saveData();
      alert('设置已保存！');
    },
    
    resetToday() {
      if (confirm('确定要重置今日的饮水记录吗？')) {
        this.currentIntake = 0;
        this.todayRecords = [];
        
        // 更新今日数据
        const todayIndex = this.weeklyData.findIndex(day => day.isToday);
        if (todayIndex !== -1) {
          this.weeklyData[todayIndex].intake = 0;
        }
        
        this.lastDrinkTime = new Date();
        this.saveData();
      }
    },
    
    saveData() {
      const data = {
        currentIntake: this.currentIntake,
        dailyGoal: this.dailyGoal,
        reminderInterval: this.reminderInterval,
        enableReminders: this.enableReminders,
        enableSound: this.enableSound,
        startTime: this.startTime,
        endTime: this.endTime,
        reminderCount: this.reminderCount,
        todayRecords: this.todayRecords,
        lastDrinkTime: this.lastDrinkTime
      };
      
      localStorage.setItem('waterReminderData', JSON.stringify(data));
    },
    
    loadData() {
      const savedData = localStorage.getItem('waterReminderData');
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          this.currentIntake = data.currentIntake || 0;
          this.dailyGoal = data.dailyGoal || 2000;
          this.reminderInterval = data.reminderInterval || 60;
          this.enableReminders = data.enableReminders !== undefined ? data.enableReminders : true;
          this.enableSound = data.enableSound !== undefined ? data.enableSound : true;
          this.startTime = data.startTime || '08:00';
          this.endTime = data.endTime || '22:00';
          this.reminderCount = data.reminderCount || 0;
          this.todayRecords = data.todayRecords || [];
          this.lastDrinkTime = data.lastDrinkTime ? new Date(data.lastDrinkTime) : new Date();
        } catch (e) {
          console.error('加载数据失败:', e);
        }
      }
    }
  },
  beforeUnmount() {
    if (this.reminderTimer) {
      clearInterval(this.reminderTimer);
    }
  }
};
</script>

<style scoped>
.water-reminder {
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

.reminder-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.control-panel {
  grid-column: 1 / -1;
  display: flex;
  gap: 20px;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.water-display {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.water-bottle {
  position: relative;
  width: 120px;
  height: 200px;
  margin-bottom: 20px;
}

.bottle-outline {
  position: relative;
  width: 100%;
  height: 100%;
  border: 3px solid #3498db;
  border-radius: 20px 20px 60px 60px;
  overflow: hidden;
}

.water-level {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to top, #64b3f4, #3498db);
  transition: height 1s ease;
}

.bottle-cap {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 15px;
  background-color: #3498db;
  border-radius: 10px 10px 0 0;
}

.water-amount {
  text-align: center;
  font-weight: bold;
  font-size: 1.2em;
  color: #2c3e50;
  margin-top: 10px;
}

.intake-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
}

.intake-btn {
  padding: 8px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.intake-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.intake-btn.custom {
  background-color: #95a5a6;
}

.intake-btn.custom:hover {
  background-color: #7f8c8d;
}

.stats-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.stat-label {
  font-size: 0.9em;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.5em;
  font-weight: bold;
  color: #2c3e50;
}

.settings-panel {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.settings-panel h3 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 20px;
}

.setting-group {
  margin-bottom: 15px;
}

.setting-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c3e50;
}

.setting-group input[type="number"],
.setting-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.setting-group input[type="checkbox"] {
  margin-right: 8px;
}

.time-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-range input {
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.save-btn, .reset-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.save-btn {
  background-color: #27ae60;
  color: white;
}

.save-btn:hover {
  background-color: #219653;
}

.reset-btn {
  background-color: #e74c3c;
  color: white;
}

.reset-btn:hover {
  background-color: #c0392b;
}

.history-panel {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.history-panel h3 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 15px;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.history-item:last-child {
  border-bottom: none;
}

.record-time {
  color: #7f8c8d;
}

.record-amount {
  font-weight: bold;
  color: #3498db;
}

.empty-history {
  text-align: center;
  padding: 20px;
  color: #95a5a6;
}

.weekly-stats {
  margin-top: 20px;
}

.weekly-stats h4 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.week-chart {
  display: flex;
  height: 150px;
  align-items: flex-end;
  gap: 10px;
}

.day-bar {
  flex: 1;
  background-color: #3498db;
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.5s ease;
  min-height: 20px;
}

.day-bar.today {
  background-color: #e74c3c;
}

.bar-label {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8em;
  white-space: nowrap;
}

.day-label {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.8em;
  color: #7f8c8d;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 25px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
}

.modal-content h3 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 15px;
}

.modal-content input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 1.1em;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.confirm-btn, .cancel-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.confirm-btn {
  background-color: #27ae60;
  color: white;
}

.cancel-btn {
  background-color: #95a5a6;
  color: white;
}

.reminder-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  animation: slideIn 0.5s ease;
  max-width: 300px;
}

.notification-content h3 {
  margin-top: 0;
  color: #2c3e50;
}

.notification-content p {
  margin: 5px 0;
  color: #7f8c8d;
}

.dismiss-btn {
  margin-top: 10px;
  padding: 8px 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .reminder-container {
    grid-template-columns: 1fr;
  }
  
  .control-panel {
    flex-direction: column;
  }
  
  .week-chart {
    flex-direction: column;
    height: auto;
    align-items: stretch;
  }
  
  .day-bar {
    height: 30px !important;
    min-height: 30px;
  }
  
  .bar-label {
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
  }
  
  .day-label {
    position: static;
    text-align: center;
    padding: 5px 0;
  }
}
</style>