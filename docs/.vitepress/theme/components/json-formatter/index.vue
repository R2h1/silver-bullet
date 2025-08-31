<template>
  <div class="json-formatter">
    <div class="tool-header">
      <h2>JSON 格式化工具</h2>
      <p>美化、验证和格式化 JSON 数据</p>
    </div>

    <!-- 优化后的操作按钮区域 -->
    <div class="tool-controls">
      <div class="mode-selection">
        <h4>选择操作模式</h4>
        <div class="mode-buttons">
          <button 
            class="mode-btn" 
            :class="{ active: activeTab === 'format' }"
            @click="activeTab = 'format'"
          >
            <span class="btn-icon">📋</span>
            <span class="btn-text">格式化</span>
            <span class="btn-desc">美化 JSON 格式</span>
          </button>
          <button 
            class="mode-btn" 
            :class="{ active: activeTab === 'minify' }"
            @click="activeTab = 'minify'"
          >
            <span class="btn-icon">🔍</span>
            <span class="btn-text">压缩</span>
            <span class="btn-desc">最小化体积</span>
          </button>
          <button 
            class="mode-btn" 
            :class="{ active: activeTab === 'validate' }"
            @click="activeTab = 'validate'"
          >
            <span class="btn-icon">✅</span>
            <span class="btn-text">验证</span>
            <span class="btn-desc">检查语法</span>
          </button>
        </div>
      </div>

      <div class="divider"></div>

      <div class="action-selection">
        <h4>执行操作</h4>
        <div class="action-buttons">
          <button class="action-btn primary" @click="formatJson" :disabled="!inputJson">
            <span class="btn-icon">🪄</span>
            <span class="btn-text">执行 {{ getActiveModeName() }}</span>
          </button>
          <button class="action-btn" @click="clearAll" :disabled="!inputJson">
            <span class="btn-icon">🗑️</span>
            <span class="btn-text">清空</span>
          </button>
          <button class="action-btn" @click="copyResult" :disabled="!outputJson">
            <span class="btn-icon">📋</span>
            <span class="btn-text">复制</span>
          </button>
        </div>
      </div>
    </div>

    <div class="editor-container">
      <div class="editor-section input-section">
        <h3>输入 JSON</h3>
        <div class="editor-wrapper">
          <textarea
            v-model="inputJson"
            placeholder='请输入 JSON 数据，例如：{"name":"张三","age":25,"hobbies":["读书","运动"]}'
            class="json-editor"
            :class="{ error: hasError }"
            @input="clearError"
          ></textarea>
          <div v-if="!inputJson" class="editor-placeholder">
            <div class="placeholder-icon">📝</div>
            <p>在此输入或粘贴 JSON 数据</p>
          </div>
        </div>
      </div>

      <div class="editor-section output-section">
        <h3>输出结果</h3>
        <div class="editor-wrapper">
          <pre v-if="outputJson && !hasError" class="json-output"><code v-html="highlightedJson"></code></pre>
          <div v-else-if="hasError" class="error-message">
            <div class="error-icon">❌</div>
            <div class="error-content">
              <h4>JSON 格式错误</h4>
              <p>{{ errorMessage }}</p>
            </div>
          </div>
          <div v-else class="output-placeholder">
            <div class="placeholder-icon">⚡</div>
            <p>点击"执行"按钮查看结果</p>
          </div>
        </div>
      </div>
    </div>

    <div class="tool-features">
      <h3>💡 使用说明</h3>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📋</div>
          <h4>格式化</h4>
          <p>将压缩的 JSON 数据格式化为易读的样式，包含缩进和语法高亮</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🔍</div>
          <h4>压缩</h4>
          <p>移除所有不必要的空格和换行，将 JSON 压缩为最小体积</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">✅</div>
          <h4>验证</h4>
          <p>检查 JSON 语法是否正确，并显示详细的错误信息</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h4>语法高亮</h4>
          <p>支持彩色语法高亮，让 JSON 结构更加清晰易读</p>
        </div>
      </div>
    </div>

    <div class="notification" :class="{ show: showNotify }">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('format')
