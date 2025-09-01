<template>
  <div class="color-converter">
    <div class="tool-header">
      <h2>🎨 颜色选择与转换工具</h2>
      <p>选择、转换和分析颜色，支持多种格式和调色板生成</p>
    </div>

    <!-- 颜色选择区域 -->
    <div class="color-selection">
      <div class="section-title">
        <h3>选择颜色</h3>
        <div class="color-preview" :style="{ backgroundColor: currentColor.hex8 }"></div>
      </div>

      <div class="color-picker-container">
        <input type="color" v-model="currentColor.hex8" class="color-picker" @input="updateFromPicker" />
        <div class="color-inputs">
          <div class="input-group" v-for="format in colorFormats" :key="format.key">
            <label :for="format.key">{{ format.label }}</label>
            <input
              :id="format.key"
              type="text"
              v-model="currentColor[format.key]"
              @input="updateFromInput(format.key, $event)"
              :placeholder="format.placeholder"
              spellcheck="false" />
            <button class="copy-btn" @click="copyColor(currentColor[format.key])" title="复制">
              <span>📋</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 颜色信息区域 -->
    <div class="color-info">
      <div class="section-title">
        <h3>颜色信息</h3>
      </div>

      <div class="info-cards">
        <div class="info-card">
          <h4>HEX 值</h4>
          <p>{{ currentColor.hex }}</p>
          <p v-if="hasAlpha">带透明度: {{ currentColor.hex8 }}</p>
        </div>

        <div class="info-card">
          <h4>RGB 值</h4>
          <p>rgb({{ currentColor.rgb }})</p>
          <p v-if="hasAlpha">rgba({{ currentColor.rgba }})</p>
        </div>

        <div class="info-card">
          <h4>HSL 值</h4>
          <p>hsl({{ currentColor.hsl }})</p>
          <p v-if="hasAlpha">hsla({{ currentColor.hsla }})</p>
        </div>
      </div>

      <div class="color-visualization">
        <div class="color-box" :style="{ backgroundColor: currentColor.hex8 }">
          <div class="color-box-label">{{ currentColor.hex8 }}</div>
        </div>
        <div class="color-demo" :style="{ backgroundColor: currentColor.hex8 }">
          <p :class="textColorClass">这是一段示例文本</p>
          <p :class="textColorClass">用于展示颜色效果</p>
        </div>
      </div>
    </div>
    <!-- 调色板生成 -->
    <div class="palette-section">
      <div class="section-title">
        <h3>调色板生成</h3>
        <div class="section-controls">
          <select v-model="paletteType" class="palette-select">
            <option value="monochromatic">单色</option>
            <option value="analogous">类似色</option>
            <option value="complementary">互补色</option>
            <option value="triadic">三色</option>
            <option value="tetradic">四色</option>
          </select>
          <button class="generate-btn" @click="generatePalette">🔄 生成</button>
        </div>
      </div>

      <div class="palette-container">
        <div
          v-for="(color, index) in palette"
          :key="index"
          class="palette-color"
          :style="{ backgroundColor: color }"
          @click="selectPaletteColor(color)">
          <div class="palette-color-info">
            <span>{{ color }}</span>
            <button class="palette-copy-btn" @click.stop="copyColor(color)">📋</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 对比度检查 -->
    <div class="contrast-section">
      <div class="section-title">
        <h3>对比度检查</h3>
      </div>

      <div class="contrast-controls">
        <div class="color-selector">
          <label>前景色</label>
          <input type="color" v-model="foregroundColor" @input="calculateContrast" />
          <input type="text" v-model="foregroundColor" @input="updateContrastFromInput('foreground', $event)" />
        </div>

        <div class="contrast-result">
          <div class="contrast-ratio" :class="contrastRatingClass">对比度: {{ contrastRatio }}:1</div>
          <div class="contrast-rating">
            {{ contrastRating }}
          </div>
        </div>

        <div class="color-selector">
          <label>背景色</label>
          <input type="color" v-model="backgroundColor" @input="calculateContrast" />
          <input type="text" v-model="backgroundColor" @input="updateContrastFromInput('background', $event)" />
        </div>
      </div>

      <div class="contrast-demo" :style="{ backgroundColor: backgroundColor }">
        <div class="contrast-text" :style="{ color: foregroundColor }">
          <p>这是一段示例文本，用于展示颜色对比效果</p>
          <p>WCAG 2.1 可访问性标准测试</p>
        </div>
      </div>

      <div class="wcag-guidelines">
        <h4>WCAG 2.1 可访问性标准:</h4>
        <ul>
          <li :class="{ met: contrastRatio >= 3 }">
            <span class="guideline-icon">{{ contrastRatio >= 3 ? '✅' : '❌' }}</span>
            AA级 (最小对比度 3:1) - 大型文本
          </li>
          <li :class="{ met: contrastRatio >= 4.5 }">
            <span class="guideline-icon">{{ contrastRatio >= 4.5 ? '✅' : '❌' }}</span>
            AA级 (最小对比度 4.5:1) - 正常文本
          </li>
          <li :class="{ met: contrastRatio >= 7 }">
            <span class="guideline-icon">{{ contrastRatio >= 7 ? '✅' : '❌' }}</span>
            AAA级 (最小对比度 7:1) - 正常文本
          </li>
        </ul>
      </div>
    </div>

    <!-- 通知 -->
    <div class="notification" :class="{ show: showNotify }">
      {{ notificationMessage }}
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from 'vue';

