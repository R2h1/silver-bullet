<template>
  <div class="text-diff-tool">
    <div class="tool-header">
      <h2>文本差异比较工具</h2>
      <p>使用专业算法比较两个文本内容之间的差异，支持多种视图模式</p>
    </div>

    <div class="diff-container">
      <div class="input-section">
        <div class="text-input">
          <div class="input-header">
            <label for="original-text">原始文本</label>
            <span class="char-count">{{ originalText.length }} 字符</span>
          </div>
          <textarea
            id="original-text"
            v-model="originalText"
            placeholder="请输入或粘贴原始文本内容"
            rows="12"
            @input="autoCompare"></textarea>
        </div>
        <div class="text-input">
          <div class="input-header">
            <label for="modified-text">修改后文本</label>
            <span class="char-count">{{ modifiedText.length }} 字符</span>
          </div>
          <textarea
            id="modified-text"
            v-model="modifiedText"
            placeholder="请输入或粘贴修改后的文本内容"
            rows="12"
            @input="autoCompare"></textarea>
        </div>
      </div>

      <div class="controls">
        <div class="control-group">
          <button @click="compareTexts" class="compare-btn"><span class="icon">🔍</span> 比较文本</button>
          <button @click="clearTexts" class="clear-btn"><span class="icon">🗑️</span> 清空文本</button>
        </div>

        <div class="control-group">
          <label class="checkbox-label"> <input type="checkbox" v-model="autoCompareEnabled" /> 实时比较 </label>

          <div class="view-options">
            <label class="radio-label"> <input type="radio" v-model="viewMode" value="sideBySide" /> 并排视图 </label>
            <label class="radio-label"> <input type="radio" v-model="viewMode" value="inline" /> 行内视图 </label>
          </div>
        </div>
      </div>

      <div v-if="diffResult" class="result-section">
        <div class="result-header">
          <h3>比较结果</h3>
          <div class="diff-stats">
            <span class="stat added">添加: {{ diffStats.added }}</span>
            <span class="stat removed">删除: {{ diffStats.removed }}</span>
            <span class="stat unchanged">未更改: {{ diffStats.unchanged }}</span>
          </div>
        </div>

        <div class="diff-result" :class="viewMode">
          <div v-if="viewMode === 'sideBySide'" class="side-by-side">
            <div class="diff-side">
              <h4>原始文本</h4>
              <div class="diff-content" ref="leftContent">
                <span
                  v-for="(part, index) in diffResult.left"
                  :key="'left-' + index"
                  :class="part.type"
                  v-html="part.text"></span>
              </div>
            </div>
            <div class="diff-side">
              <h4>修改后文本</h4>
              <div class="diff-content" ref="rightContent">
                <span
                  v-for="(part, index) in diffResult.right"
                  :key="'right-' + index"
                  :class="part.type"
                  v-html="part.text"></span>
              </div>
            </div>
          </div>

          <div v-else class="inline-view">
            <div class="diff-content">
              <span
                v-for="(part, index) in diffResult.inline"
                :key="'inline-' + index"
                :class="part.type"
                v-html="part.text"></span>
            </div>
          </div>
        </div>

        <div class="result-actions">
          <button @click="swapTexts" class="action-btn"><span class="icon">🔄</span> 交换文本</button>
          <button @click="copyResult" class="action-btn"><span class="icon">📋</span> 复制结果</button>
        </div>
      </div>

      <div v-else-if="hasText" class="no-result">
        <p>点击"比较文本"按钮查看差异</p>
      </div>
    </div>
  </div>
</template>

<script>
import DiffMatchPatch from 'diff-match-patch';