const inputJson = ref('')
const outputJson = ref('')
const hasError = ref(false)
const errorMessage = ref('')
const showNotify = ref(false)
const notificationMessage = ref('')

// 格式化 JSON
const formatJson = () => {
  if (!inputJson.value.trim()) {
    showError('请输入 JSON 数据')
    return
  }

  try {
    const parsedJson = JSON.parse(inputJson.value)
    
    switch (activeTab.value) {
      case 'format':
        outputJson.value = JSON.stringify(parsedJson, null, 2)
        break
      case 'minify':
        outputJson.value = JSON.stringify(parsedJson)
        break
      case 'validate':
        outputJson.value = JSON.stringify(parsedJson, null, 2)
        showNotification('✅ JSON 格式正确！')
        break
    }
    
    hasError.value = false
  } catch (error) {
    showError(`解析错误: ${error.message}`)
    outputJson.value = ''
  }
}

// 语法高亮
const highlightedJson = computed(() => {
  if (!outputJson.value) return ''
  
  return outputJson.value
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, match => {
      let cls = 'number'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key'
        } else {
          cls = 'string'
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean'
      } else if (/null/.test(match)) {
        cls = 'null'
      }
      return `<span class="${cls}">${match}</span>`
    })
})

// 显示错误
const showError = (message) => {
  hasError.value = true
  errorMessage.value = message
  outputJson.value = ''
}

// 清除错误
const clearError = () => {
  if (hasError.value) {
    hasError.value = false
    errorMessage.value = ''
  }
}

// 清空所有
const clearAll = () => {
  inputJson.value = ''
  outputJson.value = ''
  hasError.value = false
  errorMessage.value = ''
}

// 复制结果
const copyResult = async () => {
  try {
    await navigator.clipboard.writeText(outputJson.value)
    showNotification('✅ 已复制到剪贴板！')
  } catch (error) {
    showNotification('❌ 复制失败，请手动复制')
  }
}

// 显示通知
const showNotification = (message) => {
  notificationMessage.value = message
  showNotify.value = true
  setTimeout(() => {
    showNotify.value = false
  }, 2000)
}

// 获取当前激活模式的名称
const getActiveModeName = () => {
  const modes = {
    format: '格式化',
    minify: '压缩',
    validate: '验证'
  }
  return modes[activeTab.value]
}
</script>

<style scoped>
.json-formatter {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.tool-header {
  text-align: center;
  margin-bottom: 20px;
}

.tool-header h2 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 1.8em;
}

.tool-header p {
  color: #7f8c8d;
  font-size: 1em;
  margin: 0;
}

