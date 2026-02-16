# 部署到 GitHub Pages

## 一、推送代码

在项目根目录（chiyunlifeBlog）执行：

```bash
cd /Users/kevinlma/Documents/blog/chiyunlifeBlog

# 查看变更
git status

# 添加所有修改（含 .nojekyll）
git add .
git commit -m "deploy: 静态工具站，记忆卡片"

# 推送到 GitHub（当前分支为 main）
git push origin main
```

## 二、在 GitHub 上开启 Pages

1. 打开仓库：https://github.com/chiyunlife/chiyunlifeBlog  
2. 点击 **Settings** → 左侧 **Pages**  
3. 在 **Build and deployment** 里：  
   - **Source** 选 **Deploy from a branch**  
   - **Branch** 选 `main`，**Folder** 选 **/ (root)**  
4. 点击 **Save**

等一两分钟，页面顶部会显示访问地址，例如：

- **项目站**：`https://chiyunlife.github.io/chiyunlifeBlog/`

## 三、若要用根域名 chiyunlife.github.io

若希望访问 `https://chiyunlife.github.io`（不带 `/chiyunlifeBlog`）：

1. 在 GitHub 新建仓库，名称为 **chiyunlife.github.io**（用户名.github.io）  
2. 把 chiyunlifeBlog 目录下的**所有文件**（不含 .git）复制到该仓库根目录  
3. 在该仓库里执行：`git add .` → `git commit -m "init"` → `git push origin master`  
4. 在该仓库 **Settings → Pages** 中，Source 选 **Deploy from a branch**，Branch 选 `master`，Folder 选 **/ (root)**  

之后访问 `https://chiyunlife.github.io` 即可。