export default {
  name: 'ColorConverter',
  setup() {
    // 颜色格式定义
    const colorFormats = [
      { key: 'hex', label: 'HEX', placeholder: '#RRGGBB' },
      { key: 'hex8', label: 'HEX8', placeholder: '#RRGGBBAA' },
      { key: 'rgb', label: 'RGB', placeholder: 'rgb(r, g, b)' },
      { key: 'rgba', label: 'RGBA', placeholder: 'rgba(r, g, b, a)' },
      { key: 'hsl', label: 'HSL', placeholder: 'hsl(h, s%, l%)' },
      { key: 'hsla', label: 'HSLA', placeholder: 'hsla(h, s%, l%, a)' }
    ];

    // 响应式数据
    const currentColor = reactive({
      hex: '#3498db',
      hex8: '#3498dbff',
      rgb: '52, 152, 219',
      rgba: '52, 152, 219, 1',
      hsl: '204, 70%, 53%',
      hsla: '204, 70%, 53%, 1'
    });

    const paletteType = ref('monochromatic');
    const palette = ref([]);
    const foregroundColor = ref('#ffffff');
    const backgroundColor = ref('#3498db');
    const contrastRatio = ref(0);
    const contrastRating = ref('');
    const showNotify = ref(false);
    const notificationMessage = ref('');

    // 计算属性
    const hasAlpha = computed(() => {
      return currentColor.hex8.length === 9 && currentColor.hex8 !== currentColor.hex + 'ff';
    });

    const textColorClass = computed(() => {
      const rgb = hexToRgb(currentColor.hex8);
      if (!rgb) return 'dark-text';

      // 计算相对亮度
      const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
      return luminance > 0.5 ? 'dark-text' : 'light-text';
    });

    const contrastRatingClass = computed(() => {
      if (contrastRatio.value >= 7) return 'excellent';
      if (contrastRatio.value >= 4.5) return 'good';
      if (contrastRatio.value >= 3) return 'fair';
      return 'poor';
    });

    // 颜色转换函数
    function hexToRgb(hex) {
      hex = hex.replace('#', '');

      let r,
        g,
        b,
        a = 255;

      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex[0] + hex[1], 16);
        g = parseInt(hex[2] + hex[3], 16);
        b = parseInt(hex[4] + hex[5], 16);
      } else if (hex.length === 8) {
        r = parseInt(hex[0] + hex[1], 16);
        g = parseInt(hex[2] + hex[3], 16);
        b = parseInt(hex[4] + hex[5], 16);
        a = parseInt(hex[6] + hex[7], 16);
      } else {
        return null;
      }

      return { r, g, b, a };
    }

    function rgbToHex(r, g, b, a = 255) {
      const toHex = (c) => {
        const hex = Math.round(c).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };

      let hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      if (a < 255) hex += toHex(a);

      return hex;
    }

    function rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h,
        s,
        l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }

        h /= 6;
      }

      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    }

    function hslToRgb(h, s, l) {
      h /= 360;
      s /= 100;
      l /= 100;

      let r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
      };
    }

    function parseColorInput(value, format) {
      try {
        if (format === 'hex' || format === 'hex8') {
          if (!/^#?[0-9A-Fa-f]{3,8}$/.test(value)) return null;

          let hex = value.replace('#', '');
          if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
          } else if (hex.length === 6) {
            // 已经是6位HEX
          } else if (hex.length === 8) {
            // 已经是8位HEX
          } else {
            return null;
          }

          return `#${hex}`;
        } else if (format === 'rgb' || format === 'rgba') {
          const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
          if (!match) return null;

          const r = parseInt(match[1]);
          const g = parseInt(match[2]);
          const b = parseInt(match[3]);
          const a = match[4] ? Math.round(parseFloat(match[4]) * 255) : 255;

          if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255 || a < 0 || a > 255) {
            return null;
          }

          return rgbToHex(r, g, b, a);
        } else if (format === 'hsl' || format === 'hsla') {
          const match = value.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/i);
          if (!match) return null;

          const h = parseInt(match[1]);
          const s = parseInt(match[2]);
          const l = parseInt(match[3]);
          const a = match[4] ? Math.round(parseFloat(match[4]) * 255) : 255;

          if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100 || a < 0 || a > 255) {
            return null;
          }

          const rgb = hslToRgb(h, s, l);
          return rgbToHex(rgb.r, rgb.g, rgb.b, a);
        }
      } catch (e) {
        return null;
      }

      return null;
    }

    function updateAllFormats(hexColor) {
      const rgb = hexToRgb(hexColor);
      if (!rgb) return;

      // 更新HEX格式
      currentColor.hex = hexColor.length === 9 ? hexColor.substring(0, 7) : hexColor;
      currentColor.hex8 = hexColor.length === 7 ? hexColor + 'ff' : hexColor;

      // 更新RGB格式
      currentColor.rgb = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
      currentColor.rgba =
        rgb.a === 255 ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : `${rgb.r}, ${rgb.g}, ${rgb.b}, ${(rgb.a / 255).toFixed(2)}`;

      // 更新HSL格式
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      currentColor.hsl = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
      currentColor.hsla =
        rgb.a === 255
          ? `${hsl.h}, ${hsl.s}%, ${hsl.l}%`
          : `${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${(rgb.a / 255).toFixed(2)}`;
    }

    // 事件处理函数
    function updateFromPicker() {
      updateAllFormats(currentColor.hex8);
    }

    function updateFromInput(format, event) {
      const value = event.target.value;
      const hexColor = parseColorInput(value, format);

      if (hexColor) {
        updateAllFormats(hexColor);
      } else {
        showNotification('无效的颜色格式');
      }
    }

    function generatePalette() {
      const baseRgb = hexToRgb(currentColor.hex8);
      if (!baseRgb) return;

      const baseHsl = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);
      palette.value = [];

      switch (paletteType.value) {
        case 'monochromatic':
          // 单色调色板 - 调整亮度
          for (let i = -4; i <= 4; i++) {
            if (i === 0) continue;
            const l = Math.max(0, Math.min(100, baseHsl.l + i * 10));
            const rgb = hslToRgb(baseHsl.h, baseHsl.s, l);
            palette.value.push(rgbToHex(rgb.r, rgb.g, rgb.b));
          }
          break;

        case 'analogous':
          // 类似色调色板 - 调整色相
          for (let i = -2; i <= 2; i++) {
            const h = (baseHsl.h + i * 30 + 360) % 360;
            const rgb = hslToRgb(h, baseHsl.s, baseHsl.l);
            palette.value.push(rgbToHex(rgb.r, rgb.g, rgb.b));
          }
          break;

        case 'complementary':
          // 互补色调色板
          const compH = (baseHsl.h + 180) % 360;
          const compRgb = hslToRgb(compH, baseHsl.s, baseHsl.l);
          palette.value.push(rgbToHex(compRgb.r, compRgb.g, compRgb.b));
          break;

        case 'triadic':
          // 三色调色板
          const triad1 = (baseHsl.h + 120) % 360;
          const triad2 = (baseHsl.h + 240) % 360;
          const triadRgb1 = hslToRgb(triad1, baseHsl.s, baseHsl.l);
          const triadRgb2 = hslToRgb(triad2, baseHsl.s, baseHsl.l);
          palette.value.push(rgbToHex(triadRgb1.r, triadRgb1.g, triadRgb1.b));
          palette.value.push(rgbToHex(triadRgb2.r, triadRgb2.g, triadRgb2.b));
          break;

        case 'tetradic':
          // 四色调色板
          const tetrad1 = (baseHsl.h + 90) % 360;
          const tetrad2 = (baseHsl.h + 180) % 360;
          const tetrad3 = (baseHsl.h + 270) % 360;
          const tetradRgb1 = hslToRgb(tetrad1, baseHsl.s, baseHsl.l);
          const tetradRgb2 = hslToRgb(tetrad2, baseHsl.s, baseHsl.l);
          const tetradRgb3 = hslToRgb(tetrad3, baseHsl.s, baseHsl.l);
          palette.value.push(rgbToHex(tetradRgb1.r, tetradRgb1.g, tetradRgb1.b));
          palette.value.push(rgbToHex(tetradRgb2.r, tetradRgb2.g, tetradRgb2.b));
          palette.value.push(rgbToHex(tetradRgb3.r, tetradRgb3.g, tetradRgb3.b));
          break;

        default:
          // 默认返回单色
          for (let i = -4; i <= 4; i++) {
            if (i === 0) continue;
            const l = Math.max(0, Math.min(100, baseHsl.l + i * 10));
            const rgb = hslToRgb(baseHsl.h, baseHsl.s, l);
            palette.value.push(rgbToHex(rgb.r, rgb.g, rgb.b));
          }
      }

      // 确保调色板包含基色
      palette.value.unshift(currentColor.hex);
    }

    function selectPaletteColor(color) {
      updateAllFormats(color);
    }

    function calculateContrast() {
      const fgRgb = hexToRgb(foregroundColor.value);
      const bgRgb = hexToRgb(backgroundColor.value);

      if (!fgRgb || !bgRgb) {
        contrastRatio.value = 0;
        contrastRating.value = '无效颜色';
        return;
      }

      // 计算相对亮度
      const getLuminance = (r, g, b) => {
        const [rs, gs, bs] = [r, g, b].map((c) => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };

      const l1 = getLuminance(fgRgb.r, fgRgb.g, fgRgb.b);
      const l2 = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

      // 计算对比度
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      contrastRatio.value = (lighter + 0.05) / (darker + 0.05);
      contrastRatio.value = Math.round(contrastRatio.value * 100) / 100;

      // 设置对比度评级
      if (contrastRatio.value >= 7) {
        contrastRating.value = '优秀 (AAA)';
      } else if (contrastRatio.value >= 4.5) {
        contrastRating.value = '良好 (AA)';
      } else if (contrastRatio.value >= 3) {
        contrastRating.value = '一般 (AA大文本)';
      } else {
        contrastRating.value = '差';
      }
    }

    function updateContrastFromInput(type, event) {
      const value = event.target.value;
      const hexColor = parseColorInput(value, 'hex');

      if (hexColor) {
        if (type === 'foreground') {
          foregroundColor.value = hexColor;
        } else {
          backgroundColor.value = hexColor;
        }
        calculateContrast();
      }
    }

    function copyColor(color) {
      navigator.clipboard
        .writeText(color)
        .then(() => {
          showNotification('颜色已复制到剪贴板');
        })
        .catch(() => {
          showNotification('复制失败，请手动复制');
        });
    }

    function showNotification(message) {
      notificationMessage.value = message;
      showNotify.value = true;
      setTimeout(() => {
        showNotify.value = false;
      }, 2000);
    }

    // 生命周期钩子
    onMounted(() => {
      calculateContrast();
      generatePalette();
    });

    return {
      colorFormats,
      currentColor,
      paletteType,
      palette,
      foregroundColor,
      backgroundColor,
      contrastRatio,
      contrastRating,
      showNotification,
      notificationMessage,
      hasAlpha,
      textColorClass,
      contrastRatingClass,
      updateFromPicker,
      updateFromInput,
      generatePalette,
      selectPaletteColor,
      calculateContrast,
      updateContrastFromInput,
      copyColor
    };
  }
};
</script>

