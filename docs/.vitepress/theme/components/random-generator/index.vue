<template>
  <div class="random-generator">
    <div class="tool-header">
      <h2><i class="fas fa-dice"></i> 随机数生成器</h2>
      <p>生成各种类型的随机数，支持自定义范围和多种格式</p>
    </div>

    <div class="tool-body">
      <div class="mode-selector">
        <button 
          v-for="mode in modes" 
          :key="mode.id" 
          :class="{ active: currentMode === mode.id }" 
          @click="setMode(mode.id)"
        >
          <i :class="mode.icon"></i> {{ mode.name }}
        </button>
      </div>

      <div class="options-section">
        <!-- 整数选项 -->
        <div v-if="currentMode === 'integer'" class="option-group">
          <label>最小值</label>
          <input type="number" v-model.number="intMin" @change="validateIntRange">
          <label>最大值</label>
          <input type="number" v-model.number="intMax" @change="validateIntRange">
          <label>生成数量</label>
          <input type="number" v-model.number="intCount" min="1" max="1000">
          <label>是否允许重复</label>
          <input type="checkbox" v-model="intAllowDuplicates">
          <label>排序结果</label>
          <select v-model="intSortOrder">
            <option value="none">不排序</option>
            <option value="asc">升序</option>
            <option value="desc">降序</option>
          </select>
        </div>

        <!-- 小数选项 -->
        <div v-if="currentMode === 'decimal'" class="option-group">
          <label>最小值</label>
          <input type="number" v-model.number="decimalMin" step="0.1" @change="validateDecimalRange">
          <label>最大值</label>
          <input type="number" v-model.number="decimalMax" step="0.1" @change="validateDecimalRange">
          <label>小数位数</label>
          <input type="number" v-model.number="decimalPrecision" min="0" max="10">
          <label>生成数量</label>
          <input type="number" v-model.number="decimalCount" min="1" max="1000">
        </div>

        <!-- 密码选项 -->
        <div v-if="currentMode === 'password'" class="option-group">
          <label>密码长度</label>
          <input type="number" v-model.number="passwordLength" min="4" max="50">
          <label>包含大写字母</label>
          <input type="checkbox" v-model="passwordUppercase">
          <label>包含小写字母</label>
          <input type="checkbox" v-model="passwordLowercase" checked>
          <label>包含数字</label>
          <input type="checkbox" v-model="passwordNumbers" checked>
          <label>包含特殊字符</label>
          <input type="checkbox" v-model="passwordSpecial">
          <label>生成数量</label>
          <input type="number" v-model.number="passwordCount" min="1" max="20">
        </div>

        <!-- 字符串选项 -->
        <div v-if="currentMode === 'string'" class="option-group">
          <label>字符串长度</label>
          <input type="number" v-model.number="stringLength" min="1" max="100">
          <label>字符集</label>
          <select v-model="stringCharset">
            <option value="alpha">字母 (a-z)</option>
            <option value="alphanumeric">字母和数字 (a-z, 0-9)</option>
            <option value="numeric">数字 (0-9)</option>
            <option value="hex">十六进制 (0-9, a-f)</option>
            <option value="custom">自定义字符集</option>
          </select>
          <input 
            v-if="stringCharset === 'custom'" 
            type="text" 
            v-model="stringCustomCharset" 
            placeholder="输入自定义字符"
          >
          <label>生成数量</label>
          <input type="number" v-model.number="stringCount" min="1" max="100">
        </div>

        <!-- 颜色选项 -->
        <div v-if="currentMode === 'color'" class="option-group">
          <label>颜色格式</label>
          <select v-model="colorFormat">
            <option value="hex">十六进制 (#RRGGBB)</option>
            <option value="rgb">RGB (rgb(r, g, b))</option>
            <option value="hsl">HSL (hsl(h, s%, l%))</option>
          </select>
          <label>生成数量</label>
          <input type="number" v-model.number="colorCount" min="1" max="50">
        </div>

        <!-- 布尔值选项 -->
        <div v-if="currentMode === 'boolean'" class="option-group">
          <label>真值概率 (%)</label>
          <input type="number" v-model.number="booleanProbability" min="0" max="100">
          <label>生成数量</label>
          <input type="number" v-model.number="booleanCount" min="1" max="100">
          <label>输出格式</label>
          <select v-model="booleanFormat">
            <option value="true-false">True/False</option>
            <option value="1-0">1/0</option>
            <option value="yes-no">Yes/No</option>
          </select>
        </div>

        <!-- 数组选项 -->
        <div v-if="currentMode === 'array'" class="option-group">
          <label>数组元素</label>
          <textarea v-model="arrayItems" placeholder="每行一个元素"></textarea>
          <label>选择数量</label>
          <input type="number" v-model.number="arrayCount" min="1" :max="arrayItemCount">
          <label>是否允许重复</label>
          <input type="checkbox" v-model="arrayAllowDuplicates">
          <label>随机排序</label>
          <input type="checkbox" v-model="arrayShuffle">
        </div>

        <!-- 日期选项 -->
        <div v-if="currentMode === 'date'" class="option-group">
          <label>开始日期</label>
          <input type="date" v-model="dateStart">
          <label>结束日期</label>
          <input type="date" v-model="dateEnd">
          <label>时间格式</label>
          <select v-model="dateFormat">
            <option value="yyyy-mm-dd">YYYY-MM-DD</option>
            <option value="dd/mm/yyyy">DD/MM/YYYY</option>
            <option value="mm/dd/yyyy">MM/DD/YYYY</option>
            <option value="full">完整日期时间</option>
          </select>
          <label>生成数量</label>
          <input type="number" v-model.number="dateCount" min="1" max="100">
        </div>
      </div>

      <div class="action-section">
        <button @click="generate" class="generate-btn">
          <i class="fas fa-bolt"></i> 生成随机数
        </button>
        <button @click="resetOptions" class="reset-btn">
          <i class="fas fa-redo"></i> 重置选项
        </button>
      </div>

      <div class="results-section">
        <div class="results-header">
          <h3>生成结果</h3>
          <div class="results-actions">
            <button @click="copyResults" :disabled="!results.length">
              <i class="fas fa-copy"></i> 复制
            </button>
            <button @click="clearResults" :disabled="!results.length">
              <i class="fas fa-trash"></i> 清空
            </button>
          </div>
        </div>

        <div class="results-content">
          <div v-if="!results.length" class="no-results">
            <i class="fas fa-info-circle"></i>
            <p>点击"生成随机数"按钮生成结果</p>
          </div>

          <div v-else class="results-list">
            <div 
              v-for="(result, index) in results" 
              :key="index" 
              class="result-item"
            >
              <span class="result-number">{{ index + 1 }}.</span>
              <span class="result-value">{{ result }}</span>
            </div>
          </div>
        </div>

        <div class="results-stats" v-if="results.length">
          <p>已生成 {{ results.length }} 个结果</p>
        </div>
      </div>

      <div class="info-section">
        <h3>随机数生成说明</h3>
        <div class="info-content">
          <p>本工具使用浏览器内置的 <code>Math.random()</code> 函数生成随机数，这是一种伪随机数生成算法。</p>
          
          <div class="usage-tips">
            <h4>使用提示:</h4>
            <ul>
              <li>对于密码生成，建议使用至少12个字符，并包含多种字符类型</li>
              <li>整数范围包含最小值和最大值（闭区间）</li>
              <li>自定义字符集可以包含任何字符，包括空格和特殊符号</li>
              <li>日期范围包含开始日期和结束日期</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RandomGenerator',
  data() {
    return {
      currentMode: 'integer',
      modes: [
        { id: 'integer', name: '整数', icon: 'fas fa-hashtag' },
        { id: 'decimal', name: '小数', icon: 'fas fa-divide' },
        { id: 'password', name: '密码', icon: 'fas fa-key' },
        { id: 'string', name: '字符串', icon: 'fas fa-font' },
        { id: 'color', name: '颜色', icon: 'fas fa-palette' },
        { id: 'boolean', name: '布尔值', icon: 'fas fa-check-circle' },
        { id: 'array', name: '数组随机', icon: 'fas fa-list' },
        { id: 'date', name: '日期时间', icon: 'fas fa-calendar' }
      ],
      
      // 整数选项
      intMin: 1,
      intMax: 100,
      intCount: 5,
      intAllowDuplicates: true,
      intSortOrder: 'none',
      
      // 小数选项
      decimalMin: 0,
      decimalMax: 1,
      decimalPrecision: 2,
      decimalCount: 5,
      
      // 密码选项
      passwordLength: 12,
      passwordUppercase: true,
      passwordLowercase: true,
      passwordNumbers: true,
      passwordSpecial: false,
      passwordCount: 5,
      
      // 字符串选项
      stringLength: 8,
      stringCharset: 'alphanumeric',
      stringCustomCharset: '',
      stringCount: 5,
      
      // 颜色选项
      colorFormat: 'hex',
      colorCount: 5,
      
      // 布尔值选项
      booleanProbability: 50,
      booleanCount: 10,
      booleanFormat: 'true-false',
      
      // 数组选项
      arrayItems: '苹果\n香蕉\n橙子\n葡萄\n西瓜',
      arrayCount: 3,
      arrayAllowDuplicates: false,
      arrayShuffle: false,
      
      // 日期选项
      dateStart: this.formatDate(new Date()),
      dateEnd: this.formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30天后
      dateFormat: 'yyyy-mm-dd',
      dateCount: 5,
      
      // 结果
      results: []
    };
  },
  computed: {
    arrayItemCount() {
      return this.arrayItems.split('\n').filter(item => item.trim()).length;
    }
  },
  methods: {
    setMode(mode) {
      this.currentMode = mode;
      this.results = [];
    },
    
    generate() {
      switch (this.currentMode) {
        case 'integer':
          this.generateIntegers();
          break;
        case 'decimal':
          this.generateDecimals();
          break;
        case 'password':
          this.generatePasswords();
          break;
        case 'string':
          this.generateStrings();
          break;
        case 'color':
          this.generateColors();
          break;
        case 'boolean':
          this.generateBooleans();
          break;
        case 'array':
          this.generateArrayItems();
          break;
        case 'date':
          this.generateDates();
          break;
      }
    },
    
    generateIntegers() {
      const results = [];
      const min = Math.min(this.intMin, this.intMax);
      const max = Math.max(this.intMin, this.intMax);
      const range = max - min + 1;
      
      if (!this.intAllowDuplicates && this.intCount > range) {
        alert(`错误：不允许重复时，生成数量不能大于范围大小 (${range})`);
        return;
      }
      
      if (!this.intAllowDuplicates) {
        // 生成不重复的随机数
        const allNumbers = Array.from({ length: range }, (_, i) => min + i);
        for (let i = 0; i < this.intCount && allNumbers.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * allNumbers.length);
          results.push(allNumbers.splice(randomIndex, 1)[0]);
        }
      } else {
        // 生成允许重复的随机数
        for (let i = 0; i < this.intCount; i++) {
          results.push(Math.floor(Math.random() * range) + min);
        }
      }
      
      // 排序
      if (this.intSortOrder === 'asc') {
        results.sort((a, b) => a - b);
      } else if (this.intSortOrder === 'desc') {
        results.sort((a, b) => b - a);
      }
      
      this.results = results;
    },
    
    generateDecimals() {
      const results = [];
      const min = Math.min(this.decimalMin, this.decimalMax);
      const max = Math.max(this.decimalMin, this.decimalMax);
      const range = max - min;
      const precision = Math.pow(10, this.decimalPrecision);
      
      for (let i = 0; i < this.decimalCount; i++) {
        const randomValue = Math.random() * range + min;
        const roundedValue = Math.round(randomValue * precision) / precision;
        results.push(roundedValue);
      }
      
      this.results = results;
    },
    
    generatePasswords() {
      const results = [];
      const chars = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*()_+-=[]{}|;:,.<>?'
      };
      
      let charSet = '';
      if (this.passwordUppercase) charSet += chars.uppercase;
      if (this.passwordLowercase) charSet += chars.lowercase;
      if (this.passwordNumbers) charSet += chars.numbers;
      if (this.passwordSpecial) charSet += chars.special;
      
      if (!charSet) {
        alert('错误：至少需要选择一种字符类型');
        return;
      }
      
      for (let i = 0; i < this.passwordCount; i++) {
        let password = '';
        for (let j = 0; j < this.passwordLength; j++) {
          const randomIndex = Math.floor(Math.random() * charSet.length);
          password += charSet[randomIndex];
        }
        results.push(password);
      }
      
      this.results = results;
    },
    
    generateStrings() {
      const results = [];
      let charSet = '';
      
      switch (this.stringCharset) {
        case 'alpha':
          charSet = 'abcdefghijklmnopqrstuvwxyz';
          break;
        case 'alphanumeric':
          charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
          break;
        case 'numeric':
          charSet = '0123456789';
          break;
        case 'hex':
          charSet = '0123456789abcdef';
          break;
        case 'custom':
          charSet = this.stringCustomCharset;
          break;
      }
      
      if (!charSet) {
        alert('错误：字符集不能为空');
        return;
      }
      
      for (let i = 0; i < this.stringCount; i++) {
        let str = '';
        for (let j = 0; j < this.stringLength; j++) {
          const randomIndex = Math.floor(Math.random() * charSet.length);
          str += charSet[randomIndex];
        }
        results.push(str);
      }
      
      this.results = results;
    },
    
    generateColors() {
      const results = [];
      
      for (let i = 0; i < this.colorCount; i++) {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        
        let color;
        switch (this.colorFormat) {
          case 'hex':
            color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
            break;
          case 'rgb':
            color = `rgb(${r}, ${g}, ${b})`;
            break;
          case 'hsl':
            // 简化的RGB转HSL（实际应用应使用完整算法）
            const h = Math.floor(Math.random() * 360);
            const s = Math.floor(Math.random() * 101);
            const l = Math.floor(Math.random() * 101);
            color = `hsl(${h}, ${s}%, ${l}%)`;
            break;
        }
        
        results.push(color);
      }
      
      this.results = results;
    },
    
    generateBooleans() {
      const results = [];
      const probability = this.booleanProbability / 100;
      
      for (let i = 0; i < this.booleanCount; i++) {
        const value = Math.random() < probability;
        
        switch (this.booleanFormat) {
          case 'true-false':
            results.push(value ? 'True' : 'False');
            break;
          case '1-0':
            results.push(value ? '1' : '0');
            break;
          case 'yes-no':
            results.push(value ? 'Yes' : 'No');
            break;
        }
      }
      
      this.results = results;
    },
    
    generateArrayItems() {
      const items = this.arrayItems.split('\n').filter(item => item.trim());
      
      if (items.length === 0) {
        alert('错误：数组元素不能为空');
        return;
      }
      
      if (!this.arrayAllowDuplicates && this.arrayCount > items.length) {
        alert(`错误：不允许重复时，选择数量不能大于元素数量 (${items.length})`);
        return;
      }
      
      let results = [];
      
      if (this.arrayAllowDuplicates) {
        // 允许重复选择
        for (let i = 0; i < this.arrayCount; i++) {
          const randomIndex = Math.floor(Math.random() * items.length);
          results.push(items[randomIndex]);
        }
      } else {
        // 不允许重复选择
        const shuffled = [...items];
        if (this.arrayShuffle) {
          // Fisher-Yates 洗牌算法
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }
        }
        
        results = shuffled.slice(0, this.arrayCount);
      }
      
      this.results = results;
    },
    
    generateDates() {
      const results = [];
      const start = new Date(this.dateStart).getTime();
      const end = new Date(this.dateEnd).getTime();
      
      if (start > end) {
        alert('错误：开始日期不能晚于结束日期');
        return;
      }
      
      const range = end - start;
      
      for (let i = 0; i < this.dateCount; i++) {
        const randomTime = start + Math.random() * range;
        const date = new Date(randomTime);
        
        let formattedDate;
        switch (this.dateFormat) {
          case 'yyyy-mm-dd':
            formattedDate = date.toISOString().split('T')[0];
            break;
          case 'dd/mm/yyyy':
            formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
            break;
          case 'mm/dd/yyyy':
            formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
            break;
          case 'full':
            formattedDate = date.toLocaleString();
            break;
        }
        
        results.push(formattedDate);
      }
      
      this.results = results;
    },
    
    copyResults() {
      const text = this.results.join('\n');
      navigator.clipboard.writeText(text).then(() => {
        alert('结果已复制到剪贴板');
      }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制结果');
      });
    },
    
    clearResults() {
      this.results = [];
    },
    
    resetOptions() {
      // 重置当前模式的选项
      switch (this.currentMode) {
        case 'integer':
          this.intMin = 1;
          this.intMax = 100;
          this.intCount = 5;
          this.intAllowDuplicates = true;
          this.intSortOrder = 'none';
          break;
        case 'decimal':
          this.decimalMin = 0;
          this.decimalMax = 1;
          this.decimalPrecision = 2;
          this.decimalCount = 5;
          break;
        case 'password':
          this.passwordLength = 12;
          this.passwordUppercase = true;
          this.passwordLowercase = true;
          this.passwordNumbers = true;
          this.passwordSpecial = false;
          this.passwordCount = 5;
          break;
        case 'string':
          this.stringLength = 8;
          this.stringCharset = 'alphanumeric';
          this.stringCustomCharset = '';
          this.stringCount = 5;
          break;
        case 'color':
          this.colorFormat = 'hex';
          this.colorCount = 5;
          break;
        case 'boolean':
          this.booleanProbability = 50;
          this.booleanCount = 10;
          this.booleanFormat = 'true-false';
          break;
        case 'array':
          this.arrayItems = '苹果\n香蕉\n橙子\n葡萄\n西瓜';
          this.arrayCount = 3;
          this.arrayAllowDuplicates = false;
          this.arrayShuffle = false;
          break;
        case 'date':
          this.dateStart = this.formatDate(new Date());
          this.dateEnd = this.formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
          this.dateFormat = 'yyyy-mm-dd';
          this.dateCount = 5;
          break;
      }
      
      this.results = [];
    },
    
    validateIntRange() {
      if (this.intMin > this.intMax) {
        [this.intMin, this.intMax] = [this.intMax, this.intMin];
      }
    },
    
    validateDecimalRange() {
      if (this.decimalMin > this.decimalMax) {
        [this.decimalMin, this.decimalMax] = [this.decimalMax, this.decimalMin];
      }
    },
    
    formatDate(date) {
      return date.toISOString().split('T')[0];
    }
  }
}
</script>

