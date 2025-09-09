<template>
  <div class="bmi-calculator">
    <div class="tool-header">
      <h2><i class="fas fa-weight"></i> BMI计算器</h2>
      <p>计算您的身体质量指数(BMI)，了解您的体重健康状况</p>
    </div>

    <div class="tool-body">
      <div class="unit-selector">
        <button 
          :class="{ active: unitSystem === 'metric' }" 
          @click="unitSystem = 'metric'"
        >
          <i class="fas fa-ruler"></i> 公制单位 (kg/cm)
        </button>
        <button 
          :class="{ active: unitSystem === 'imperial' }" 
          @click="unitSystem = 'imperial'"
        >
          <i class="fas fa-ruler-combined"></i> 英制单位 (lb/in)
        </button>
      </div>

      <div class="input-section">
        <div class="input-group" v-if="unitSystem === 'metric'">
          <label>身高 (厘米)</label>
          <input 
            type="number" 
            v-model.number="heightCm" 
            @input="calculateBMI" 
            placeholder="例如: 175"
            min="50"
            max="250"
          >
        </div>

        <div class="input-group" v-if="unitSystem === 'imperial'">
          <label>身高 (英尺)</label>
          <input 
            type="number" 
            v-model.number="heightFeet" 
            @input="calculateBMI" 
            placeholder="英尺"
            min="2"
            max="8"
          >
          <label>身高 (英寸)</label>
          <input 
            type="number" 
            v-model.number="heightInches" 
            @input="calculateBMI" 
            placeholder="英寸"
            min="0"
            max="11"
          >
        </div>

        <div class="input-group">
          <label v-if="unitSystem === 'metric'">体重 (公斤)</label>
          <label v-else>体重 (磅)</label>
          <input 
            type="number" 
            v-model.number="weight" 
            @input="calculateBMI" 
            :placeholder="unitSystem === 'metric' ? '例如: 70' : '例如: 150'"
            :min="unitSystem === 'metric' ? 20 : 50"
            :max="unitSystem === 'metric' ? 200 : 450"
          >
        </div>

        <div class="input-group" v-if="showAgeInput">
          <label>年龄</label>
          <input 
            type="number" 
            v-model.number="age" 
            @input="calculateBMI" 
            placeholder="可选"
            min="2"
            max="120"
          >
        </div>

        <div class="input-group" v-if="showGenderInput">
          <label>性别</label>
          <div class="gender-buttons">
            <button 
              :class="{ active: gender === 'male' }" 
              @click="gender = 'male'; calculateBMI()"
            >
              <i class="fas fa-mars"></i> 男性
            </button>
            <button 
              :class="{ active: gender === 'female' }" 
              @click="gender = 'female'; calculateBMI()"
            >
              <i class="fas fa-venus"></i> 女性
            </button>
          </div>
        </div>
      </div>

      <div class="result-section" v-if="bmiResult">
        <div class="bmi-result">
          <h3>您的BMI指数</h3>
          <div class="bmi-value" :class="bmiCategory.class">
            {{ bmiResult }}
          </div>
          <div class="bmi-category" :class="bmiCategory.class">
            {{ bmiCategory.name }}
          </div>
        </div>

        <div class="bmi-scale">
          <div class="scale-labels">
            <span>偏瘦</span>
            <span>健康</span>
            <span>超重</span>
            <span>肥胖</span>
          </div>
          <div class="scale-bar">
            <div 
              class="scale-indicator" 
              :style="{ left: scalePosition + '%' }"
              :class="bmiCategory.class"
            ></div>
          </div>
          <div class="scale-markers">
            <span class="marker" style="left: 0%">16</span>
            <span class="marker" style="left: 25%">18.5</span>
            <span class="marker" style="left: 50%">25</span>
            <span class="marker" style="left: 75%">30</span>
            <span class="marker" style="left: 100%">40</span>
          </div>
        </div>

        <div class="health-advice">
          <h4>健康建议</h4>
          <p>{{ bmiCategory.advice }}</p>
          
          <div class="weight-range">
            <p>您的健康体重范围: 
              <strong>{{ healthyWeightRange.min }} - {{ healthyWeightRange.max }} 
              {{ unitSystem === 'metric' ? 'kg' : 'lb' }}</strong>
            </p>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>BMI指数说明</h3>
        
        <div class="bmi-categories">
          <div v-for="category in categories" :key="category.name" class="category-item">
            <span class="category-color" :class="category.class"></span>
            <span class="category-name">{{ category.name }}</span>
            <span class="category-range">{{ category.range }}</span>
          </div>
        </div>

        <div class="bmi-limitations">
          <h4>BMI的局限性</h4>
          <p>BMI是一个简单的身高体重比例指标，但有一些局限性：</p>
          <ul>
            <li>无法区分肌肉和脂肪（肌肉发达的人可能被归类为超重）</li>
            <li>不考虑脂肪分布（腹部脂肪对健康影响更大）</li>
            <li>不考虑年龄、性别和种族差异</li>
            <li>不适用于孕妇、运动员和老年人</li>
          </ul>
          <p>BMI应作为初步筛查工具，而非唯一健康指标。</p>
        </div>

        <div class="additional-metrics" v-if="bmiResult">
          <h4>其他健康指标</h4>
          <div class="metrics-grid">
            <div class="metric">
              <span class="metric-name">理想体重</span>
              <span class="metric-value">{{ idealWeight }} {{ unitSystem === 'metric' ? 'kg' : 'lb' }}</span>
            </div>
            <div class="metric">
              <span class="metric-name">需要{{ weightChangeDirection }}</span>
              <span class="metric-value">{{ Math.abs(weightToChange) }} {{ unitSystem === 'metric' ? 'kg' : 'lb' }}</span>
            </div>
            <div class="metric">
              <span class="metric-name">基础代谢率(BMR)</span>
              <span class="metric-value">{{ bmr }} 卡路里/天</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BMICalculator',
  data() {
    return {
      unitSystem: 'metric', // metric or imperial
      heightCm: null,
      heightFeet: null,
      heightInches: null,
      weight: null,
      age: null,
      gender: 'male',
      showAgeInput: false,
      showGenderInput: false,
      bmiResult: null,
      categories: [
        { name: '严重偏瘦', range: '16.0以下', class: 'underweight-severe', advice: '您的体重严重不足，可能存在健康风险。建议咨询医生或营养师制定增重计划。' },
        { name: '偏瘦', range: '16.0 - 18.4', class: 'underweight', advice: '您的体重偏轻，建议增加营养摄入，适当增加体重以达到健康范围。' },
        { name: '正常', range: '18.5 - 24.9', class: 'normal', advice: '恭喜！您的体重在健康范围内。继续保持均衡饮食和规律运动。' },
        { name: '超重', range: '25.0 - 29.9', class: 'overweight', advice: '您的体重略高，建议调整饮食结构，增加运动量，以降低健康风险。' },
        { name: '肥胖I级', range: '30.0 - 34.9', class: 'obese-1', advice: '您的体重属于肥胖范围，会增加多种健康风险。建议制定减重计划并咨询专业人士。' },
        { name: '肥胖II级', range: '35.0 - 39.9', class: 'obese-2', advice: '您的体重属于中度肥胖，健康风险较高。强烈建议咨询医生制定科学的减重方案。' },
        { name: '肥胖III级', range: '40.0以上', class: 'obese-3', advice: '您的体重属于重度肥胖，健康风险极高。请务必寻求专业医疗帮助制定减重计划。' }
      ]
    };
  },
  computed: {
    bmiCategory() {
      if (!this.bmiResult) return {};
      
      if (this.bmiResult < 16) return this.categories[0];
      if (this.bmiResult < 18.5) return this.categories[1];
      if (this.bmiResult < 25) return this.categories[2];
      if (this.bmiResult < 30) return this.categories[3];
      if (this.bmiResult < 35) return this.categories[4];
      if (this.bmiResult < 40) return this.categories[5];
      return this.categories[6];
    },
    scalePosition() {
      if (!this.bmiResult) return 0;
      
      // BMI范围从16到40，映射到0-100%
      const bmi = Math.max(16, Math.min(40, this.bmiResult));
      return ((bmi - 16) / 24) * 100;
    },
    heightInMeters() {
      if (this.unitSystem === 'metric') {
        return this.heightCm / 100;
      } else {
        // 英制转公制: 1英尺 = 0.3048米, 1英寸 = 0.0254米
        return (this.heightFeet * 0.3048) + (this.heightInches * 0.0254);
      }
    },
    weightInKg() {
      if (this.unitSystem === 'metric') {
        return this.weight;
      } else {
        // 英制转公制: 1磅 = 0.453592公斤
        return this.weight * 0.453592;
      }
    },
    healthyWeightRange() {
      if (!this.heightInMeters) return { min: 0, max: 0 };
      
      // 健康BMI范围是18.5到24.9
      const minWeight = 18.5 * Math.pow(this.heightInMeters, 2);
      const maxWeight = 24.9 * Math.pow(this.heightInMeters, 2);
      
      if (this.unitSystem === 'metric') {
        return {
          min: minWeight.toFixed(1),
          max: maxWeight.toFixed(1)
        };
      } else {
        // 公制转英制: 1公斤 = 2.20462磅
        return {
          min: (minWeight * 2.20462).toFixed(1),
          max: (maxWeight * 2.20462).toFixed(1)
        };
      }
    },
    idealWeight() {
      if (!this.heightInMeters) return 0;
      
      // 使用Devine公式计算理想体重
      let idealWeightKg;
      if (this.gender === 'male') {
        idealWeightKg = 50 + 0.9 * (this.heightInMeters * 100 - 152);
      } else {
        idealWeightKg = 45.5 + 0.9 * (this.heightInMeters * 100 - 152);
      }
      
      if (this.unitSystem === 'metric') {
        return idealWeightKg.toFixed(1);
      } else {
        return (idealWeightKg * 2.20462).toFixed(1);
      }
    },
    weightToChange() {
      if (!this.weightInKg || !this.heightInMeters) return 0;
      
      const currentBMI = this.weightInKg / Math.pow(this.heightInMeters, 2);
      let targetWeight;
      
      if (currentBMI < 18.5) {
        // 偏瘦，需要增重到18.5
        targetWeight = 18.5 * Math.pow(this.heightInMeters, 2);
      } else if (currentBMI > 24.9) {
        // 超重，需要减重到24.9
        targetWeight = 24.9 * Math.pow(this.heightInMeters, 2);
      } else {
        return 0; // 已经在健康范围内
      }
      
      const weightDifference = targetWeight - this.weightInKg;
      
      if (this.unitSystem === 'metric') {
        return weightDifference.toFixed(1);
      } else {
        return (weightDifference * 2.20462).toFixed(1);
      }
    },
    weightChangeDirection() {
      if (!this.weightInKg || !this.heightInMeters) return '';
      
      const currentBMI = this.weightInKg / Math.pow(this.heightInMeters, 2);
      
      if (currentBMI < 18.5) return '增重';
      if (currentBMI > 24.9) return '减重';
      return '维持';
    },
    bmr() {
      // 计算基础代谢率 (Harris-Benedict公式)
      if (!this.weightInKg || !this.heightInMeters || !this.age) return 0;
      
      if (this.gender === 'male') {
        return (88.362 + (13.397 * this.weightInKg) + (4.799 * this.heightInMeters * 100) - (5.677 * this.age)).toFixed(0);
      } else {
        return (447.593 + (9.247 * this.weightInKg) + (3.098 * this.heightInMeters * 100) - (4.330 * this.age)).toFixed(0);
      }
    }
  },
  methods: {
    calculateBMI() {
      if (!this.heightInMeters || !this.weightInKg) {
        this.bmiResult = null;
        return;
      }
      
      // BMI = 体重(kg) / 身高(m)²
      const bmi = this.weightInKg / Math.pow(this.heightInMeters, 2);
      this.bmiResult = bmi.toFixed(1);
    }
  },
  watch: {
    unitSystem() {
      this.bmiResult = null;
    }
  }
}
</script>

