<script setup>
import Base64Converter from '../.vitepress/theme/components/base64-converter/index.vue'
</script>

# Base64 编码/解码工具

一个功能强大的Base64编码和解码工具，支持文本和文件的Base64转换。

<Base64Converter></Base64Converter>

## 功能特点

- **双向转换**：支持文本到Base64编码和Base64到文本解码
- **文件支持**：可以将文件编码为Base64，或从Base64解码还原文件
- **实时转换**：输入内容后立即显示转换结果
- **复制功能**：一键复制编码或解码结果
- **下载功能**：支持下载转换结果
- **直观界面**：清晰的编码/解码模式切换

## 使用方法

### 文本编码/解码

1. 选择"编码"或"解码"模式
2. 在输入框中输入要处理的内容
3. 查看实时显示的结果
4. 使用复制按钮复制结果，或下载按钮保存结果

### 文件编码/解码

1. 选择"文件转换"模式
2. 拖放文件到指定区域或点击选择文件
3. 点击"编码文件"将文件转换为Base64编码
4. 对于Base64编码的文件内容，点击"解码文件"还原原始文件
5. 下载解码后的文件

## Base64 编码原理

Base64是一种基于64个可打印字符来表示二进制数据的编码方式。它使用`A-Z`、`a-z`、`0-9`、`+`和`/`这64个字符，以及用作填充的`=`字符。

### 编码过程

1. 将输入数据每3个字节（24位）分为一组
2. 将24位数据分为4个6位的组
3. 每个6位的组转换为对应的Base64字符
4. 如果最后不足3字节，进行填充处理

### 解码过程

1. 移除Base64字符串中的非Base64字符（如空格、换行）
2. 将每个Base64字符转换为6位二进制值
3. 将4个6位组组合成3个8位字节
4. 处理填充字符`=`

## 应用场景

### 数据URI方案

Base64常用于数据URI方案，允许在HTML、CSS中嵌入小型资源：

```html
<!-- 内嵌图片 -->
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..." alt="Base64 encoded image">

<!-- 内嵌CSS背景 -->
<div style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3...')"></div>

```

### 电子邮件附件

MIME协议使用Base64编码电子邮件附件，确保二进制数据在邮件系统中正确传输。

### API认证

HTTP基本认证使用Base64编码用户名和密码：

### 数据存储

在JSON、XML等文本格式中存储二进制数据：

### 注意事项

数据膨胀：Base64编码会使数据大小增加约33%，不适合编码大型文件
a                         
性能考虑：编解码过程需要CPU计算，大量数据处理可能影响性能

安全性：Base64不是加密算法，不应用于保护敏感信息

字符集：确保使用正确的字符编码（通常为UTF-8）处理文本

## 示例

### 文本编码

```text
原始文本: Hello, World!
Base64编码: SGVsbG8sIFdvcmxkIQ==
```

### 文本解码

```text
Base64编码: VGVzdCBTdHJpbmc=
解码结果: Test String
```


### 技术实现

本工具使用JavaScript内置的btoa()和atob()函数进行Base64编码和解码，这些函数在现代浏览器中得到广泛支持。

对于文件操作，使用FileReader API读取文件内容，并使用Blob对象处理二进制数据。