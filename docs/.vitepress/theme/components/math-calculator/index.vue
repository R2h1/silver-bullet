<template>
  <div class="math-calculator">
    <div class="tool-header">
      <h2>数学计算器</h2>
      <p>功能强大的科学计算器，支持基本运算、科学函数和计算历史记录</p>
    </div>

    <div class="calculator-container">
      <div class="calculator-display">
        <div class="expression">{{ expression || '0' }}</div>
        <div class="result">{{ result || '0' }}</div>
      </div>

      <div class="calculator-controls">
        <div class="controls-section">
          <h4>基本运算</h4>
          <div class="button-grid basic">
            <button class="calc-btn function" @click="clearAll">C</button>
            <button class="calc-btn function" @click="backspace">⌫</button>
            <button class="calc-btn function" @click="addToExpression('%')">%</button>
            <button class="calc-btn operator" @click="addToExpression('/')">/</button>

            <button class="calc-btn number" @click="addToExpression('7')">7</button>
            <button class="calc-btn number" @click="addToExpression('8')">8</button>
            <button class="calc-btn number" @click="addToExpression('9')">9</button>
            <button class="calc-btn operator" @click="addToExpression('*')">×</button>

            <button class="calc-btn number" @click="addToExpression('4')">4</button>
            <button class="calc-btn number" @click="addToExpression('5')">5</button>
            <button class="calc-btn number" @click="addToExpression('6')">6</button>
            <button class="calc-btn operator" @click="addToExpression('-')">-</button>

            <button class="calc-btn number" @click="addToExpression('1')">1</button>
            <button class="calc-btn number" @click="addToExpression('2')">2</button>
            <button class="calc-btn number" @click="addToExpression('3')">3</button>
            <button class="calc-btn operator" @click="addToExpression('+')">+</button>

            <button class="calc-btn number" @click="addToExpression('0')">0</button>
            <button class="calc-btn number" @click="addToExpression('.')">.</button>
            <button class="calc-btn equals" @click="calculate">=</button>
          </div>
        </div>

        <div class="controls-section">
          <h4>科学函数</h4>
          <div class="button-grid scientific">
            <button class="calc-btn scientific" @click="addFunction('Math.sin')">sin</button>
            <button class="calc-btn scientific" @click="addFunction('Math.cos')">cos</button>
            <button class="calc-btn scientific" @click="addFunction('Math.tan')">tan</button>
            <button class="calc-btn scientific" @click="addFunction('Math.log')">ln</button>
            
            <button class="calc-btn scientific" @click="addFunction('Math.asin')">asin</button>
            <button class="calc-btn scientific" @click="addFunction('Math.acos')">acos</button>
            <button class="calc-btn scientific" @click="addFunction('Math.atan')">atan</button>
            <button class="calc-btn scientific" @click="addFunction('Math.log10')">log</button>
            
            <button class="calc-btn scientific" @click="addToExpression('Math.PI')">π</button>
            <button class="calc-btn scientific" @click="addToExpression('Math.E')">e</button>
            <button class="calc-btn scientific" @click="addFunction('Math.sqrt')">√</button>
            <button class="calc-btn scientific" @click="addToExpression('**')">^</button>
            
            <button class="calc-btn scientific" @click="addFunction('Math.abs')">abs</button>
            <button class="calc-btn scientific" @click="addFunction('Math.exp')">exp</button>
            <button class="calc-btn scientific" @click="addToExpression('(')">(</button>
            <button class="calc-btn scientific" @click="addToExpression(')')">)</button>
          </div>
        </div>
      </div>

      <div class="history-section" v-if="history.length > 0">
        <h4>计算历史</h4>
        <div class="history-list">
          <div 
            v-for="(item, index) in history.slice().reverse()" 
            :key="index" 
            class="history-item"
            @click="useHistory(item)"
          >
            <div class="history-expression">{{ item.expression }}</div>
            <div class="history-result">= {{ item.result }}</div>
          </div>
        </div>
        <button class="clear-history" @click="clearHistory">清空历史</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MathCalculator',
  data() {
    return {
      expression: '',
      result: '',
      history: [],
      isNewCalculation: true
    };
  },
  mounted() {
    // 加载历史记录
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
      this.history = JSON.parse(savedHistory);
    }
    
    // 添加键盘支持
    window.addEventListener('keydown', this.handleKeyPress);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
  },
  methods: {
    addToExpression(value) {
      if (this.isNewCalculation && !['+', '-', '*', '/'].includes(value)) {
        this.expression = '';
        this.isNewCalculation = false;
      }
      
      // 防止连续多个运算符
      const lastChar = this.expression.slice(-1);
      const operators = ['+', '-', '*', '/', '%'];
      
      if (operators.includes(lastChar) && operators.includes(value)) {
        this.expression = this.expression.slice(0, -1) + value;
      } else {
        this.expression += value;
      }
    },
    
    addFunction(func) {
      if (this.isNewCalculation) {
        this.expression = '';
        this.isNewCalculation = false;
      }
      
      this.expression += `${func}(`;
    },
    
    calculate() {
      if (!this.expression) return;
      
      try {
        // 安全地计算表达式
        let calcExpression = this.expression
          .replace(/Math\./g, '')
          .replace(/\^/g, '**')
          .replace(/√/g, 'sqrt');
        
        // 使用Function构造函数而不是eval
        const calculate = new Function('return ' + calcExpression);
        this.result = calculate();
        
        // 添加到历史记录
        this.history.push({
          expression: this.expression,
          result: this.result
        });
        
        // 保存到localStorage
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
        
        this.isNewCalculation = true;
      } catch (error) {
        this.result = '错误';
        console.error('计算错误:', error);
      }
    },
    
    clearAll() {
      this.expression = '';
      this.result = '';
      this.isNewCalculation = true;
    },
    
    backspace() {
      this.expression = this.expression.slice(0, -1);
      if (this.expression === '') {
        this.isNewCalculation = true;
      }
    },
    
    clearHistory() {
      this.history = [];
      localStorage.removeItem('calculatorHistory');
    },
    
    useHistory(item) {
      this.expression = item.expression;
      this.result = item.result;
      this.isNewCalculation = true;
    },
    
    handleKeyPress(event) {
      const key = event.key;
      
      // 数字和基本运算符
      if (/[0-9]/.test(key) || ['+', '-', '*', '/', '.', '(', ')', '%'].includes(key)) {
        this.addToExpression(key);
      }
      
      // 回车键计算
      if (key === 'Enter' || key === '=') {
        this.calculate();
      }
      
      // 退格键
      if (key === 'Backspace') {
        this.backspace();
      }
      
      // 清除键
      if (key === 'Escape' || key === 'c' || key === 'C') {
        this.clearAll();
      }
    }
  }
};
</script>