<style scoped>
.color-converter {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #2c3e50;
}

.tool-header {
  text-align: center;
  margin-bottom: 30px;
  border-radius: 16px;
}

.tool-header h2 {
  margin-bottom: 8px;
  font-size: 1.8em;
}

.tool-header p {
  font-size: 1em;
  margin: 0;
  opacity: 0.9;
}

.color-selection,
.color-info {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: fit-content; /* 高度自适应内容 */
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f1f2f6;
}

.section-title h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.3em;
}

.color-preview {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid #ddd;
}

/* 优化颜色选择器布局 */
.color-picker-container {
  display: flex;
  gap: 25px;
  align-items: flex-start;
}

.color-picker {
  width: 80px;
  height: 80px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  flex-shrink: 0; /* 防止被挤压 */
}

.color-inputs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  min-width: 0; /* 防止内容溢出 */
}

.input-group {
  display: grid;
  grid-template-columns: 70px 1fr 50px; /* 调整列宽 */
  gap: 12px;
  align-items: center;
}

.input-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95em;
}

.input-group input {
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  transition: border-color 0.3s;
  min-width: 0; /* 防止输入框溢出 */
}

.input-group input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.copy-btn {
  padding: 12px;
  background: #f8f9fa;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.copy-btn:hover {
  background: #e9ecef;
  transform: scale(1.05);
}

