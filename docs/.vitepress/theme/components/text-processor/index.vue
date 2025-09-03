<template>
  <div class="text-processor">
    <div class="tool-header">
      <h2>🔤 文本处理工具集</h2>
      <p>提供多种文本处理功能，包括大小写转换、编码解码、格式化等</p>
    </div>

    <div class="tool-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        :class="['tab-btn', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        {{ tab.icon }} {{ tab.name }}
      </button>
    </div>

    <div class="tool-content">
      <!-- 大小写转换 -->
      <div v-if="activeTab === 'case'" class="tab-panel">
        <div class="input-section">
          <h3>输入文本</h3>
          <textarea
            v-model="caseInput"
            placeholder="在此输入要转换的文本..."
            class="text-input"
            rows="6"
          ></textarea>
        </div>

        <div class="options-section">
          <h3>转换选项</h3>
          <div class="option-group">
            <button
              v-for="option in caseOptions"
              :key="option.id"
              :class="['option-btn', { active: caseOption === option.id }]"
              @click="caseOption = option.id"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="output-section">
          <h3>转换结果</h3>
          <div class="output-content">
            <pre>{{ caseOutput }}</pre>
            <div class="output-actions">
              <button class="action-btn" @click="copyText(caseOutput)" :disabled="!caseOutput">
                📋 复制
              </button>
              <button class="action-btn" @click="clearText('case')">
                🗑️ 清空
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 命名格式转换 -->
      <div v-if="activeTab === 'naming'" class="tab-panel">
        <div class="input-section">
          <h3>输入文本</h3>
          <textarea
            v-model="namingInput"
            placeholder="在此输入要转换的文本（多个单词用空格分隔）..."
            class="text-input"
            rows="6"
          ></textarea>
        </div>

        <div class="options-section">
          <h3>命名格式</h3>
          <div class="option-group">
            <button
              v-for="option in namingOptions"
              :key="option.id"
              :class="['option-btn', { active: namingOption === option.id }]"
              @click="namingOption = option.id"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="output-section">
          <h3>转换结果</h3>
          <div class="output-content">
            <pre>{{ namingOutput }}</pre>
            <div class="output-actions">
              <button class="action-btn" @click="copyText(namingOutput)" :disabled="!namingOutput">
                📋 复制
              </button>
              <button class="action-btn" @click="clearText('naming')">
                🗑️ 清空
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 编码解码 -->
      <div v-if="activeTab === 'encoding'" class="tab-panel">
        <div class="input-section">
          <h3>输入文本</h3>
          <textarea
            v-model="encodingInput"
            placeholder="在此输入要编码或解码的文本..."
            class="text-input"
            rows="6"
          ></textarea>
        </div>

        <div class="options-section">
          <h3>编码类型</h3>
          <div class="option-group">
            <button
              v-for="option in encodingOptions"
              :key="option.id"
              :class="['option-btn', { active: encodingOption === option.id }]"
              @click="encodingOption = option.id"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="output-section">
          <h3>转换结果</h3>
          <div class="output-content">
            <pre>{{ encodingOutput }}</pre>
            <div class="output-actions">
              <button class="action-btn" @click="copyText(encodingOutput)" :disabled="!encodingOutput">
                📋 复制
              </button>
              <button class="action-btn" @click="clearText('encoding')">
                🗑️ 清空
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 文本分析 -->
      <div v-if="activeTab === 'analysis'" class="tab-panel">
        <div class="input-section">
          <h3>输入文本</h3>
          <textarea
            v-model="analysisInput"
            placeholder="在此输入要分析的文本..."
            class="text-input"
            rows="6"
            @input="analyzeText"
          ></textarea>
        </div>

        <div class="stats-section">
          <h3>文本统计</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ stats.characters }}</div>
              <div class="stat-label">字符数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.charactersNoSpaces }}</div>
              <div class="stat-label">字符数(无空格)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.words }}</div>
              <div class="stat-label">单词数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.lines }}</div>
              <div class="stat-label">行数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.sentences }}</div>
              <div class="stat-label">句子数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ stats.readingTime }}分钟</div>
              <div class="stat-label">阅读时间</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文本格式化 -->
      <div v-if="activeTab === 'formatting'" class="tab-panel">
        <div class="input-section">
          <h3>输入文本</h3>
          <textarea
            v-model="formattingInput"
            placeholder="在此输入要格式化的文本..."
            class="text-input"
            rows="6"
          ></textarea>
        </div>

        <div class="options-section">
          <h3>格式化选项</h3>
          <div class="option-group">
            <button
              v-for="option in formattingOptions"
              :key="option.id"
              :class="['option-btn', { active: formattingOption === option.id }]"
              @click="formattingOption = option.id"
            >
              {{ option.label }}
            </button>
          </div>
        </div>

        <div class="output-section">
          <h3>格式化结果</h3>
          <div class="output-content">
            <pre>{{ formattingOutput }}</pre>
            <div class="output-actions">
              <button class="action-btn" @click="copyText(formattingOutput)" :disabled="!formattingOutput">
                📋 复制
              </button>
              <button class="action-btn" @click="clearText('formatting')">
                🗑️ 清空
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通知 -->
    <div class="notification" :class="{ show: showNotificationMessage }">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'TextProcessor',
  setup() {
    // 标签页数据
    const tabs = [
      { id: 'case', name: '大小写转换', icon: '🔠' },
      { id: 'naming', name: '命名格式', icon: '🐫' },
      { id: 'encoding', name: '编码解码', icon: '🔀' },
      { id: 'analysis', name: '文本分析', icon: '📊' },
      { id: 'formatting', name: '文本格式化', icon: '✂️' }
    ]

    const activeTab = ref('case')

    // 大小写转换数据
    const caseInput = ref('')
    const caseOption = ref('upper')
    const caseOptions = [
      { id: 'upper', label: '全部大写' },
      { id: 'lower', label: '全部小写' },
      { id: 'title', label: '首字母大写' },
      { id: 'sentence', label: '句子Case' },
      { id: 'toggle', label: '切换大小写' }
    ]

    // 命名格式数据
    const namingInput = ref('')
    const namingOption = ref('camel')
    const namingOptions = [
      { id: 'camel', label: '驼峰命名 (camelCase)' },
      { id: 'pascal', label: '帕斯卡命名 (PascalCase)' },
      { id: 'snake', label: '蛇形命名 (snake_case)' },
      { id: 'kebab', label: '烤肉串命名 (kebab-case)' },
      { id: 'constant', label: '常量命名 (CONSTANT_CASE)' }
    ]

    // 编码解码数据
    const encodingInput = ref('')
    const encodingOption = ref('base64encode')
    const encodingOptions = [
      { id: 'base64encode', label: 'Base64 编码' },
      { id: 'base64decode', label: 'Base64 解码' },
      { id: 'urlencode', label: 'URL 编码' },
      { id: 'urldecode', label: 'URL 解码' },
      { id: 'htmlencode', label: 'HTML 实体编码' },
      { id: 'htmldecode', label: 'HTML 实体解码' }
    ]

    // 文本分析数据
    const analysisInput = ref('')
    const stats = ref({
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      sentences: 0,
      readingTime: 0
    })

    // 文本格式化数据
    const formattingInput = ref('')
    const formattingOption = ref('trim')
    const formattingOptions = [
      { id: 'trim', label: '去除首尾空格' },
      { id: 'trimAll', label: '去除所有空格' },
      { id: 'removeEmptyLines', label: '去除空行' },
      { id: 'sortLines', label: '排序行' },
      { id: 'reverseLines', label: '反转行顺序' },
      { id: 'removeDuplicates', label: '去除重复行' }
    ]

    // 通知数据
    const showNotificationMessage = ref(false)
    const notificationMessage = ref('')

    // 计算属性
    const caseOutput = computed(() => {
      if (!caseInput.value) return ''
      
      switch (caseOption.value) {
        case 'upper':
          return caseInput.value.toUpperCase()
        case 'lower':
          return caseInput.value.toLowerCase()
        case 'title':
          return caseInput.value.replace(/\w\S*/g, txt => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          )
        case 'sentence':
          return caseInput.value.replace(/(^\s*|[.!?]\s+)(\w)/g, (match, p1, p2) => 
            p1 + p2.toUpperCase()
          )
        case 'toggle':
          return caseInput.value.split('').map(char => 
            char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
          ).join('')
        default:
          return caseInput.value
      }
    })

    const namingOutput = computed(() => {
      if (!namingInput.value) return ''
      
      // 将输入拆分为单词
      const words = namingInput.value.split(/\s+/).filter(word => word.length > 0)
      if (words.length === 0) return ''
      
      switch (namingOption.value) {
        case 'camel':
          return words.map((word, i) => 
            i === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join('')
        case 'pascal':
          return words.map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join('')
        case 'snake':
          return words.map(word => word.toLowerCase()).join('_')
        case 'kebab':
          return words.map(word => word.toLowerCase()).join('-')
        case 'constant':
          return words.map(word => word.toUpperCase()).join('_')
        default:
          return namingInput.value
      }
    })

    const encodingOutput = computed(() => {
      if (!encodingInput.value) return ''
      
      try {
        switch (encodingOption.value) {
          case 'base64encode':
            return btoa(unescape(encodeURIComponent(encodingInput.value)))
          case 'base64decode':
            return decodeURIComponent(escape(atob(encodingInput.value)))
          case 'urlencode':
            return encodeURIComponent(encodingInput.value)
          case 'urldecode':
            return decodeURIComponent(encodingInput.value)
          case 'htmlencode':
            return encodingInput.value
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;')
          case 'htmldecode':
            return encodingInput.value
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")
          default:
            return encodingInput.value
        }
      } catch (error) {
        return `错误: ${error.message}`
      }
    })

    const formattingOutput = computed(() => {
      if (!formattingInput.value) return ''
      
      const lines = formattingInput.value.split('\n')
      
      switch (formattingOption.value) {
        case 'trim':
          return lines.map(line => line.trim()).join('\n')
        case 'trimAll':
          return formattingInput.value.replace(/\s+/g, '')
        case 'removeEmptyLines':
          return lines.filter(line => line.trim().length > 0).join('\n')
        case 'sortLines':
          return lines.sort().join('\n')
        case 'reverseLines':
          return lines.reverse().join('\n')
        case 'removeDuplicates':
          return [...new Set(lines)].join('\n')
        default:
          return formattingInput.value
      }
    })

    // 方法
    const analyzeText = () => {
      const text = analysisInput.value
      
      // 字符数（包含空格）
      stats.value.characters = text.length
      
      // 字符数（不包含空格）
      stats.value.charactersNoSpaces = text.replace(/\s+/g, '').length
      
      // 单词数
      stats.value.words = text.trim() ? text.split(/\s+/).length : 0
      
      // 行数
      stats.value.lines = text ? text.split('\n').length : 0
      
      // 句子数（简单估算）
      stats.value.sentences = text.split(/[.!?]+/).filter(s => s.length > 0).length
      
      // 阅读时间估算（按每分钟200字计算）
      stats.value.readingTime = Math.ceil(stats.value.words / 200)
    }

    const copyText = async (text) => {
      try {
        await navigator.clipboard.writeText(text)
        showNotification('已复制到剪贴板')
      } catch (error) {
        showNotification('复制失败，请手动复制')
      }
    }

    const clearText = (type) => {
      switch (type) {
        case 'case':
          caseInput.value = ''
          break
        case 'naming':
          namingInput.value = ''
          break
        case 'encoding':
          encodingInput.value = ''
          break
        case 'analysis':
          analysisInput.value = ''
          stats.value = {
            characters: 0,
            charactersNoSpaces: 0,
            words: 0,
            lines: 0,
            sentences: 0,
            readingTime: 0
          }
          break
        case 'formatting':
          formattingInput.value = ''
          break
      }
    }

    const showNotification = (message) => {
      notificationMessage.value = message
      showNotificationMessage.value = true
      setTimeout(() => {
        showNotificationMessage.value = false
      }, 2000)
    }

    return {
      tabs,
      activeTab,
      caseInput,
      caseOption,
      caseOptions,
      caseOutput,
      namingInput,
      namingOption,
      namingOptions,
      namingOutput,
      encodingInput,
      encodingOption,
      encodingOptions,
      encodingOutput,
      analysisInput,
      stats,
      formattingInput,
      formattingOption,
      formattingOptions,
      formattingOutput,
      showNotification,
      notificationMessage,
      analyzeText,
      copyText,
      clearText
    }
  }
}
</script>