<style scoped>
.math-calculator {
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

.calculator-container {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.calculator-display {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: right;
  min-height: 100px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.expression {
  font-size: 1.2em;
  color: #6c757d;
  min-height: 1.5em;
  word-break: break-all;
}

.result {
  font-size: 2em;
  font-weight: bold;
  color: #2c3e50;
  min-height: 1.5em;
  word-break: break-all;
}

.calculator-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.controls-section {
  flex: 1;
}

.controls-section h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.button-grid {
  display: grid;
  gap: 8px;
}

.basic {
  grid-template-columns: repeat(4, 1fr);
}

.scientific {
  grid-template-columns: repeat(4, 1fr);
}

.calc-btn {
  padding: 12px 8px;
  border: none;
  border-radius: 6px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calc-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.calc-btn:active {
  transform: translateY(0);
}

.number {
  background-color: #fff;
  color: #2c3e50;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.number:hover {
  background-color: #f8f9fa;
}

.operator {
  background-color: #4CAF50;
  color: white;
}

.operator:hover {
  background-color: #45a049;
}

.function {
  background-color: #f44336;
  color: white;
}

.function:hover {
  background-color: #d32f2f;
}

.equals {
  background-color: #2196F3;
  color: white;
  grid-column: span 2;
}

.equals:hover {
  background-color: #1976D2;
}

.scientific {
  background-color: #9C27B0;
  color: white;
  font-size: 0.9em;
}

.scientific:hover {
  background-color: #7B1FA2;
}

.history-section {
  border-top: 1px solid #e9ecef;
  padding-top: 15px;
}

.history-section h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.history-list {
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 10px;
}

.history-item {
  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.history-item:hover {
  background-color: #e9ecef;
}

.history-expression {
  font-size: 0.9em;
  color: #6c757d;
  word-break: break-all;
}

.history-result {
  font-weight: bold;
  color: #2c3e50;
}

.clear-history {
  padding: 8px 16px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
}

.clear-history:hover {
  background-color: #5a6268;
}

@media (max-width: 768px) {
  .calculator-controls {
    flex-direction: column;
  }
  
  .button-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .calc-btn {
    padding: 10px 6px;
    font-size: 1em;
    min-height: 40px;
  }
}
</style>