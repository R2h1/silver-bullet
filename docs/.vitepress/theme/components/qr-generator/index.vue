<template>
  <div class="qr-generator">
    <div class="tool-header">
      <h2><i class="fas fa-qrcode"></i> 二维码生成器</h2>
      <p>将文本或URL转换为二维码图片，支持自定义颜色和尺寸</p>
    </div>

    <div class="tool-body">
      <div class="input-section">
        <div class="input-group">
          <label>输入文本或URL</label>
          <textarea 
            v-model="inputText" 
            @input="generateQRCode" 
            placeholder="请输入要转换为二维码的文本或URL"
            rows="3"
          ></textarea>
        </div>

        <div class="options-section">
          <div class="option-group">
            <label>尺寸</label>
            <input type="range" v-model="size" min="100" max="500" step="50" @input="generateQRCode">
            <span>{{ size }}px</span>
          </div>

          <div class="option-group">
            <label>前景色</label>
            <input type="color" v-model="foregroundColor" @input="generateQRCode">
            <input type="text" v-model="foregroundColor" @input="generateQRCode" class="color-input">
          </div>

          <div class="option-group">
            <label>背景色</label>
            <input type="color" v-model="backgroundColor" @input="generateQRCode">
            <input type="text" v-model="backgroundColor" @input="generateQRCode" class="color-input">
          </div>

          <div class="option-group">
            <label>纠错级别</label>
            <select v-model="errorCorrectionLevel" @change="generateQRCode">
              <option value="L">L (低 - 7%)</option>
              <option value="M">M (中 - 15%)</option>
              <option value="Q">Q (四分 - 25%)</option>
              <option value="H">H (高 - 30%)</option>
            </select>
          </div>

          <div class="option-group">
            <label>边距</label>
            <input type="range" v-model="margin" min="0" max="20" @input="generateQRCode">
            <span>{{ margin }}px</span>
          </div>
        </div>
      </div>

      <div class="preview-section">
        <div class="qr-preview" v-if="qrCodeDataUrl">
          <img :src="qrCodeDataUrl" :alt="inputText" class="qr-image">
          <div class="preview-actions">
            <button @click="downloadQRCode" class="download-btn">
              <i class="fas fa-download"></i> 下载二维码
            </button>
            <button @click="copyToClipboard" class="copy-btn" v-if="canCopy">
              <i class="fas fa-copy"></i> 复制图片
            </button>
          </div>
        </div>
        
        <div class="placeholder" v-else>
          <i class="fas fa-qrcode"></i>
          <p>输入文本或URL以生成二维码</p>
        </div>
      </div>

      <div class="examples-section">
        <h3>示例应用</h3>
        <div class="example-buttons">
          <button 
            v-for="(example, index) in examples" 
            :key="index" 
            @click="applyExample(example)"
            class="example-btn"
          >
            {{ example.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode';

export default {
  name: 'QRGenerator',
  data() {
    return {
      inputText: '',
      qrCodeDataUrl: null,
      size: 200,
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      errorCorrectionLevel: 'M',
      margin: 4,
      canCopy: false,
      examples: [
        { name: '个人网站', text: 'https://example.com' },
        { name: 'WiFi连接', text: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;' },
        { name: '联系方式', text: 'BEGIN:VCARD\nVERSION:3.0\nN:张;小明\nTEL:+8613800138000\nEMAIL:example@email.com\nEND:VCARD' },
        { name: '比特币地址', text: 'bitcoin:1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' },
        { name: '地理位置', text: 'geo:39.9042,116.4074' },
        { name: '电子邮件', text: 'mailto:example@email.com' },
        { name: '电话号码', text: 'tel:+8613800138000' },
        { name: '纯文本消息', text: '这是一条测试消息' }
      ]
    }
  },
  mounted() {
    // 检查浏览器是否支持复制图片到剪贴板
    this.canCopy = !!navigator.clipboard && typeof ClipboardItem !== 'undefined';
  },
  methods: {
    async generateQRCode() {
      if (!this.inputText.trim()) {
        this.qrCodeDataUrl = null;
        return;
      }

      try {
        this.qrCodeDataUrl = await QRCode.toDataURL(this.inputText, {
          width: this.size,
          height: this.size,
          margin: this.margin,
          color: {
            dark: this.foregroundColor,
            light: this.backgroundColor
          },
          errorCorrectionLevel: this.errorCorrectionLevel
        });
      } catch (error) {
        console.error('生成二维码失败:', error);
      }
    },
    downloadQRCode() {
      if (!this.qrCodeDataUrl) return;

      const link = document.createElement('a');
      link.href = this.qrCodeDataUrl;
      link.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    async copyToClipboard() {
      if (!this.qrCodeDataUrl || !this.canCopy) return;

      try {
        // 将DataURL转换为blob
        const response = await fetch(this.qrCodeDataUrl);
        const blob = await response.blob();
        
        // 复制到剪贴板
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        
        alert('二维码已复制到剪贴板！');
      } catch (error) {
        console.error('复制失败:', error);
        alert('复制失败，请尝试下载二维码。');
      }
    },
    applyExample(example) {
      this.inputText = example.text;
      this.generateQRCode();
    }
  }
}
</script>

<style scoped>
.qr-generator {
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

.tool-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
}

.options-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.option-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-group label {
  min-width: 80px;
  font-weight: 600;
  color: #2c3e50;
}

.option-group input[type="range"] {
  flex: 1;
}

.option-group input[type="color"] {
  width: 40px;
  height: 40px;
  padding: 2px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.color-input {
  width: 80px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
}

.option-group select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
}

.preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.qr-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.qr-image {
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 100%;
}

.preview-actions {
  display: flex;
  gap: 10px;
}

.download-btn, .copy-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
}

.download-btn {
  background: #3498db;
  color: white;
}

.download-btn:hover {
  background: #2980b9;
}

.copy-btn {
  background: #2ecc71;
  color: white;
}

.copy-btn:hover {
  background: #27ae60;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 200px;
  background: #f8f9fa;
  border: 2px dashed #ddd;
  border-radius: 8px;
  color: #7f8c8d;
}

.placeholder i {
  font-size: 48px;
  margin-bottom: 10px;
}

.examples-section {
  grid-column: 1 / -1;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.examples-section h3 {
  margin-bottom: 15px;
  color: #2c3e50;
}

.example-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.example-btn {
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.example-btn:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .tool-body {
    grid-template-columns: 1fr;
  }
  
  .option-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .option-group label {
    min-width: auto;
  }
  
  .preview-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .download-btn, .copy-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>