<style scoped>
.random-generator {
  max-width: 1000px;
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
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
  justify-content: center;
}

.mode-selector button {
  padding: 10px 15px;
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

.options-section {
  margin-bottom: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.option-group {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
}

.option-group label {
  font-weight: 600;
  color: #2c3e50;
  text-align: right;
}

.option-group input[type="number"],
.option-group input[type="text"],
.option-group select,
.option-group textarea {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
}

.option-group input[type="checkbox"] {
  justify-self: start;
}

.option-group textarea {
  grid-column: 1 / -1;
  min-height: 80px;
  resize: vertical;
}

.action-section {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 25px;
}

.generate-btn, .reset-btn {
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

.generate-btn {
  background: #2ecc71;
  color: white;
}

.generate-btn:hover {
  background: #27ae60;
}

.reset-btn {
  background: #e74c3c;
  color: white;
}

.reset-btn:hover {
  background: #c0392b;
}

.results-section {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 25px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
}

.results-header h3 {
  margin: 0;
  color: #2c3e50;
}

.results-actions {
  display: flex;
  gap: 10px;
}

.results-actions button {
  padding: 6px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.results-actions button:hover:not(:disabled) {
  background: #e9ecef;
}

.results-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.results-content {
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.no-results {
  text-align: center;
  padding: 30px;
  color: #7f8c8d;
}

.no-results i {
  font-size: 48px;
  margin-bottom: 15px;
  display: block;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.result-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border: 1px solid #eee;
  border-radius: 4px;
  font-family: monospace;
}

.result-number {
  font-weight: bold;
  color: #3498db;
  margin-right: 10px;
  min-width: 30px;
}

.result-value {
  word-break: break-all;
}

.results-stats {
  padding: 10px 15px;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  text-align: center;
  color: #7f8c8d;
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

.usage-tips h4 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.usage-tips ul {
  padding-left: 20px;
}

.usage-tips li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.info-content code {
  background: #e9ecef;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

@media (max-width: 768px) {
  .mode-selector {
    flex-direction: column;
  }
  
  .option-group {
    grid-template-columns: 1fr;
    text-align: left;
  }
  
  .option-group label {
    text-align: left;
  }
  
  .action-section {
    flex-direction: column;
  }
  
  .results-header {
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  
  .results-actions {
    justify-content: center;
  }
}
</style>