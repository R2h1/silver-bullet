<template>
  <div class="base64-converter">
    <div class="tool-header">
      <h2><i class="fas fa-exchange-alt"></i> Base64 编码/解码工具</h2>
      <p>快速将文本与Base64格式相互转换，支持编码和解码功能</p>
    </div>

    <div class="tool-body">
      <div class="mode-selector">
        <button 
          :class="{ active: mode === 'encode' }" 
          @click="mode = 'encode'"
        >
          <i class="fas fa-lock"></i> 编码
        </button>
        <button 
          :class="{ active: mode === 'decode' }" 
          @click="mode = 'decode'"
        >
          <i class="fas fa-lock-open"></i> 解码
        </button>
        <button 
          :class="{ active: mode === 'file' }" 
          @click="mode = 'file'"
        >
          <i class="fas fa-file"></i> 文件转换
        </button>
      </div>

      <div class="input-section" v-if="mode !== 'file'">
        <div class="input-group">
          <label>{{ mode === 'encode' ? '原始文本' : 'Base64编码文本' }}</label>
          <textarea 
            v-model="inputText" 
            @input="convertText" 
            :placeholder="mode === 'encode' ? '请输入要编码的文本' : '请输入要解码的Base64文本'"
            rows="5"
          ></textarea>
        </div>

        <div class="action-buttons">
          <button @click="copyToClipboard(inputText)" :disabled="!inputText">
            <i class="fas fa-copy"></i> 复制输入
          </button>
          <button @click="clearInput">
            <i class="fas fa-trash"></i> 清空输入
          </button>
        </div>
      </div>

      <div class="file-section" v-if="mode === 'file'">
        <div class="file-upload">
          <label class="file-label">
            <input type="file" @change="handleFileUpload" ref="fileInput">
            <div class="file-drop-area" :class="{ 'has-file': uploadedFile }">
              <i class="fas fa-cloud-upload-alt"></i>
              <p v-if="!uploadedFile">拖放文件到此处或点击选择文件</p>
              <p v-else>已选择: {{ uploadedFile.name }}</p>
              <span class="file-size" v-if="uploadedFile">大小: {{ formatFileSize(uploadedFile.size) }}</span>
            </div>
          </label>
        </div>

        <div class="file-options">
          <button @click="encodeFile" :disabled="!uploadedFile" class="action-btn">
            <i class="fas fa-lock"></i> 编码文件
          </button>
          <button @click="decodeFile" :disabled="!fileBase64" class="action-btn">
            <i class="fas fa-lock-open"></i> 解码文件
          </button>
        </div>
      </div>

      <div class="conversion-section">
        <div class="conversion-arrow">
          <i class="fas fa-arrow-down" v-if="mode !== 'file'"></i>
          <i class="fas fa-exchange-alt" v-else></i>
        </div>

        <div class="output-section">
          <div class="output-group">
            <label>{{ mode === 'encode' ? 'Base64编码结果' : '解码结果' }}</label>
            <textarea 
              v-model="outputText" 
              readonly
              :placeholder="mode === 'encode' ? '编码结果将显示在这里' : '解码结果将显示在这里'"
              rows="5"
              ref="outputTextarea"
            ></textarea>
          </div>

          <div class="output-actions">
            <button @click="copyToClipboard(outputText)" :disabled="!outputText">
              <i class="fas fa-copy"></i> 复制结果
            </button>
            <button @click="downloadResult" :disabled="!outputText && !decodedFile" v-if="mode !== 'file' || decodedFile">
              <i class="fas fa-download"></i> 下载
            </button>
            <button @click="clearAll">
              <i class="fas fa-broom"></i> 清空全部
            </button>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>Base64 使用说明</h3>
        <div class="info-content">
          <p>Base64是一种基于64个可打印字符来表示二进制数据的编码方式。</p>
          
          <div class="usage-examples">
            <h4>常见用途：</h4>
            <ul>
              <li>在XML、JSON等文本协议中嵌入二进制数据</li>
              <li>电子邮件附件编码</li>
              <li>数据URI方案（如网页中的内联图片）</li>
              <li>基本认证的凭证编码</li>
            </ul>
          </div>

          <div class="example-section">
            <h4>示例：</h4>
            <div class="example">
              <p><strong>文本:</strong> Hello World!</p>
              <p><strong>Base64编码:</strong> SGVsbG8gV29ybGQh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Base64Converter',
  data() {
    return {
      mode: 'encode', // encode, decode, file
      inputText: '',
      outputText: '',
      uploadedFile: null,
      fileBase64: '',
      decodedFile: null,
      fileName: ''
    }
  },
  methods: {
    convertText() {
      if (!this.inputText.trim()) {
        this.outputText = '';
        return;
      }

      try {
        if (this.mode === 'encode') {
          // 编码文本为Base64
          this.outputText = btoa(unescape(encodeURIComponent(this.inputText)));
        } else {
          // 解码Base64为文本
          this.outputText = decodeURIComponent(escape(atob(this.inputText)));
        }
      } catch (error) {
        this.outputText = '错误: ' + error.message;
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.uploadedFile = file;
      this.fileBase64 = '';
      this.decodedFile = null;
      this.fileName = file.name;
    },
    encodeFile() {
      if (!this.uploadedFile) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        // 将文件内容转换为Base64
        const base64 = e.target.result;
        // 移除data URL前缀（如"data:image/png;base64,"）
        const base64Content = base64.split(',')[1];
        this.fileBase64 = base64Content;
        this.outputText = base64Content;
      };
      reader.readAsDataURL(this.uploadedFile);
    },
    decodeFile() {
      if (!this.fileBase64) return;

      try {
        // 从Base64解码为二进制数据
        const binaryString = atob(this.fileBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        // 尝试确定文件类型
        let fileType = 'application/octet-stream';
        // 简单检测常见文件类型
        if (this.fileName.endsWith('.png')) fileType = 'image/png';
        else if (this.fileName.endsWith('.jpg') || this.fileName.endsWith('.jpeg')) fileType = 'image/jpeg';
        else if (this.fileName.endsWith('.gif')) fileType = 'image/gif';
        else if (this.fileName.endsWith('.pdf')) fileType = 'application/pdf';
        else if (this.fileName.endsWith('.txt')) fileType = 'text/plain';

        // 创建Blob对象
        const blob = new Blob([bytes], { type: fileType });
        this.decodedFile = blob;
        
        this.outputText = `文件已解码成功，类型: ${fileType}`;
      } catch (error) {
        this.outputText = '解码错误: ' + error.message;
      }
    },
    copyToClipboard(text) {
      if (!text) return;

      // 使用现代Clipboard API
      navigator.clipboard.writeText(text).then(() => {
        alert('已复制到剪贴板!');
      }).catch(err => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('已复制到剪贴板!');
      });
    },
    downloadResult() {
      if (this.mode === 'file' && this.decodedFile) {
        // 下载解码的文件
        const url = URL.createObjectURL(this.decodedFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.fileName || 'decoded_file';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else if (this.outputText) {
        // 下载文本结果
        const blob = new Blob([this.outputText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = this.mode === 'encode' ? 'base64_encoded.txt' : 'base64_decoded.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    },
    clearInput() {
      this.inputText = '';
      this.outputText = '';
    },
    clearAll() {
      this.inputText = '';
      this.outputText = '';
      this.uploadedFile = null;
      this.fileBase64 = '';
      this.decodedFile = null;
      this.fileName = '';
      
      // 重置文件输入
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  },
  watch: {
    mode() {
      this.clearAll();
    }
  }
}
</script>

<style scoped>
.base64-converter {
  max-width: 900px;
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
  justify-content: center;
  margin-bottom: 25px;
  gap: 10px;
}

.mode-selector button {
  padding: 10px 20px;
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

.input-section, .file-section {
  margin-bottom: 20px;
}

.input-group, .output-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input-group label, .output-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c3e50;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
  resize: vertical;
}

.action-buttons, .output-actions, .file-options {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.action-buttons button, .output-actions button, .file-options button {
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-buttons button:hover, .output-actions button:hover, .file-options button:hover {
  background: #e9ecef;
}

.action-buttons button:disabled, .output-actions button:disabled, .file-options button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.file-upload {
  margin-bottom: 15px;
}

.file-label {
  display: block;
  cursor: pointer;
}

.file-label input[type="file"] {
  display: none;
}

.file-drop-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.file-drop-area:hover {
  border-color: #3498db;
  background: #e9ecef;
}

.file-drop-area.has-file {
  border-color: #2ecc71;
  background: #eafaf1;
}

.file-drop-area i {
  font-size: 48px;
  color: #7f8c8d;
  margin-bottom: 10px;
}

.file-drop-area p {
  margin-bottom: 10px;
  color: #2c3e50;
}

.file-size {
  color: #7f8c8d;
  font-size: 14px;
}

.conversion-section {
  position: relative;
  margin-bottom: 30px;
}

.conversion-arrow {
  text-align: center;
  margin: 15px 0;
  color: #7f8c8d;
}

.conversion-arrow i {
  font-size: 24px;
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

.usage-examples, .example-section {
  margin-bottom: 15px;
}

.usage-examples h4, .example-section h4 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.usage-examples ul {
  padding-left: 20px;
}

.usage-examples li {
  margin-bottom: 5px;
  line-height: 1.5;
}

.example {
  background: white;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #3498db;
}

.example p {
  margin-bottom: 5px;
  font-family: monospace;
}

.action-btn {
  padding: 10px 15px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.action-btn:hover {
  background: #2980b9;
}

.action-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .mode-selector {
    flex-direction: column;
  }
  
  .action-buttons, .output-actions, .file-options {
    flex-direction: column;
  }
  
  .file-drop-area {
    padding: 20px;
  }
}
</style>