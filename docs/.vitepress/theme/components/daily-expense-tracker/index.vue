<template>
  <div class="daily-expense-tracker">
    <div class="tool-header">
      <h2>日常记账本</h2>
      <p>轻松记录和管理日常收支，分析消费习惯，实现财务健康</p>
    </div>

    <div class="tracker-container">
      <!-- 概览面板 -->
      <div class="overview-panel">
        <div class="overview-card">
          <div class="overview-item income">
            <div class="overview-icon">💰</div>
            <div class="overview-content">
              <div class="overview-label">总收入</div>
              <div class="overview-amount">¥{{ totalIncome.toFixed(2) }}</div>
            </div>
          </div>
          
          <div class="overview-item expense">
            <div class="overview-icon">💸</div>
            <div class="overview-content">
              <div class="overview-label">总支出</div>
              <div class="overview-amount">¥{{ totalExpense.toFixed(2) }}</div>
            </div>
          </div>
          
          <div class="overview-item balance" :class="{ positive: balance >= 0, negative: balance < 0 }">
            <div class="overview-icon">⚖️</div>
            <div class="overview-content">
              <div class="overview-label">结余</div>
              <div class="overview-amount">¥{{ balance.toFixed(2) }}</div>
            </div>
          </div>
        </div>
        
        <div class="month-selector">
          <button @click="changeMonth(-1)" class="month-nav">←</button>
          <span class="current-month">{{ currentMonth }}</span>
          <button @click="changeMonth(1)" class="month-nav">→</button>
        </div>
      </div>

      <!-- 添加记录表单 -->
      <div class="add-record-panel">
        <h3>添加记录</h3>
        <form @submit.prevent="addRecord" class="record-form">
          <div class="form-row">
            <div class="form-group">
              <label>类型</label>
              <div class="type-selector">
                <button 
                  type="button"
                  :class="{ active: newRecord.type === 'income' }"
                  @click="newRecord.type = 'income'"
                >
                  <span class="type-icon">💰</span> 收入
                </button>
                <button 
                  type="button"
                  :class="{ active: newRecord.type === 'expense' }"
                  @click="newRecord.type = 'expense'"
                >
                  <span class="type-icon">💸</span> 支出
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label>金额 (¥)</label>
              <input 
                type="number" 
                v-model.number="newRecord.amount" 
                placeholder="0.00" 
                min="0.01" 
                step="0.01" 
                required
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>分类</label>
              <select v-model="newRecord.category" required>
                <option value="">请选择分类</option>
                <option 
                  v-for="category in categories[newRecord.type]" 
                  :key="category.value" 
                  :value="category.value"
                >
                  {{ category.label }}
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label>日期</label>
              <input 
                type="date" 
                v-model="newRecord.date" 
                required
              >
            </div>
          </div>
          
          <div class="form-group full-width">
            <label>备注</label>
            <input 
              type="text" 
              v-model="newRecord.description" 
              placeholder="添加备注（可选）"
            >
          </div>
          
          <button type="submit" class="submit-btn">添加记录</button>
        </form>
      </div>

      <!-- 记录列表 -->
      <div class="records-panel">
        <div class="panel-header">
          <h3>交易记录</h3>
          <div class="filter-controls">
            <select v-model="filterType">
              <option value="all">所有类型</option>
              <option value="income">收入</option>
              <option value="expense">支出</option>
            </select>
            <select v-model="filterCategory">
              <option value="all">所有分类</option>
              <option 
                v-for="category in allCategories" 
                :key="category.value" 
                :value="category.value"
              >
                {{ category.label }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="records-list">
          <div 
            v-for="record in filteredRecords" 
            :key="record.id"
            class="record-item"
            :class="record.type"
          >
            <div class="record-icon">
              {{ record.type === 'income' ? '💰' : '💸' }}
            </div>
            
            <div class="record-details">
              <div class="record-category">{{ getCategoryLabel(record.category) }}</div>
              <div class="record-description">{{ record.description || '无备注' }}</div>
              <div class="record-date">{{ formatDate(record.date) }}</div>
            </div>
            
            <div class="record-amount" :class="record.type">
              {{ record.type === 'income' ? '+' : '-' }}¥{{ record.amount.toFixed(2) }}
            </div>
            
            <button class="delete-btn" @click="deleteRecord(record.id)">
              <span>❌</span>
            </button>
          </div>
        </div>
        
        <div v-if="filteredRecords.length === 0" class="empty-records">
          <p>暂无记录</p>
          <p>添加您的第一笔收支记录吧！</p>
        </div>
      </div>

      <!-- 统计图表 -->
      <div class="stats-panel">
        <h3>消费分析</h3>
        
        <div class="stats-tabs">
          <button 
            :class="{ active: activeTab === 'expense' }"
            @click="activeTab = 'expense'"
          >
            支出分析
          </button>
          <button 
            :class="{ active: activeTab === 'income' }"
            @click="activeTab = 'income'"
          >
            收入分析
          </button>
        </div>
        
        <div v-if="activeTab === 'expense'" class="expense-stats">
          <div class="chart-container">
            <div class="chart-placeholder" v-if="expenseByCategory.length === 0">
              <p>暂无支出数据</p>
            </div>
            <div class="category-chart" v-else>
              <div 
                v-for="item in expenseByCategory" 
                :key="item.category"
                class="chart-item"
              >
                <div class="chart-label">
                  <span class="category-color" :style="{ backgroundColor: getCategoryColor(item.category) }"></span>
                  {{ getCategoryLabel(item.category) }}
                </div>
                <div class="chart-bar-container">
                  <div 
                    class="chart-bar" 
                    :style="{ 
                      width: `${(item.amount / maxExpense) * 100}%`,
                      backgroundColor: getCategoryColor(item.category)
                    }"
                  ></div>
                </div>
                <div class="chart-value">
                  ¥{{ item.amount.toFixed(2) }} ({{ item.percentage }}%)
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'income'" class="income-stats">
          <div class="chart-container">
            <div class="chart-placeholder" v-if="incomeByCategory.length === 0">
              <p>暂无收入数据</p>
            </div>
            <div class="category-chart" v-else>
              <div 
                v-for="item in incomeByCategory" 
                :key="item.category"
                class="chart-item"
              >
                <div class="chart-label">
                  <span class="category-color" :style="{ backgroundColor: getCategoryColor(item.category) }"></span>
                  {{ getCategoryLabel(item.category) }}
                </div>
                <div class="chart-bar-container">
                  <div 
                    class="chart-bar" 
                    :style="{ 
                      width: `${(item.amount / maxIncome) * 100}%`,
                      backgroundColor: getCategoryColor(item.category)
                    }"
                  ></div>
                </div>
                <div class="chart-value">
                  ¥{{ item.amount.toFixed(2) }} ({{ item.percentage }}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="management-panel">
        <h3>数据管理</h3>
        <div class="management-actions">
          <button @click="exportData" class="management-btn">
            <span class="btn-icon">📤</span> 导出数据
          </button>
          <button @click="importData" class="management-btn">
            <span class="btn-icon">📥</span> 导入数据
          </button>
          <button @click="clearData" class="management-btn danger">
            <span class="btn-icon">🗑️</span> 清空数据
          </button>
        </div>
        
        <div class="data-info">
          <p>当前共有 {{ records.length }} 条记录</p>
          <p>数据存储在您的浏览器本地，不会上传到服务器</p>
        </div>
      </div>
    </div>

    <!-- 文件输入 -->
    <input 
      type="file" 
      ref="fileInput"
      accept=".json"
      @change="handleFileImport"
      style="display: none"
    >
  </div>
</template>

<script>
export default {
  name: 'DailyExpenseTracker',
  data() {
    return {
      records: [],
      newRecord: {
        type: 'expense',
        amount: null,
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      },
      currentDate: new Date(),
      filterType: 'all',
      filterCategory: 'all',
      activeTab: 'expense',
      
      categories: {
        income: [
          { value: 'salary', label: '工资薪水' },
          { value: 'bonus', label: '奖金红包' },
          { value: 'investment', label: '投资理财' },
          { value: 'freelance', label: '兼职外快' },
          { value: 'gift', label: '礼物收入' },
          { value: 'other_income', label: '其他收入' }
        ],
        expense: [
          { value: 'food', label: '餐饮美食' },
          { value: 'shopping', label: '购物消费' },
          { value: 'transport', label: '交通出行' },
          { value: 'housing', label: '住房房租' },
          { value: 'utilities', label: '水电物业' },
          { value: 'entertainment', label: '娱乐休闲' },
          { value: 'health', label: '医疗健康' },
          { value: 'education', label: '学习教育' },
          { value: 'communication', label: '通讯网络' },
          { value: 'other_expense', label: '其他支出' }
        ]
      },
      
      categoryColors: {
        // 收入颜色
        salary: '#4CAF50',
        bonus: '#8BC34A',
        investment: '#CDDC39',
        freelance: '#FFC107',
        gift: '#FF9800',
        other_income: '#FF5722',
        
        // 支出颜色
        food: '#F44336',
        shopping: '#E91E63',
        transport: '#9C27B0',
        housing: '#673AB7',
        utilities: '#3F51B5',
        entertainment: '#2196F3',
        health: '#03A9F4',
        education: '#00BCD4',
        communication: '#009688',
        other_expense: '#795548'
      }
    };
  },
  computed: {
    // 当前月份文本显示
    currentMonth() {
      return this.currentDate.toLocaleDateString('zh-CN', { 
        year: 'numeric', 
        month: 'long' 
      });
    },
    
    // 当前月份的所有记录
    currentMonthRecords() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      
      return this.records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getFullYear() === year && 
               recordDate.getMonth() === month;
      });
    },
    
    // 总收入
    totalIncome() {
      return this.currentMonthRecords
        .filter(record => record.type === 'income')
        .reduce((sum, record) => sum + record.amount, 0);
    },
    
    // 总支出
    totalExpense() {
      return this.currentMonthRecords
        .filter(record => record.type === 'expense')
        .reduce((sum, record) => sum + record.amount, 0);
    },
    
    // 结余
    balance() {
      return this.totalIncome - this.totalExpense;
    },
    
    // 所有分类（用于筛选）
    allCategories() {
      return [
        ...this.categories.income,
        ...this.categories.expense
      ];
    },
    
    // 筛选后的记录
    filteredRecords() {
      let filtered = this.currentMonthRecords;
      
      if (this.filterType !== 'all') {
        filtered = filtered.filter(record => record.type === this.filterType);
      }
      
      if (this.filterCategory !== 'all') {
        filtered = filtered.filter(record => record.category === this.filterCategory);
      }
      
      // 按日期倒序排列
      return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    },
    
    // 按类别分类的支出数据
    expenseByCategory() {
      const expenses = this.currentMonthRecords
        .filter(record => record.type === 'expense');
      
      if (expenses.length === 0) return [];
      
      const total = this.totalExpense;
      const byCategory = {};
      
      expenses.forEach(record => {
        if (!byCategory[record.category]) {
          byCategory[record.category] = 0;
        }
        byCategory[record.category] += record.amount;
      });
      
      return Object.entries(byCategory)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: ((amount / total) * 100).toFixed(1)
        }))
        .sort((a, b) => b.amount - a.amount);
    },
    
    // 按类别分类的收入数据
    incomeByCategory() {
      const incomes = this.currentMonthRecords
        .filter(record => record.type === 'income');
      
      if (incomes.length === 0) return [];
      
      const total = this.totalIncome;
      const byCategory = {};
      
      incomes.forEach(record => {
        if (!byCategory[record.category]) {
          byCategory[record.category] = 0;
        }
        byCategory[record.category] += record.amount;
      });
      
      return Object.entries(byCategory)
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: ((amount / total) * 100).toFixed(1)
        }))
        .sort((a, b) => b.amount - a.amount);
    },
    
    // 最大支出金额（用于图表比例）
    maxExpense() {
      if (this.expenseByCategory.length === 0) return 0;
      return Math.max(...this.expenseByCategory.map(item => item.amount));
    },
    
    // 最大收入金额（用于图表比例）
    maxIncome() {
      if (this.incomeByCategory.length === 0) return 0;
      return Math.max(...this.incomeByCategory.map(item => item.amount));
    }
  },
  methods: {
    // 添加新记录
    addRecord() {
      const record = {
        id: Date.now().toString(),
        ...this.newRecord
      };
      
      this.records.push(record);
      this.saveData();
      
      // 重置表单
      this.newRecord = {
        type: 'expense',
        amount: null,
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      };
    },
    
    // 删除记录
    deleteRecord(id) {
      if (confirm('确定要删除这条记录吗？')) {
        this.records = this.records.filter(record => record.id !== id);
        this.saveData();
      }
    },
    
    // 更改月份
    changeMonth(direction) {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(this.currentDate.getMonth() + direction);
      this.currentDate = newDate;
    },
    
    // 格式化日期
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN');
    },
    
    // 获取分类标签
    getCategoryLabel(categoryValue) {
      const allCategories = [...this.categories.income, ...this.categories.expense];
      const category = allCategories.find(c => c.value === categoryValue);
      return category ? category.label : '未知分类';
    },
    
    // 获取分类颜色
    getCategoryColor(categoryValue) {
      return this.categoryColors[categoryValue] || '#999';
    },
    
    // 导出数据
    exportData() {
      const dataStr = JSON.stringify(this.records, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `记账数据_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },
    
    // 导入数据
    importData() {
      this.$refs.fileInput.click();
    },
    
    // 处理文件导入
    handleFileImport(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (Array.isArray(data)) {
            if (confirm(`确定要导入 ${data.length} 条记录吗？这将覆盖现有数据。`)) {
              this.records = data;
              this.saveData();
              alert('数据导入成功！');
            }
          } else {
            alert('导入的文件格式不正确');
          }
        } catch (error) {
          alert('导入失败：文件格式错误');
          console.error('导入错误:', error);
        }
      };
      reader.readAsText(file);
      
      // 重置文件输入
      event.target.value = '';
    },
    
    // 清空数据
    clearData() {
      if (confirm('确定要清空所有数据吗？此操作不可撤销。')) {
        this.records = [];
        this.saveData();
      }
    },
    
    // 保存数据到本地存储
    saveData() {
      localStorage.setItem('expenseTrackerData', JSON.stringify(this.records));
    },
    
    // 从本地存储加载数据
    loadData() {
      const savedData = localStorage.getItem('expenseTrackerData');
      if (savedData) {
        try {
          this.records = JSON.parse(savedData);
        } catch (error) {
          console.error('加载数据失败:', error);
        }
      }
    }
  },
  mounted() {
    this.loadData();
  }
};
</script>

<style scoped>
.daily-expense-tracker {
  max-width: 1200px;
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

.tracker-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.overview-panel {
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.overview-card {
  display: flex;
  gap: 20px;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f8f9fa;
}

.overview-item.income {
  border-left: 4px solid #4CAF50;
}

.overview-item.expense {
  border-left: 4px solid #F44336;
}

.overview-item.balance.positive {
  border-left: 4px solid #4CAF50;
}

.overview-item.balance.negative {
  border-left: 4px solid #F44336;
}

.overview-icon {
  font-size: 2em;
}

.overview-label {
  font-size: 0.9em;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.overview-amount {
  font-size: 1.3em;
  font-weight: bold;
  color: #2c3e50;
}

.month-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.current-month {
  font-weight: bold;
  color: #2c3e50;
  min-width: 120px;
  text-align: center;
}

.month-nav {
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.month-nav:hover {
  background-color: #f1f2f6;
}

.add-record-panel,
.records-panel,
.stats-panel,
.management-panel {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.add-record-panel h3,
.records-panel h3,
.stats-panel h3,
.management-panel h3 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 20px;
}

.record-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  flex: 0 0 100%;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #2c3e50;
}

.form-group input,
.form-group select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1em;
}

.type-selector {
  display: flex;
  gap: 10px;
}

.type-selector button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f8f9fa;
  cursor: pointer;
  transition: all 0.2s;
}

.type-selector button.active {
  background-color: #e3f2fd;
  border-color: #2196f3;
  color: #2196f3;
}

.submit-btn {
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover {
  background-color: #45a049;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-controls {
  display: flex;
  gap: 10px;
}

.filter-controls select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.records-list {
  max-height: 400px;
  overflow-y: auto;
}

.record-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.2s;
}

.record-item:hover {
  background-color: #f8f9fa;
}

.record-item.income {
  border-left: 4px solid #4CAF50;
}

.record-item.expense {
  border-left: 4px solid #F44336;
}

.record-icon {
  font-size: 1.5em;
  margin-right: 15px;
}

.record-details {
  flex: 1;
}

.record-category {
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
}

.record-description {
  color: #7f8c8d;
  font-size: 0.9em;
  margin-bottom: 5px;
}

.record-date {
  color: #95a5a6;
  font-size: 0.8em;
}

.record-amount {
  font-weight: bold;
  margin-right: 15px;
}

.record-amount.income {
  color: #4CAF50;
}

.record-amount.expense {
  color: #F44336;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
  padding: 5px;
  border-radius: 4px;
}

.delete-btn:hover {
  opacity: 1;
  background-color: #ffebee;
}

.empty-records {
  text-align: center;
  padding: 40px 20px;
  color: #95a5a6;
}

.stats-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.stats-tabs button {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 3px solid transparent;
}

.stats-tabs button.active {
  border-bottom-color: #2196f3;
  color: #2196f3;
  font-weight: bold;
}

.chart-container {
  min-height: 200px;
}

.chart-placeholder {
  text-align: center;
  padding: 40px 20px;
  color: #95a5a6;
}

.category-chart {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chart-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.chart-label {
  flex: 0 0 120px;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9em;
}

.category-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.chart-bar-container {
  flex: 1;
  height: 20px;
  background-color: #f1f2f6;
  border-radius: 10px;
  overflow: hidden;
}

.chart-bar {
  height: 100%;
  transition: width 0.5s ease;
}

.chart-value {
  flex: 0 0 100px;
  text-align: right;
  font-size: 0.9em;
  color: #7f8c8d;
}

.management-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.management-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 15px;
  background-color: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.management-btn:hover {
  background-color: #e9ecef;
}

.management-btn.danger {
  background-color: #ffebee;
  border-color: #f44336;
  color: #f44336;
}

.management-btn.danger:hover {
  background-color: #ffcdd2;
}

.data-info {
  font-size: 0.9em;
  color: #7f8c8d;
}

.data-info p {
  margin: 5px 0;
}

@media (max-width: 768px) {
  .tracker-container {
    grid-template-columns: 1fr;
  }
  
  .overview-panel {
    flex-direction: column;
    gap: 15px;
  }
  
  .overview-card {
    flex-direction: column;
    width: 100%;
  }
  
  .form-row {
    flex-direction: column;
  }
  
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-controls {
    width: 100%;
    flex-direction: column;
  }
  
  .management-actions {
    flex-direction: column;
  }
  
  .chart-item {
    flex-wrap: wrap;
  }
  
  .chart-label {
    flex: 0 0 100%;
  }
  
  .chart-bar-container {
    flex: 0 0 100%;
  }
  
  .chart-value {
    flex: 0 0 100%;
    text-align: left;
  }
}
</style>