# HTML

HTML（超文本标记语言，**H**yper**T**ext **M**arkup **L**anguage）不是编程语言，而是定义了网页内容的含义和结构的标记语言。“超文本”（hypertext）是指连接单个网站内或多个网站间的网页的链接。HTML 使用“标记”（markup）来注明文本、图片和其他内容，以便于在 Web 浏览器中显示。HTML由一系列元素组成，标签用于创建元素，标签里的元素名不区分大小写，但推荐将标签名全部小写。不包含任何内容的元素称为空元素，空元素不能存在结束标签，比如 `<img />`。

## Doctype

`<!Doctype>` 声明即文档类型定义（DTD），告知浏览器采用的文档解析标准，分为**严格模式（标准模式——W3C标准）**和**混杂模式（兼容模式—向老版本兼容）**，声明位置—HTML文档首行（`<html>` 标签之前），在HTML4 规定了三种不同的 `<!DOCTYPE>` 声明，分别是：Strict（严格模式）、Transitional和 Frameset，后两种声明下，若 DTD 不存在/格式不正确或没有最后的 URI 以混杂模式呈现，否则以严格模式呈现：

`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">`

`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">`

`<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">`

HTML5 与 HTML4 不同，不基于 SGML（Standard Generalized Markup Language 标准通用标记语言），也就不需要 DTD，因此 HTML5 仅标准模式 `<!DOCTYPE html>` 一种规范，没有严格和混杂之分。

通过 **`document.compatMode`** 可以输出当前文档的渲染模式是**怪异/混杂/兼容模式（`BackCompat`）**还是**标准模式（`CSS1Compat`）**。