<style scoped>
.text-processor {
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

.tool-tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 10px;
}

.tab-btn {
  padding: 12px 20px;
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

.tab-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.tab-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.tool-content {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.tab-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.input-section, .options-section, .output-section, .stats-section {
  margin-bottom: 25px;
}

.input-section h3, .options-section h3, .output-section h3, .stats-section h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 1.2em;
}

.text-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 0.95em;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.3s;
}

.text-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.option-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.option-btn {
  padding: 10px 15px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  text-align: center;
}

.option-btn:hover {
  background: #e9ecef;
}

.option-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.output-content {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  min-height: 150px;
  position: relative;
}

.output-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: 'Fira Code', monospace;
}

.output-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.action-btn {
  padding: 8px 15px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-btn:hover:not(:disabled) {
  background: #2980b9;
}

.action-btn:disabled {
  background: #b2bec3;
  cursor: not-allowed;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.stat-value {
  font-size: 1.8em;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 5px;
}

.stat-label {
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
  .tab-panel {
    grid-template-columns: 1fr;
  }
  
  .tool-tabs {
    flex-direction: column;
  }
  
  .option-group {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .text-processor {
    padding: 15px;
  }
  
  .tool-header h2 {
    font-size: 1.5em;
  }
  
  .tab-btn {
    padding: 10px 15px;
    font-size: 0.9em;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>