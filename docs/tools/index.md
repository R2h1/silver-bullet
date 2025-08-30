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
  
  <div class="tool-card coming-soon">
    <div class="tool-icon">❓</div>
    <h3>更多工具即将到来</h3>
    <p>每天都会添加新的实用工具，敬请期待！</p>
    <span class="tool-link">开发中...</span>
  </div>
  
  <div class="tool-card coming-soon">
    <div class="tool-icon">❓</div>
    <h3>更多工具即将到来</h3>
    <p>每天都会添加新的实用工具，敬请期待！</p>
    <span class="tool-link">开发中...</span>
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