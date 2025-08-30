<template>
  <div class="password-generator">
    <div class="container">
      <h2>随机密码生成器</h2>

      <div class="password-display">
        <input type="text" class="password-input" :value="password" readonly placeholder="点击生成密码" />
        <button class="copy-btn" @click="copyPassword">复制</button>
      </div>

      <div class="options">
        <div class="option-group">
          <label for="length"
            >密码长度: <span class="length-value">{{ passwordLength }}</span></label
          >
          <input type="range" class="length-slider" id="length" min="4" max="32" v-model="passwordLength" />
        </div>

        <div class="option-group">
          <label>包含字符类型:</label>
          <div class="checkbox-group">
            <div class="checkbox-item">
              <input type="checkbox" id="uppercase" v-model="includeUppercase" />
              <label for="uppercase">大写字母</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="lowercase" v-model="includeLowercase" />
              <label for="lowercase">小写字母</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="numbers" v-model="includeNumbers" />
              <label for="numbers">数字</label>
            </div>
            <div class="checkbox-item">
              <input type="checkbox" id="symbols" v-model="includeSymbols" />
              <label for="symbols">特殊符号</label>
            </div>
          </div>
        </div>
      </div>

      <div class="strength-meter">
        <div class="strength-fill" :style="{ width: passwordStrength * 10 + '%', background: strengthColor }"></div>
      </div>

      <div class="buttons">
        <button class="generate-btn" @click="generatePassword">生成密码</button>
      </div>
    </div>

    <div class="notification" :class="{ show: showNotification }">密码已复制到剪贴板！</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// 字符集
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// 响应式数据
const passwordLength = ref(12);
const includeUppercase = ref(true);
const includeLowercase = ref(true);
const includeNumbers = ref(true);
const includeSymbols = ref(false);
const password = ref('');
const showNotification = ref(false);

// 密码强度计算
const passwordStrength = computed(() => {
  if (!password.value) return 0;

  let strength = 0;

  // 长度贡献
  strength += Math.min(password.value.length / 4, 6);

  // 字符种类贡献
  const hasUpper = /[A-Z]/.test(password.value);
  const hasLower = /[a-z]/.test(password.value);
  const hasNumber = /[0-9]/.test(password.value);
  const hasSymbol = /[^A-Za-z0-9]/.test(password.value);

  const varietyCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
  strength += (varietyCount - 1) * 2;

  return Math.min(Math.max(strength, 0), 10);
});

// 强度指示器颜色
const strengthColor = computed(() => {
  if (passwordStrength.value < 4) {
    return '#e74c3c'; // 弱 - 红色
  } else if (passwordStrength.value < 7) {
    return '#f39c12'; // 中 - 黄色
  } else {
    return '#2ecc71'; // 强 - 绿色
  }
});

// 生成密码函数
const generatePassword = () => {
  let chars = '';

  if (includeUppercase.value) chars += uppercaseChars;
  if (includeLowercase.value) chars += lowercaseChars;
  if (includeNumbers.value) chars += numberChars;
  if (includeSymbols.value) chars += symbolChars;

  // 确保至少选择了一种字符类型
  if (chars.length === 0) {
    password.value = '请至少选择一种字符类型';
    return;
  }

  let result = '';
  const randomValues = new Uint32Array(passwordLength.value);
  window.crypto.getRandomValues(randomValues);

  for (let i = 0; i < passwordLength.value; i++) {
    const randomIndex = randomValues[i] % chars.length;
    result += chars[randomIndex];
  }

  password.value = result;
};

// 复制密码函数
const copyPassword = () => {
  if (!password.value || password.value === '请至少选择一种字符类型') {
    return;
  }

  navigator.clipboard.writeText(password.value).then(() => {
    showNotification.value = true;
    setTimeout(() => {
      showNotification.value = false;
    }, 2000);
  });
};

// 监听选项变化，重新生成密码
watch([passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols], () => {
  generatePassword();
});

// 初始化生成密码
onMounted(() => {
  generatePassword();
});
</script>

<style scoped>
.password-generator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
}

.container {
  background-color: var(--vp-c-bg-soft);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  border: 1px solid var(--vp-c-border);
}

h2 {
  text-align: center;
  color: var(--vp-c-text-1);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.password-display {
  position: relative;
  margin-bottom: 1.5rem;
}

.password-input {
  width: 100%;
  padding: 0.875rem;
  border: 2px solid var(--vp-c-border);
  border-radius: 8px;
  font-size: 1rem;
  letter-spacing: 1px;
  padding-right: 100px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.copy-btn {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 0.875rem;
}

.copy-btn:hover {
  background: var(--vp-c-brand-dark);
}

.options {
  margin-bottom: 1.5rem;
}

.option-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.length-slider {
  width: 100%;
  height: 8px;
  -webkit-appearance: none;
  background: var(--vp-c-border);
  border-radius: 5px;
  outline: none;
}

.length-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  cursor: pointer;
}

.length-value {
  text-align: center;
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--vp-c-brand);
  margin-top: 0.5rem;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
}

.checkbox-item input {
  margin-right: 0.5rem;
  width: 18px;
  height: 18px;
}

.checkbox-item label {
  margin-bottom: 0;
  font-weight: normal;
}

.strength-meter {
  height: 8px;
  border-radius: 5px;
  background: var(--vp-c-border);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  width: 0;
  transition:
    width 0.3s,
    background 0.3s;
}

.buttons {
  display: flex;
  justify-content: center;
}

.generate-btn {
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.generate-btn:hover {
  background: var(--vp-c-brand-dark);
}

.notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 1000;
}

.notification.show {
  opacity: 1;
}

@media (max-width: 640px) {
  .container {
    padding: 1.5rem;
  }

  .checkbox-group {
    grid-template-columns: 1fr;
  }

  h2 {
    font-size: 1.25rem;
  }
}
</style>
