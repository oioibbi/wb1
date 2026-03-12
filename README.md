# 随机网站（GitHub Pages）

一个纯静态网页：随机抽取网站并跳转，支持「偏向中文站点」与「类别筛选」。

## 文件说明

- `index.html`：入口（已内联 CSS，避免 Pages 上路径/大小写导致样式丢失）
- `app.js`：全部逻辑（无构建、无依赖）
- `sites-zh-hot100.txt`：热门中文/中国用户常用 Top 100（带 `#tag`，自动加载）
- `sites-extra.txt`：你自己的扩展大列表（建议 1000+ 行，自动加载）
- `style.css`：样式参考（实际以 `index.html` 内联为准）

## 本地打开

直接双击打开 `index.html` 即可使用。

## 扩充网站列表（推荐）

把网站放进仓库根目录的文本文件里，每行一个域名或 URL，可带 `#tag`：

- `example.com`
- `https://example.com/path`
- `#novel #zh example.com`（`#zh/#cn/#中文` 会归一化为 `lang-zh`）
- `#adult pornhub.com`

然后提交并推送到 GitHub，等 GitHub Pages 自动部署后刷新网页即可生效。

## 类别扩展

类别本质上就是 tag：
- 给站点加上 `#anime/#novel/#games/#news/...` 等 tag
- 如果你想让某个新 tag 出现在页面的「类别」按钮里，在 `app.js` 里把它加入 `CATEGORY_TAGS`

## GitHub Pages 部署

Settings → Pages：
- Source：Deploy from a branch
- Branch：`main` / `/(root)`