/* 优化操作按钮区域样式 */
.tool-controls {
  display: grid;
  grid-template-columns: 2fr auto 1fr;
  align-items: start;
  gap: 0;
  padding: 16px 16px 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.mode-selection h4,
.action-selection h4 {
  margin: 0 0 8px 0;
  font-size: 0.9em;
  font-weight: 600;
  color: rgba(255, 255, 255, 16px0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.divider {
  width: 1px;
  height: 144px;
  background: linear-gradient(to bottom, 
    transparent, 
    rgba(255, 255, 255, 0.3), 
    transparent);
  margin: 39px 20px 0; 
  align-self: center;
}

/* 模式选择按钮样式 */
.mode-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mode-btn {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
  backdrop-filter: blur(10px);
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.3);
}

.mode-btn.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.btn-icon {
  font-size: 1.2em;
  margin-right: 12px;
  flex-shrink: 0;
}

.btn-text {
  font-weight: 600;
  font-size: 1em;
  margin-right: 8px;
}

.btn-desc {
  font-size: 0.85em;
  opacity: 0.8;
  margin-left: auto;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.action-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.3);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.action-btn.primary {
  background: linear-gradient(135deg, #00b894, #00a885);
  border-color: rgba(255, 255, 255, 0.3);
}

.action-btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #00a885, #009975);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 184, 148, 0.3);
}

/* 编辑器容器布局 */
.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
  min-height: 400px;
}

/* 确保两列宽度固定 */
.input-section {
  min-width: 0;
}

.output-section {
  min-width: 0;
}

.editor-section h3 {
  color: #2c3e50;
  margin-top: 24px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.editor-wrapper {
  position: relative;
  height: 360px;
  border: 2px solid #ddd;
  border-radius: 12px;
  background: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.json-editor {
  width: 100%;
  height: 100%;
  padding: 20px;
  border: none;
  resize: none;
  font-family: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: transparent;
  z-index: 2;
  position: relative;
  flex: 1;
  min-height: 0;
}

.json-editor:focus {
  outline: none;
  border-color: #667eea;
}

.json-editor.error {
  border-color: #e74c3c;
}

.json-output {
  padding: 20px;
  height: 100%;
  overflow: auto;
  font-family: 'Fira Code', 'Monaco', 'Cascadia Code', monospace;
  font-size: 14px;
  line-height: 1.6;
  background: #f8f9fa;
  flex: 1;
  min-height: 0;
}

/* 确保输出区域可以水平滚动 */
.json-output {
  overflow-x: auto;
  white-space: pre;
}

.editor-placeholder,
.output-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #b2bec3;
  pointer-events: none;
}

.placeholder-icon {
  font-size: 3em;
  margin-bottom: 15px;
  opacity: 0.5;
}

.error-message {
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  background: #ffeaa7;
  border-radius: 10px;
  margin: 20px;
}

.error-icon {
  font-size: 2em;
  flex-shrink: 0;
}

.error-content h4 {
  color: #d63031;
  margin: 0 0 8px 0;
}

.error-content p {
  color: #636e72;
  margin: 0;
}

.tool-features {
  margin-bottom: 30px;
}

.tool-features h3 {
  color: #2c3e50;
  margin-bottom: 25px;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.feature-card {
  padding: 25px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 2.5em;
  margin-bottom: 15px;
}

.feature-card h4 {
  color: #2c3e50;
  margin: 0 0 12px 0;
  font-size: 1.2em;
}

.feature-card p {
  color: #7f8c8d;
  margin: 0;
  line-height: 1.6;
}

.notification {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  padding: 15px 30px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 10px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 1000;
}

.notification.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

/* 语法高亮样式 */
.json-output :deep(.string) { color: #00b894; }
.json-output :deep(.number) { color: #0984e3; }
.json-output :deep(.boolean) { color: #d63031; }
.json-output :deep(.null) { color: #b2bec3; }
.json-output :deep(.key) { color: #6c5ce7; }

/* 响应式设计 */
@media (max-width: 968px) {
  .tool-controls {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .divider {
    width: 100%;
    height: 1px;
    margin: 10px 0;
    background: linear-gradient(to right, 
      transparent, 
      rgba(255, 255, 255, 0.3), 
      transparent);
  }
  
  .mode-buttons {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .mode-btn {
    flex: 1;
    min-width: 120px;
    flex-direction: column;
    text-align: center;
    padding: 15px 10px;
  }
  
  .btn-icon {
    margin-right: 0;
    margin-bottom: 8px;
    font-size: 1.5em;
  }
  
  .btn-desc {
    display: none;
  }
  
  .action-buttons {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .action-btn {
    flex: 1;
    min-width: 100px;
    justify-content: center;
    padding: 12px 15px;
  }
  
  .btn-text {
    margin-right: 0;
  }
  
  .editor-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .editor-wrapper {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .json-formatter {
    padding: 15px;
  }
  
  .tool-header h2 {
    font-size: 1.5em;
  }
  
  .tool-controls {
    padding: 20px 15px;
  }
  
  .mode-btn {
    min-width: 100px;
    padding: 12px 8px;
  }
  
  .action-btn {
    min-width: 80px;
    padding: 10px 12px;
  }
  
  .btn-text {
    font-size: 0.9em;
  }
  
  .mode-selection h4,
  .action-selection h4 {
    text-align: center;
    margin-bottom: 10px;
  }
  
  .editor-wrapper {
    height: 250px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .feature-card {
    padding: 20px;
  }
  
  .control-btn {
    padding: 8px 16px;
    font-size: 0.9em;
  }
  
  .action-btn {
    padding: 8px 16px;
    font-size: 0.9em;
  }
}

/* 修复网格布局的列宽问题 */
@media (min-width: 969px) {
  .editor-container {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}
</style>