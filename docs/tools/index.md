# 每日小工具合集

欢迎来到每日小工具合集！这里收集了各种实用的前端工具，每天都会添加一个新的工具。

## 特色工具

<div class="tool-grid">
  <div class="tool-card">
    <div class="tool-icon">🔐</div>
    <h3>随机密码生成器</h3>
    <p>生成安全、随机的密码，支持自定义长度和字符类型。</p>
    <a class="tool-link" href="./password-generator">立即使用 →</a>
  </div>
  
  <div class="tool-card coming-soon">
    <div class="tool-icon">🎰</div>
    <h3>超级大乐透生成器</h3>
    <p>随机生成符合规则的大乐透号码，支持多种生成方式和历史记录。</p>
    <a class="tool-link" href="./superlotto">立即使用 →</a>
  </div>
  
  <div class="tool-card">
    <div class="tool-icon">🔄</div>
    <h3>JSON 格式化工具</h3>
    <p>格式化、压缩和验证 JSON 数据，支持语法高亮和错误检测。</p>
    <a class="tool-link" href="./json-formatter">立即使用 →</a>
  </div>
  
 <div class="tool-card">
    <div class="tool-icon">🎨</div>
    <h3>颜色选择与转换工具</h3>
    <p>选择、转换和分析颜色，支持多种格式和调色板生成。</p>
    <a class="tool-link" href="./color-converter">立即使用 →</a>
  </div>

  <div class="tool-card">
    <div class="tool-icon">⏰</div>
    <h3>时间戳转换工具</h3>
    <p>转换时间戳与日期时间，支持多种格式和时区，包含常用时间戳参考。</p>
    <a class="tool-link" href="./timestamp-converter">立即使用 →</a>
  </div>

  <div class="tool-card">
    <div class="tool-icon">🔤</div>
    <h3>文本处理工具集</h3>
    <p>提供多种文本处理功能，包括大小写转换、编码解码、格式化等。</p>
    <a class="tool-link" href="./text-processor">立即使用 →</a>
  </div>

  <div class="tool-card">
    <div class="tool-icon">📏</div>
    <h3>单位转换器</h3>
    <p>转换各种度量单位，包括长度、重量、温度、时间、速度等。</p>
    <a class="tool-link" href="./unit-converter">立即使用 →</a>
  </div>

  <div class="tool-card">
    <div class="tool-icon">.*</div>
    <h3>正则表达式测试工具</h3>
    <p>测试和验证正则表达式，提供实时匹配结果和详细解释。</p>
    <a class="tool-link" href="./regex-tester">立即使用 →</a>
  </div>

  <div class="tool-card">
    <div class="tool-icon">🔳</div>
    <h3>二维码生成器</h3>
    <p>将文本或URL转换为二维码图片，支持自定义颜色和尺寸。</p>
    <a class="tool-link" href="./qr-generator">立即使用 →</a>
  </div>

  <div class="tool-card">
    <div class="tool-icon">🔤</div>
    <h3>Base64 编码/解码工具</h3>
    <p>快速将文本与Base64格式相互转换，支持编码和解码功能。</p>
    <a class="tool-link" href="./base64-converter">立即使用 →</a>
  </div>

  <div class="tool-card">
    <div class="tool-icon">🎲</div>
    <h3>随机数生成器</h3>
    <p>生成各种类型的随机数，支持自定义范围和多种格式。</p>
    <a class="tool-link" href="./random-generator">立即使用 →</a>
  </div>

  <div class="tool-card">
    <div class="tool-icon">⚖️</div>
    <h3>BMI计算器</h3>
    <p>计算您的身体质量指数(BMI)，了解您的体重健康状况。</p>
    <a class="tool-link" href="./bmi-calculator">立即使用 →</a>
  </div>

  <div class="tool-card">
    <div class="tool-icon">💬</div>
    <h3>随机名言生成器</h3>
    <p>发现智慧的话语，激发灵感，丰富思想。</p>
    <a class="tool-link" href="./quote-generator">立即使用 →</a>
  </div>

  <div class="tool-card">
    <div class="tool-icon">📜</div>
    <h3>诗词生成器</h3>
    <p>探索中华诗词之美，生成古典与现代交融的诗句。</p>
    <a class="tool-link" href="./poem-generator">立即使用 →</a>
  </div>

  <div class="tool-card">
    <div class="tool-icon">🎁</div>
    <h3>抽奖/转盘工具</h3>
    <p>创建自定义抽奖活动，支持转盘和抽奖箱两种模式。</p>
    <a class="tool-link" href="./lottery-wheel">立即使用 →</a>
  </div>
</div>

## 最新动态

- **2023-11-01** - 随机密码生成器上线！🎉
- **2023-11-02** - 即将推出 JSON 格式化工具
- **2023-11-03** - 即将推出颜色选择器工具

## 如何贡献

如果您有工具创意或想贡献代码，欢迎：

1. 提交 Issue 提出新工具建议
2. Fork 项目并提交 Pull Request
3. 分享给其他开发者

## 技术栈

- [VitePress](https://vitepress.dev/) - 静态站点生成器
- [Vue 3](https://v3.vuejs.org/) - 渐进式 JavaScript 框架
- 原生 JavaScript - 工具核心功能

<style>
/* 工具网格布局 */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin: 2rem 0;
}

/* 工具卡片样式 */
.tool-card {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  border: 1px solid var(--vp-c-border);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand);
}

.tool-card.coming-soon {
  opacity: 0.7;
}

.tool-card.coming-soon:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--vp-c-border);
}

.tool-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.tool-card h3 {
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
  font-size: 1.25rem;
}

.tool-card p {
  color: var(--vp-c-text-2);
  flex-grow: 1;
  margin: 0 0 1.5rem 0;
}

.tool-link {
  color: var(--vp-c-brand);
  text-decoration: none;
  font-weight: 600;
  display: inline-block;
  transition: color 0.3s ease;
}

.tool-link:hover {
  color: var(--vp-c-brand-dark);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tool-grid {
    grid-template-columns: 1fr;
  }
}

/* 自定义首页样式 */
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
}

/* 特性列表样式 */
.VPFeatures .container {
  padding: 2rem 0;
}
</style>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // 可以添加一些交互效果
})
</script>