export default {
  name: 'TextDiffTool',
  data() {
    return {
      originalText: '',
      modifiedText: '',
      viewMode: 'sideBySide',
      autoCompareEnabled: false,
      diffResult: null,
      diffStats: {
        added: 0,
        removed: 0,
        unchanged: 0
      },
      dmp: new DiffMatchPatch()
    };
  },
  computed: {
    hasText() {
      return this.originalText.length > 0 || this.modifiedText.length > 0;
    }
  },
  methods: {
    compareTexts() {
      if (!this.originalText && !this.modifiedText) {
        return;
      }

      const diff = this.dmp.diff_main(this.originalText, this.modifiedText);
      this.dmp.diff_cleanupSemantic(diff);

      this.diffResult = this.processDiffResult(diff);
      this.calculateStats(diff);
    },

    processDiffResult(diff) {
      // 处理并排视图
      const left = [];
      const right = [];

      // 处理行内视图
      const inline = [];

      // 将连续的相同类型的差异合并
      const mergedDiff = this.mergeConsecutiveDiffs(diff);

      mergedDiff.forEach((part) => {
        const [type, text] = part;
        const escapedText = this.escapeHtml(text);

        if (type === 0) {
          // 未更改
          left.push({ text: escapedText, type: 'unchanged' });
          right.push({ text: escapedText, type: 'unchanged' });
          inline.push({ text: escapedText, type: 'unchanged' });
        } else if (type === -1) {
          // 删除
          left.push({ text: escapedText, type: 'removed' });
          right.push({ text: ' ', type: 'empty' });
          inline.push({ text: escapedText, type: 'removed' });
        } else if (type === 1) {
          // 添加
          left.push({ text: ' ', type: 'empty' });
          right.push({ text: escapedText, type: 'added' });
          inline.push({ text: escapedText, type: 'added' });
        }
      });

      return { left, right, inline };
    },

    calculateStats(diff) {
      this.diffStats = {
        added: 0,
        removed: 0,
        unchanged: 0
      };

      diff.forEach((part) => {
        const [type, text] = part;
        if (type === 0) {
          this.diffStats.unchanged += text.length;
        } else if (type === -1) {
          this.diffStats.removed += text.length;
        } else if (type === 1) {
          this.diffStats.added += text.length;
        }
      });
    },

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    autoCompare() {
      if (this.autoCompareEnabled && this.hasText) {
        this.compareTexts();
      }
    },

    clearTexts() {
      this.originalText = '';
      this.modifiedText = '';
      this.diffResult = null;
    },

    swapTexts() {
      [this.originalText, this.modifiedText] = [this.modifiedText, this.originalText];
      if (this.hasText) {
        this.compareTexts();
      }
    },

    copyResult() {
      let text = '';

      if (this.viewMode === 'sideBySide') {
        text = '原始文本:\n' + this.originalText + '\n\n修改后文本:\n' + this.modifiedText;
      } else {
        text = this.modifiedText;
      }

      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert('已复制到剪贴板');
        })
        .catch((err) => {
          console.error('复制失败:', err);
          alert('复制失败，请手动复制');
        });
    },
    // 新增方法：合并连续的同类型差异
    mergeConsecutiveDiffs(diff) {
      if (!diff.length) return [];

      const result = [];
      let current = diff[0];

      for (let i = 1; i < diff.length; i++) {
        if (diff[i][0] === current[0]) {
          // 相同类型，合并文本
          current[1] += diff[i][1];
        } else {
          // 不同类型，推送当前并开始新的
          result.push(current);
          current = diff[i];
        }
      }

      result.push(current);
      return result;
    }
  },
  watch: {
    viewMode() {
      if (this.diffResult) {
        // 重新计算统计信息
        this.compareTexts();
      }
    }
  }
};
</script>

<style scoped>
.text-diff-tool {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

.input-section {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.text-input {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.input-header label {
  font-weight: bold;
  color: #2c3e50;
}

.char-count {
  font-size: 0.85em;
  color: #95a5a6;
}

.text-input textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color 0.3s;
}

.text-input textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.compare-btn,
.clear-btn,
.action-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.compare-btn {
  background-color: #3498db;
  color: white;
}

.compare-btn:hover {
  background-color: #2980b9;
}

.clear-btn {
  background-color: #e74c3c;
  color: white;
}

.clear-btn:hover {
  background-color: #c0392b;
}

.action-btn {
  background-color: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #ddd;
}

.action-btn:hover {
  background-color: #e9ecef;
}

.checkbox-label,
.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 0.95em;
}

.view-options {
  display: flex;
  gap: 12px;
}

.result-section {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.result-header h3 {
  color: #2c3e50;
  margin: 0;
}

.diff-stats {
  display: flex;
  gap: 15px;
  font-size: 0.9em;
}

.stat {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.stat.added {
  background-color: rgba(46, 204, 113, 0.1);
  color: #27ae60;
}

.stat.removed {
  background-color: rgba(231, 76, 60, 0.1);
  color: #c0392b;
}

.stat.unchanged {
  background-color: rgba(149, 165, 166, 0.1);
  color: #7f8c8d;
}

.diff-result {
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 15px;
}

.side-by-side {
  display: flex;
  min-height: 300px;
}

.diff-side {
  flex: 1;
  border-right: 1px solid #e1e4e8;
  display: flex;
  flex-direction: column;
}

.diff-side:last-child {
  border-right: none;
}

.diff-side h4 {
  margin: 0;
  padding: 12px;
  background-color: #f6f8fa;
  border-bottom: 1px solid #e1e4e8;
  color: #2c3e50;
  font-size: 1em;
}

.diff-content {
  padding: 12px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow: auto;
  flex: 1;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.diff-content span {
  /* 确保span元素不会引起额外换行 */
  display: inline;
  white-space: pre-wrap;
}

.added {
  background-color: #e6ffed;
  color: #22863a;
  padding: 2px 0;
}

.removed {
  background-color: #ffebe9;
  color: #cb2431;
  text-decoration: line-through;
  padding: 2px 0;
}

.unchanged {
  background-color: transparent;
  color: inherit;
}

.empty {
  background-color: #fafbfc;
  min-height: 1em;
}

.inline-view .added {
  background-color: #e6ffed;
  color: #22863a;
  padding: 2px 0;
}

.inline-view .removed {
  background-color: #ffebe9;
  color: #cb2431;
  text-decoration: line-through;
  padding: 2px 0;
}

.result-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.no-result {
  text-align: center;
  padding: 40px;
  color: #95a5a6;
  font-style: italic;
}

.icon {
  font-size: 1.1em;
}

@media (max-width: 768px) {
  .input-section {
    flex-direction: column;
  }

  .controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .control-group {
    width: 100%;
    justify-content: space-between;
  }

  .side-by-side {
    flex-direction: column;
  }

  .diff-side {
    border-right: none;
    border-bottom: 1px solid #e1e4e8;
  }

  .diff-side:last-child {
    border-bottom: none;
  }

  .result-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .diff-stats {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
