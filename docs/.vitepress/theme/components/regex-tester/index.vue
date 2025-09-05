<template>
  <div class="regex-tester">
    <div class="tool-header">
      <h2><i class="fas fa-code"></i> 正则表达式测试工具</h2>
      <p>测试和验证正则表达式，提供实时匹配结果和详细解释</p>
    </div>

    <div class="tool-body">
      <div class="input-section">
        <div class="input-group">
          <label>正则表达式</label>
          <div class="regex-input">
            <input
              v-model="regexPattern"
              @input="testRegex"
              placeholder="输入正则表达式，例如: ^[a-zA-Z0-9]+$"
              :class="{ error: regexError }" />
            <div class="regex-flags">
              <label v-for="flag in availableFlags" :key="flag" class="flag-checkbox">
                <input type="checkbox" :value="flag" v-model="selectedFlags" @change="testRegex" />
                <span>{{ flag }}</span>
              </label>
            </div>
          </div>
          <div v-if="regexError" class="error-message">
            {{ regexError }}
          </div>
        </div>

        <div class="input-group">
          <label>测试文本</label>
          <textarea v-model="testText" @input="testRegex" placeholder="输入要测试的文本" rows="5"></textarea>
        </div>

        <div class="input-group" v-if="showReplace">
          <label>替换文本</label>
          <input v-model="replaceText" @input="doReplace" placeholder="输入替换文本（使用 $1, $2 等引用分组）" />
        </div>
      </div>

      <div class="options-section">
        <div class="option-buttons">
          <button @click="showReplace = !showReplace" :class="{ active: showReplace }">
            <i class="fas fa-exchange-alt"></i> 替换功能
          </button>
          <button @click="clearAll"><i class="fas fa-trash"></i> 清空</button>
        </div>

        <div class="common-regex">
          <label>常用正则表达式</label>
          <select @change="applyCommonRegex($event)">
            <option value="">选择常用正则...</option>
            <optgroup v-for="(group, category) in groupedRegexes" :key="category" :label="category">
              <option v-for="(item, key) in group" :key="key" :value="key">
                {{ item.name }}
              </option>
            </optgroup>
          </select>
        </div>
      </div>

      <div class="results-section">
        <div class="results-tabs">
          <button :class="{ active: activeTab === 'matches' }" @click="activeTab = 'matches'">
            匹配结果 ({{ matches.length }})
          </button>
          <button :class="{ active: activeTab === 'groups' }" @click="activeTab = 'groups'">分组信息</button>
          <button :class="{ active: activeTab === 'explanation' }" @click="activeTab = 'explanation'">正则解释</button>
          <button v-if="showReplace" :class="{ active: activeTab === 'replace' }" @click="activeTab = 'replace'">
            替换结果
          </button>
        </div>

        <div class="results-content">
          <!-- 匹配结果 -->
          <div v-if="activeTab === 'matches'" class="tab-content">
            <div v-if="matches.length === 0" class="no-results">没有找到匹配项</div>
            <div v-else class="matches-list">
              <div v-for="(match, index) in matches" :key="index" class="match-item">
                <div class="match-number">#{{ index + 1 }}</div>
                <div class="match-text">{{ match[0] }}</div>
                <div class="match-details">
                  位置: {{ match.index }} - {{ match.index + match[0].length }}， 长度: {{ match[0].length }}
                </div>
              </div>
            </div>
          </div>

          <!-- 分组信息 -->
          <div v-if="activeTab === 'groups'" class="tab-content">
            <div v-if="matches.length === 0" class="no-results">没有找到匹配项</div>
            <div v-else class="groups-list">
              <div v-for="(match, matchIndex) in matches" :key="matchIndex" class="group-match">
                <h4>匹配 #{{ matchIndex + 1 }}</h4>
                <div class="group-items">
                  <div v-for="(group, groupIndex) in match.slice(1)" :key="groupIndex" class="group-item">
                    <span class="group-label">${{ groupIndex + 1 }}:</span>
                    <span class="group-value">{{ group || '(空)' }}</span>
                  </div>
                  <div v-if="match.groups" class="named-groups">
                    <div v-for="(value, name) in match.groups" :key="name" class="group-item">
                      <span class="group-label">{{ name }}:</span>
                      <span class="group-value">{{ value || '(空)' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 正则解释 -->
          <div v-if="activeTab === 'explanation'" class="tab-content">
            <div class="regex-explanation">
              <p v-if="!regexPattern">请输入正则表达式</p>
              <div v-else>
                <h4>正则表达式分析:</h4>
                <p>
                  <strong>模式:</strong> <code>/{{ regexPattern }}/{{ flagsString }}</code>
                </p>
                <p><strong>标志:</strong> {{ flagsExplanation }}</p>
                <div class="pattern-breakdown">
                  <h4>模式分解:</h4>
                  <ul>
                    <li v-for="(part, index) in patternParts" :key="index">
                      <code>{{ part.symbol }}</code> - {{ part.explanation }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- 替换结果 -->
          <div v-if="activeTab === 'replace' && showReplace" class="tab-content">
            <div class="replace-result">
              <h4>替换结果:</h4>
              <div class="result-text" v-html="highlightedReplaceResult"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="test-text-preview" v-if="testText">
        <label>测试文本预览 (匹配项高亮显示):</label>
        <div class="preview-content" v-html="highlightedText"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegexTester',
  data() {
    return {
      regexPattern: '',
      testText: '',
      replaceText: '',
      selectedFlags: ['g'],
      availableFlags: ['g', 'i', 'm', 's', 'u', 'y'],
      matches: [],
      regexError: null,
      activeTab: 'matches',
      showReplace: false,
      replaceResult: '',
      commonRegexes: {
        // 邮箱和身份验证类
        email: {
          name: '电子邮件地址',
          pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
          flags: ['i'],
          example: 'example@domain.com',
          category: '邮箱和身份验证'
        },
        email_strict: {
          name: '电子邮件地址(严格)',
          pattern:
            "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
          flags: ['i'],
          example: 'user.name+tag@example.com',
          category: '邮箱和身份验证'
        },
        chinese_id_card: {
          name: '中国身份证号',
          pattern: '^[1-9]\\d{5}(18|19|20)\\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\\d{3}[0-9Xx]$',
          flags: [],
          example: '110101199003077876',
          category: '邮箱和身份验证'
        },
        chinese_mobile: {
          name: '中国手机号码',
          pattern: '^1[3-9]\\d{9}$',
          flags: [],
          example: '13800138000',
          category: '邮箱和身份验证'
        },
        password_medium: {
          name: '中等强度密码(6-20位字母数字)',
          pattern: '^(?=.*\\d)(?=.*[a-zA-Z]).{6,20}$',
          flags: [],
          example: 'pass1234',
          category: '邮箱和身份验证'
        },
        password_strong: {
          name: '强密码(8-20位，含大小写字母和数字)',
          pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$',
          flags: [],
          example: 'Password123',
          category: '邮箱和身份验证'
        },

        // URL和网络相关
        url: {
          name: 'URL地址',
          pattern: '^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?$',
          flags: ['i'],
          example: 'https://www.example.com/path',
          category: 'URL和网络'
        },
        url_with_query: {
          name: '带查询参数的URL',
          pattern: '^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?\\??([\\w-]+=[\\w-]+&?)*$',
          flags: ['i'],
          example: 'https://example.com/page?name=test&id=123',
          category: 'URL和网络'
        },
        ipv4: {
          name: 'IPv4地址',
          pattern: '^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$',
          flags: [],
          example: '192.168.1.1',
          category: 'URL和网络'
        },
        ipv6: {
          name: 'IPv6地址',
          pattern:
            '^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$',
          flags: ['i'],
          example: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
          category: 'URL和网络'
        },
        mac_address: {
          name: 'MAC地址',
          pattern: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$',
          flags: [],
          example: '00:1A:2B:3C:4D:5E',
          category: 'URL和网络'
        },

        // 日期和时间类
        date_ymd: {
          name: '日期(YYYY-MM-DD)',
          pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
          flags: [],
          example: '2023-12-31',
          category: '日期和时间'
        },
        date_dmy: {
          name: '日期(DD/MM/YYYY)',
          pattern: '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$',
          flags: [],
          example: '31/12/2023',
          category: '日期和时间'
        },
        time_24h: {
          name: '24小时制时间',
          pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
          flags: [],
          example: '23:59',
          category: '日期和时间'
        },
        time_12h: {
          name: '12小时制时间',
          pattern: '^(0?[1-9]|1[0-2]):[0-5][0-9]\\s?(AM|PM|am|pm)$',
          flags: ['i'],
          example: '11:59 PM',
          category: '日期和时间'
        },
        datetime: {
          name: '日期时间(YYYY-MM-DD HH:MM:SS)',
          pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])\\s(?:[01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$',
          flags: [],
          example: '2023-12-31 23:59:59',
          category: '日期和时间'
        },

        // 数字和金额类
        integer: {
          name: '整数(正负均可)',
          pattern: '^-?\\d+$',
          flags: [],
          example: '-123456',
          category: '数字和金额'
        },
        positive_integer: {
          name: '正整数',
          pattern: '^[1-9]\\d*$',
          flags: [],
          example: '123456',
          category: '数字和金额'
        },
        decimal: {
          name: '小数(正负均可)',
          pattern: '^-?\\d+\\.\\d+$',
          flags: [],
          example: '-123.456',
          category: '数字和金额'
        },
        money_cny: {
          name: '人民币金额(元)',
          pattern: '^\\d+(\\.\\d{1,2})?$',
          flags: [],
          example: '123.45',
          category: '数字和金额'
        },
        money_with_symbol: {
          name: '带货币符号的金额',
          pattern: '^[￥$€]?\\s?\\d{1,3}(,\\d{3})*(\\.\\d{1,2})?$',
          flags: [],
          example: '$1,234.56',
          category: '数字和金额'
        },
        percentage: {
          name: '百分比',
          pattern: '^100(\\.0{1,2})?%$|^\\d{1,2}(\\.\\d{1,2})?%$',
          flags: [],
          example: '99.9%',
          category: '数字和金额'
        },

        // 文本和字符串类
        chinese_chars: {
          name: '中文字符',
          pattern: '[\\u4e00-\\u9fff]',
          flags: ['g'],
          example: '中文文本',
          category: '文本和字符串'
        },
        english_letters: {
          name: '英文字母',
          pattern: '^[a-zA-Z]+$',
          flags: [],
          example: 'HelloWorld',
          category: '文本和字符串'
        },
        username: {
          name: '用户名(4-20位字母数字下划线)',
          pattern: '^[a-zA-Z0-9_]{4,20}$',
          flags: [],
          example: 'user_name123',
          category: '文本和字符串'
        },
        hex_color: {
          name: '十六进制颜色代码',
          pattern: '^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$',
          flags: [],
          example: '#ff9900',
          category: '文本和字符串'
        },
        html_tag: {
          name: 'HTML标签',
          pattern: '<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)',
          flags: ['i', 'g'],
          example: '<div class="container">内容</div>',
          category: '文本和字符串'
        },
        json: {
          name: 'JSON格式',
          pattern:
            '^{\\s*"[^"]*"\\s*:\\s*("[^"]*"|\\d+|true|false|null)\\s*(,\\s*"[^"]*"\\s*:\\s*("[^"]*"|\\d+|true|false|null)\\s*)*}$',
          flags: [],
          example: '{"name": "John", "age": 30}',
          category: '文本和字符串'
        },

        // 特殊用途类
        xml_tag: {
          name: 'XML标签',
          pattern: '<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>(.*?)<\\/\\1>',
          flags: ['g'],
          example: '<note><body>内容</body></note>',
          category: '特殊用途'
        },
        base64: {
          name: 'Base64编码',
          pattern: '^[A-Za-z0-9+/]*={0,2}$',
          flags: [],
          example: 'SGVsbG8gV29ybGQ=',
          category: '特殊用途'
        },
        md5_hash: {
          name: 'MD5哈希值',
          pattern: '^[a-fA-F0-9]{32}$',
          flags: [],
          example: '5d41402abc4b2a76b9719d911017c592',
          category: '特殊用途'
        },
        sha1_hash: {
          name: 'SHA1哈希值',
          pattern: '^[a-fA-F0-9]{40}$',
          flags: [],
          example: 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
          category: '特殊用途'
        },
        uuid: {
          name: 'UUID',
          pattern: '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$',
          flags: [],
          example: '550e8400-e29b-41d4-a716-446655440000',
          category: '特殊用途'
        },
        credit_card: {
          name: '信用卡号',
          pattern:
            '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\\d{3})\\d{11})$',
          flags: [],
          example: '4111111111111111',
          category: '特殊用途'
        },
        isbn: {
          name: 'ISBN号',
          pattern:
            '^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$',
          flags: [],
          example: 'ISBN 978-3-16-148410-0',
          category: '特殊用途'
        },
        html_comment: {
          name: 'HTML注释',
          pattern: '<!--.*?-->',
          flags: ['g', 's'],
          example: '<!-- 这是一个注释 -->',
          category: '特殊用途'
        },
        css_hex_color: {
          name: 'CSS十六进制颜色',
          pattern: '#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})\\b',
          flags: ['g'],
          example: '#fff, #ffffff',
          category: '特殊用途'
        },
        css_rgb_color: {
          name: 'CSS RGB颜色',
          pattern: 'rgb\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*\\)',
          flags: ['g', 'i'],
          example: 'rgb(255, 255, 255)',
          category: '特殊用途'
        },
        css_rgba_color: {
          name: 'CSS RGBA颜色',
          pattern: 'rgba\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*([01]|0?\\.\\d+)\\s*\\)',
          flags: ['g', 'i'],
          example: 'rgba(255, 255, 255, 0.5)',
          category: '特殊用途'
        }
      }
    };
  },
  computed: {
    flagsString() {
      return this.selectedFlags.join('');
    },
    flagsExplanation() {
      const explanations = {
        g: '全局匹配',
        i: '不区分大小写',
        m: '多行匹配',
        s: '点号匹配所有字符（包括换行符）',
        u: 'Unicode模式',
        y: '粘性匹配'
      };
      return this.selectedFlags.map((flag) => `${flag}: ${explanations[flag]}`).join(', ');
    },
    highlightedText() {
      if (!this.regexPattern || !this.testText || this.regexError) {
        return this.escapeHtml(this.testText);
      }

      try {
        const regex = new RegExp(this.regexPattern, this.flagsString);
        let result = this.testText;
        let lastIndex = 0;
        let highlighted = '';

        if (this.selectedFlags.includes('g')) {
          let match;
          while ((match = regex.exec(this.testText)) !== null) {
            // 添加匹配前的内容
            highlighted += this.escapeHtml(result.substring(lastIndex, match.index));
            // 添加高亮的匹配内容
            highlighted += `<mark>${this.escapeHtml(match[0])}</mark>`;
            lastIndex = match.index + match[0].length;
            // 如果正则表达式是零宽度匹配，避免无限循环
            if (match[0].length === 0) {
              regex.lastIndex++;
            }
          }
          // 添加剩余内容
          highlighted += this.escapeHtml(result.substring(lastIndex));
        } else {
          // 非全局模式只匹配第一个
          const match = regex.exec(this.testText);
          if (match) {
            highlighted += this.escapeHtml(result.substring(0, match.index));
            highlighted += `<mark>${this.escapeHtml(match[0])}</mark>`;
            highlighted += this.escapeHtml(result.substring(match.index + match[0].length));
          } else {
            highlighted = this.escapeHtml(this.testText);
          }
        }

        return highlighted || this.escapeHtml(this.testText);
      } catch (e) {
        return this.escapeHtml(this.testText);
      }
    },
    patternParts() {
      // 这是一个简化的正则表达式解释器
      // 实际应用中可能需要更复杂的解析逻辑
      const parts = [];
      const pattern = this.regexPattern;

      if (!pattern) return parts;

      // 简单分解正则表达式
      let i = 0;
      while (i < pattern.length) {
        const char = pattern[i];

        switch (char) {
          case '\\':
            if (i + 1 < pattern.length) {
              const nextChar = pattern[i + 1];
              const explanations = {
                d: '数字字符',
                D: '非数字字符',
                w: '单词字符（字母、数字、下划线）',
                W: '非单词字符',
                s: '空白字符',
                S: '非空白字符',
                b: '单词边界',
                B: '非单词边界'
              };

              parts.push({
                symbol: `\\${nextChar}`,
                explanation: explanations[nextChar] || `转义字符: ${nextChar}`
              });
              i += 2;
            } else {
              parts.push({
                symbol: '\\',
                explanation: '转义字符'
              });
              i++;
            }
            break;

          case '^':
            parts.push({
              symbol: '^',
              explanation: '匹配字符串的开始'
            });
            i++;
            break;

          case '$':
            parts.push({
              symbol: '$',
              explanation: '匹配字符串的结束'
            });
            i++;
            break;

          case '.':
            parts.push({
              symbol: '.',
              explanation: '匹配任意单个字符（除换行符外）'
            });
            i++;
            break;

          case '*':
            parts.push({
              symbol: '*',
              explanation: '匹配前面的子表达式零次或多次'
            });
            i++;
            break;

          case '+':
            parts.push({
              symbol: '+',
              explanation: '匹配前面的子表达式一次或多次'
            });
            i++;
            break;

          case '?':
            parts.push({
              symbol: '?',
              explanation: '匹配前面的子表达式零次或一次'
            });
            i++;
            break;

          case '|':
            parts.push({
              symbol: '|',
              explanation: '或操作符，匹配左边或右边的表达式'
            });
            i++;
            break;

          case '[':
            // 字符类
            const endIndex = pattern.indexOf(']', i);
            if (endIndex !== -1) {
              const charClass = pattern.substring(i, endIndex + 1);
              parts.push({
                symbol: charClass,
                explanation: '字符类，匹配方括号中的任意一个字符'
              });
              i = endIndex + 1;
            } else {
              parts.push({
                symbol: '[',
                explanation: '字符类开始'
              });
              i++;
            }
            break;

          case '{':
            // 量词
            const braceEnd = pattern.indexOf('}', i);
            if (braceEnd !== -1) {
              const quantifier = pattern.substring(i, braceEnd + 1);
              parts.push({
                symbol: quantifier,
                explanation: '量词，指定前面元素出现的次数'
              });
              i = braceEnd + 1;
            } else {
              parts.push({
                symbol: '{',
                explanation: '量词开始'
              });
              i++;
            }
            break;

          case '(':
            // 分组
            const groupEnd = pattern.indexOf(')', i);
            if (groupEnd !== -1) {
              const group = pattern.substring(i, groupEnd + 1);
              let explanation = '分组，捕获匹配的内容';

              if (pattern[i + 1] === '?') {
                if (pattern[i + 2] === ':') {
                  explanation = '非捕获分组';
                } else if (pattern[i + 2] === '=') {
                  explanation = '正向肯定查找';
                } else if (pattern[i + 2] === '!') {
                  explanation = '正向否定查找';
                }
              }

              parts.push({
                symbol: group,
                explanation
              });
              i = groupEnd + 1;
            } else {
              parts.push({
                symbol: '(',
                explanation: '分组开始'
              });
              i++;
            }
            break;

          default:
            parts.push({
              symbol: char,
              explanation: `匹配字符 "${char}"`
            });
            i++;
        }
      }

      return parts;
    },
    highlightedReplaceResult() {
      if (!this.replaceResult) return '暂无替换结果';
      return this.escapeHtml(this.replaceResult);
    },
    groupedRegexes() {
    const grouped = {};
    for (const [key, value] of Object.entries(this.commonRegexes)) {
      if (!grouped[value.category]) {
        grouped[value.category] = {};
      }
      grouped[value.category][key] = value;
    }
    return grouped;
  }
  },
  methods: {
    testRegex() {
      this.regexError = null;
      this.matches = [];

      if (!this.regexPattern || !this.testText) {
        return;
      }

      try {
        const regex = new RegExp(this.regexPattern, this.flagsString);

        if (this.selectedFlags.includes('g')) {
          // 全局匹配，获取所有匹配结果
          let match;
          const allMatches = [];

          // 重置lastIndex，确保每次测试都从开始处匹配
          regex.lastIndex = 0;

          while ((match = regex.exec(this.testText)) !== null) {
            allMatches.push(match);
            // 如果正则表达式是零宽度匹配，避免无限循环
            if (match[0].length === 0) {
              regex.lastIndex++;
            }
          }

          this.matches = allMatches;
        } else {
          // 非全局匹配，只获取第一个匹配结果
          const match = regex.exec(this.testText);
          if (match) {
            this.matches = [match];
          }
        }

        // 如果有替换功能且已开启，执行替换
        if (this.showReplace) {
          this.doReplace();
        }
      } catch (e) {
        this.regexError = e.message;
      }
    },

    doReplace() {
      if (!this.regexPattern || !this.testText || this.regexError) {
        return;
      }

      try {
        const regex = new RegExp(this.regexPattern, this.flagsString);
        this.replaceResult = this.testText.replace(regex, this.replaceText);
      } catch (e) {
        this.replaceResult = '替换出错: ' + e.message;
      }
    },

    clearAll() {
      this.regexPattern = '';
      this.testText = '';
      this.replaceText = '';
      this.matches = [];
      this.regexError = null;
      this.activeTab = 'matches';
    },

    applyCommonRegex(event) {
      const key = event.target.value;
      if (key && this.commonRegexes[key]) {
        const regex = this.commonRegexes[key];
        this.regexPattern = regex.pattern;
        this.selectedFlags = [...regex.flags];
        this.testRegex();
      }
    },

    escapeHtml(text) {
      if (!text) return '';
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  }
};
</script>

<style scoped>
.regex-tester {
  max-width: 1000px;
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
}

.tool-header p {
  color: #7f8c8d;
}

.input-section {
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
}

.regex-input {
  display: flex;
  align-items: center;
}

.regex-input input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px 0 0 6px;
  font-family: monospace;
  font-size: 16px;
}

.regex-input input.error {
  border-color: #e74c3c;
}

.regex-flags {
  display: flex;
  border: 1px solid #ddd;
  border-left: none;
  border-radius: 0 6px 6px 0;
  overflow: hidden;
}

.flag-checkbox {
  display: flex;
  align-items: center;
  padding: 0 10px;
  background: #f8f9fa;
  border-right: 1px solid #ddd;
  cursor: pointer;
}

.flag-checkbox:last-child {
  border-right: none;
}

.flag-checkbox input {
  margin-right: 5px;
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

.options-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.option-buttons {
  display: flex;
  gap: 10px;
}

.option-buttons button {
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-buttons button:hover {
  background: #e9ecef;
}

.option-buttons button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.common-regex {
  display: flex;
  align-items: center;
  gap: 10px;
}

.common-regex label {
  white-space: nowrap;
}

.common-regex select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

.results-section {
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 20px;
}

.results-tabs {
  display: flex;
  border-bottom: 1px solid #ddd;
  background: #f8f9fa;
}

.results-tabs button {
  padding: 12px 20px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.results-tabs button:hover {
  background: #e9ecef;
}

.results-tabs button.active {
  border-bottom-color: #3498db;
  color: #3498db;
  font-weight: 600;
}

.tab-content {
  padding: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.no-results {
  color: #7f8c8d;
  text-align: center;
  padding: 20px;
}

.match-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  font-family: monospace;
}

.match-item:last-child {
  border-bottom: none;
}

.match-number {
  font-weight: bold;
  color: #3498db;
  margin-bottom: 5px;
}

.match-details {
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 5px;
}

.group-match {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.group-match:last-child {
  border-bottom: none;
}

.group-match h4 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.group-item {
  display: flex;
  margin-bottom: 8px;
  font-family: monospace;
}

.group-label {
  font-weight: bold;
  min-width: 50px;
  color: #e74c3c;
}

.group-value {
  margin-left: 10px;
}

.regex-explanation h4 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.regex-explanation p {
  margin-bottom: 10px;
}

.pattern-breakdown ul {
  list-style: none;
  padding: 0;
}

.pattern-breakdown li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
  font-family: monospace;
}

.pattern-breakdown li:last-child {
  border-bottom: none;
}

.test-text-preview {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 15px;
  background: #f8f9fa;
}

.test-text-preview label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #2c3e50;
}

.preview-content {
  padding: 15px;
  background: white;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-family: monospace;
  white-space: pre-wrap;
  max-height: 200px;
  overflow-y: auto;
}

.preview-content mark {
  background: #ffeaa7;
  padding: 2px 0;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 5px;
}

.replace-result h4 {
  margin-bottom: 10px;
  color: #2c3e50;
}

.result-text {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-family: monospace;
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  .regex-input {
    flex-direction: column;
  }

  .regex-input input {
    border-radius: 6px;
    margin-bottom: 10px;
  }

  .regex-flags {
    border-radius: 6px;
    border-left: 1px solid #ddd;
    align-self: flex-start;
  }

  .options-section {
    flex-direction: column;
  }

  .results-tabs {
    flex-wrap: wrap;
  }

  .results-tabs button {
    flex: 1;
    min-width: 120px;
    text-align: center;
  }
}
</style>