/* 优化颜色信息区域 */
.info-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  margin-bottom: 25px;
}

.info-card {
  padding: 18px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #3498db;
}

.info-card h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 1em;
}

.info-card p {
  margin: 6px 0;
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  color: #6c757d;
  word-break: break-all; /* 防止长文本溢出 */
}

.color-visualization {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 20px;
}

.color-box {
  height: 100px;
  border-radius: 12px;
  display: flex;
  align-items: end;
  justify-content: center;
  padding: 15px;
  position: relative;
  overflow: hidden;
}

.color-box-label {
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8em;
  font-family: 'Fira Code', monospace;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.color-demo {
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.color-demo p {
  margin: 8px 0;
  font-weight: 500;
}

/* 调色板和对比度部分样式 */
.palette-section,
.contrast-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.section-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.palette-select {
  padding: 10px 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
}

.generate-btn {
  padding: 10px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
}

.generate-btn:hover {
  background: #2980b9;
}

.palette-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.palette-color {
  height: 100px;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  overflow: hidden;
}

.palette-color:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.palette-color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.palette-color:hover .palette-color-info {
  opacity: 1;
}

.palette-color-info span {
  font-size: 0.8em;
  font-family: 'Fira Code', monospace;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.palette-copy-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 0.9em;
  padding: 4px;
  flex-shrink: 0;
}

.contrast-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 25px;
}

.color-selector {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  flex: 1;
}

.color-selector label {
  font-weight: 600;
  color: #2c3e50;
}

.color-selector input[type='color'] {
  width: 60px;
  height: 60px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.color-selector input[type='text'] {
  width: 100%;
  padding: 10px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  text-align: center;
}

.contrast-result {
  text-align: center;
  flex: 1;
}

.contrast-ratio {
  font-size: 1.4em;
  font-weight: 700;
  margin-bottom: 8px;
}

.contrast-ratio.excellent {
  color: #27ae60;
}

.contrast-ratio.good {
  color: #3498db;
}

.contrast-ratio.fair {
  color: #f39c12;
}

.contrast-ratio.poor {
  color: #e74c3c;
}

.contrast-rating {
  font-weight: 600;
}

.contrast-demo {
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 25px;
  text-align: center;
}

.contrast-text {
  font-size: 1.2em;
  font-weight: 500;
  line-height: 1.6;
}

.wcag-guidelines {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.wcag-guidelines h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.wcag-guidelines ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.wcag-guidelines li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: white;
  transition: background 0.3s;
}

.wcag-guidelines li.met {
  background: #d5f5e3;
}

.guideline-icon {
  font-size: 1.2em;
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
@media (max-width: 968px) {
  .main-container {
    grid-template-columns: 1fr;
  }

  .color-picker-container {
    flex-direction: column;
  }

  .color-visualization {
    grid-template-columns: 1fr;
  }

  .contrast-controls {
    flex-direction: column;
    gap: 25px;
  }

  .palette-container {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .input-group {
    grid-template-columns: 70px 1fr 50px;
  }
}

@media (max-width: 640px) {
  .color-converter {
    padding: 15px;
  }

  .input-group {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: 8px;
  }

  .section-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .section-controls {
    width: 100%;
    justify-content: space-between;
  }

  .palette-container {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  }

  .color-picker {
    width: 60px;
    height: 60px;
    align-self: center;
  }

  .color-visualization {
    gap: 15px;
  }

  .color-box {
    height: 80px;
  }
}

.dark-text {
  color: #2c3e50;
}

.light-text {
  color: white;
}
</style>
