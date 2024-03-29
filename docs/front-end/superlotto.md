<script setup>
import { ref } from 'vue';
import generateSuperLotto from '../../src/数组/生成大乐透号码/generateSuperlotto.js';
const result = ref(generateSuperLotto());
function update() {
  result.value = generateSuperLotto();
}

const copyText = async (val) => {
  try {
    // 使用现代 API 尝试复制
    if (navigator.clipboard && navigator.permissions) {
      await navigator.clipboard.writeText(val);
      return; // 如果成功，直接返回
    }

    // 降级方案
   const textArea = document.createElement('textArea') 
   textArea.value = val 
   textArea.style.width = 0 
   textArea.style.position = 'fixed' 
   textArea.style.left = '-999px' 
   textArea.style.top = '10px' 
   textArea.setAttribute('readonly', 'readonly')
   document.body.appendChild(textArea) 
   textArea.select()

    // 尝试执行复制操作
    const success = document.execCommand('copy');
    if (!success) {
      throw new Error('无法复制文本');
    }

    // 清理
    document.body.removeChild(textArea);
  } catch (err) {
    console.error('复制失败:', err);
  }
};

function copy() {
  const text = result.value.flat().join(' ');
  copyText(text).then(() => {
      window.alert("已复制");
    })
}
</script>

# 超级大乐透生成器

<div :class="$style.result">
  <div>
    <h4>前区：</h4>
    <div  :class="$style.frontArea">
      <div :class="$style.front" v-for="item in result[0]">{{item}}</div>
    </div>
  </div>
  <div>
    <h4>后区：</h4>
    <div  :class="$style.backArea">
      <div :class="$style.back" v-for="item in result[1]">{{item}}</div> 
    </div>
  </div>
</div>
<div :class="$style.operateArea">
  <button :class="$style.button" @click="update">立即生成</button>
  <button :class="$style.button" @click="copy">一键复制</button> 
</div>


<style module>

.result {
  display: flex;
  align-items: center;
  margin: 50px 0 30px 0;
  flex-wrap: wrap;
  gap: 15px;
}

.front,
.back {
  width: 50px;
  height: 50px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  border-radius: 50%;
  cursor: pointer;
}

.frontArea,
.backArea,
.operateArea {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  margin-right: 30px;
}

.front {
  background-color: red;
}

.back {
  background-color: blue;
}

.back,
.front,
.button {
  transition: all .2s ease;
  transition-property: transform,box-shadow;
  box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
}

.button {
  display: inline-flex;
  vertical-align: top;
  align-items: center;
  outline: none;
  border: none;
  color: #fff;
  padding: 10px 20px;
  line-height: 1.5715;
  border-radius: 2px;
  cursor: pointer;
  background-color: #d9534f;
  border-color: #d43;
}

.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
}

.front:hover,
.back:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 6px rgba(50,50,93,.11), 0 1px 3px rgba(0,0,0,.08);
}

</style>