<style scoped>
.bmi-calculator {
  max-width: 800px;
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

.unit-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 25px;
  gap: 10px;
}

.unit-selector button {
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

.unit-selector button:hover {
  background: #e9ecef;
}

.unit-selector button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.input-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
}

.input-group input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.gender-buttons {
  display: flex;
  gap: 10px;
}

.gender-buttons button {
  flex: 1;
  padding: 10px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.gender-buttons button:hover {
  background: #e9ecef;
}

.gender-buttons button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.result-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.bmi-result {
  text-align: center;
  margin-bottom: 25px;
}

.bmi-result h3 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.bmi-value {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 10px;
}

.bmi-category {
  font-size: 20px;
  font-weight: 600;
}

.bmi-scale {
  margin-bottom: 25px;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 12px;
  color: #7f8c8d;
}

.scale-bar {
  height: 10px;
  background: linear-gradient(to right, 
    #3498db, 
    #2ecc71 25%, 
    #f39c12 50%, 
    #e74c3c 75%, 
    #c0392b
  );
  border-radius: 5px;
  position: relative;
  margin-bottom: 25px;
}

.scale-indicator {
  position: absolute;
  top: -5px;
  width: 10px;
  height: 20px;
  background: white;
  border: 2px solid #2c3e50;
  border-radius: 3px;
  transform: translateX(-50%);
}

.scale-markers {
  position: relative;
  height: 20px;
}

.marker {
  position: absolute;
  font-size: 12px;
  transform: translateX(-50%);
  color: #7f8c8d;
}

.health-advice {
  background: white;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid;
  border-left-color: inherit;
}

.health-advice h4 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.health-advice p {
  margin-bottom: 15px;
  line-height: 1.6;
}

.weight-range {
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.info-section {
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.info-section h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.bmi-categories {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 25px;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
}

.category-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 10px;
}

.category-name {
  flex: 1;
  font-weight: 500;
}

.category-range {
  color: #7f8c8d;
}

.bmi-limitations {
  background: #fff8e1;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 25px;
}

.bmi-limitations h4 {
  margin-bottom: 10px;
  color: #d35400;
}

.bmi-limitations p {
  margin-bottom: 10px;
  line-height: 1.6;
}

.bmi-limitations ul {
  padding-left: 20px;
  margin-bottom: 10px;
}

.bmi-limitations li {
  margin-bottom: 5px;
  line-height: 1.5;
}

.additional-metrics {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
}

.additional-metrics h4 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.metric-name {
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 5px;
}

.metric-value {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

/* BMI类别颜色 */
.underweight-severe {
  color: #3498db;
  border-color: #3498db;
}

.underweight {
  color: #2ecc71;
  border-color: #2ecc71;
}

.normal {
  color: #27ae60;
  border-color: #27ae60;
}

.overweight {
  color: #f39c12;
  border-color: #f39c12;
}

.obese-1 {
  color: #e74c3c;
  border-color: #e74c3c;
}

.obese-2 {
  color: #c0392b;
  border-color: #c0392b;
}

.obese-3 {
  color: #922b21;
  border-color: #922b21;
}

.category-color.underweight-severe {
  background: #3498db;
}

.category-color.underweight {
  background: #2ecc71;
}

.category-color.normal {
  background: #27ae60;
}

.category-color.overweight {
  background: #f39c12;
}

.category-color.obese-1 {
  background: #e74c3c;
}

.category-color.obese-2 {
  background: #c0392b;
}

.category-color.obese-3 {
  background: #922b21;
}

.scale-indicator.underweight-severe {
  border-color: #3498db;
}

.scale-indicator.underweight {
  border-color: #2ecc71;
}

.scale-indicator.normal {
  border-color: #27ae60;
}

.scale-indicator.overweight {
  border-color: #f39c12;
}

.scale-indicator.obese-1 {
  border-color: #e74c3c;
}

.scale-indicator.obese-2 {
  border-color: #c0392b;
}

.scale-indicator.obese-3 {
  border-color: #922b21;
}

@media (max-width: 768px) {
  .unit-selector {
    flex-direction: column;
  }
  
  .input-section {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>