# 小工具站

静态迷你小工具网站，当前包含「记忆卡片」等工具。

---

## 1. 记忆卡片：如何添加新书

书的数据写在 **`tools/data/books-data.js`** 里，页面加载时直接读取，无需请求接口。

### 数据格式

`books-data.js` 里通过全局变量 `window.__MC_BOOKS_RAW__` 暴露数据，支持两种形式：

**（1）单本书**

```javascript
window.__MC_BOOKS_RAW__ = {
  "title": "书名",
  "books": {
    "类别一": [ "词条 | 释义", ... ],
    "类别二": [ "词条A &&& 释义A", ... ]
  }
};
```

**（2）多本书**（当前用法：PET、音基 两本）

```javascript
window.__MC_BOOKS_RAW__ = [
  { "title": "PET", "books": { "Clothes": [ "sweater | 毛衣", ... ], ... } },
  { "title": "音基", "books": { "level1": [ "mf | 中强", ... ], ... } }
];
```

- **书名**：`title`，会出现在「选择书」列表里。
- **类别**：`books` 的 key，会出现在「选择类别」列表里。
- **每行一条卡片**：用 `|` 或 `&&&` 分隔「正面」和「背面」，例如 `word [音标] | 释义`。

### 添加新书（当前为多本书时）

1. 打开 `tools/data/books-data.js`。
2. 在数组里追加一个新对象，格式与 PET、音基 相同：`{ "title": "新书名", "books": { "类别名": [ "词|释义", ... ], ... } }`。
3. 注意在上一本书的 `}` 后加逗号，再写新书对象。
4. 保存后刷新页面，「选择书」列表里会出现新书。

---

## 2. 本地运行与测试

在项目根目录（即本仓库根目录）执行：

```bash
npm start
```

或：

```bash
npx serve . -l 4000
```

然后在浏览器打开：**http://localhost:4000**

- 首页：http://localhost:4000  
- 记忆卡片：http://localhost:4000/tools/memory-cards.html  

（无需 `npm install`，`serve` 通过 npx 直接运行。）

---

## 3. 将最新改动同步到 chiyunlife.github.io

本站内容部署在 **chiyunlife.github.io** 仓库（使用 **master** 分支），根域名 https://chiyunlife.github.io 展示的是该仓库的代码。本仓库（chiyunlifeBlog）与它是两个独立仓库，**只 push 本仓库不会更新线上站**，需要把本仓库的代码推送到 chiyunlife.github.io 的 master 分支。

### 首次：添加远程（只需做一次）

在项目根目录执行：

```bash
git remote add ghpages git@github.com:chiyunlife/chiyunlife.github.io.git
```

若已添加过 `ghpages` 会报错，可忽略。

### 每次发布

改完代码并在本仓库提交后，执行：

```bash
git push origin main        # 推送到 chiyunlifeBlog
git push ghpages main:master   # 将本仓库 main 推送到 chiyunlife.github.io 的 master 分支，触发 Pages 更新
```

或先推本站再推线上：

```bash
git push origin main && git push ghpages main:master
```

若提示被拒绝（remote 有本地没有的提交），且你确认要用当前内容覆盖线上，可强制推送：

```bash
git push ghpages main:master --force-with-lease
```

约 1～2 分钟后访问 https://chiyunlife.github.io 即可看到最新内容。

### 查看当前远程

```bash
git remote -v
```

应能看到 `origin`（chiyunlifeBlog）和 `ghpages`（chiyunlife.github.io）。
