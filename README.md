# YlaxTheme - Shopify 主题说明

这是一个基于 Shopify Online Store 2.0 的定制主题，面向鲜花/礼品类电商场景，包含商品详情增强、节日活动模块、目录页与联系页模板、多语言及搜索能力。

## 项目特点

- 商品详情页深度定制：变体信息、图片放大镜、扩展媒体、推荐商品、详情图文模块。
- 节日营销组件：节日主题商品卡片、翻牌倒计时、悬停弹层展示。
- 自定义页面模板：`catalog` 商品目录页、`contact` 联系页（含地图回退逻辑）。
- 多语言支持：内置 `en`、`zh-CN`、`ja` 等 locale 文件。
- 购物流程支持：购物车抽屉/页面/通知模式、快速加购、批量加购等。
- SEO 与统计：Google Analytics `gtag`、Google Site Verification 已接入模板。

## 技术栈

- Shopify Liquid
- CSS（组件化样式文件）
- 原生 JavaScript（无前端构建步骤）

## 目录结构

```text
.
├─ layout/                 # 全局布局（theme.liquid）
├─ templates/              # 页面/产品/集合等模板与上下文模板
├─ sections/               # 可视化可配置区块
├─ snippets/               # 可复用片段
├─ assets/                 # JS/CSS/图片等静态资源
├─ config/                 # 主题配置 schema 与数据
└─ locales/                # 多语言文案
```

## 核心定制模块

### 1) 商品详情页增强

关键文件：
- `sections/main-product.liquid`
- `snippets/product-variant.liquid`
- `snippets/product-detail-desc.liquid`
- `snippets/recommend-products.liquid`
- `assets/magnifier.js`
- `assets/media-display.js`

能力说明：
- 支持变体相关 metafield（标题、描述、扩展图、视频、配送、材质、包装、设计语言等）。
- 支持图片缩放模式与放大镜参数配置（遮罩颜色、放大倍率、尺寸等）。
- 支持商品详情扩展卡片与关联推荐内容展示。

### 2) 节日营销模块

关键文件：
- `sections/holiday-theme.liquid`
- `sections/count-down.liquid`
- `snippets/card-flipping-effect.liquid`
- `assets/card-popover.js`

能力说明：
- 可配置节日背景图、活动截止时间、倒计时卡片样式。
- 支持选择多个商品进行活动展示。
- 可开启商品悬停弹层，支持延迟与展示方式设置。

### 3) Catalog 页面模板

关键文件：
- `templates/page.catalog.liquid`

能力说明：
- 自定义网格化商品目录展示。
- 支持通过 `page.metafields.catalog.collection_handle` 指定集合来源。
- 支持售罄/促销状态徽标与统一视觉风格。

### 4) Contact 页面模板

关键文件：
- `templates/page.contact.liquid`

能力说明：
- 自定义联系表单、联系信息、社交入口。
- 支持 Google 地图嵌入，加载异常时可回退至高德链接。

## 开发与部署

### 环境要求

- Node.js 18+（推荐）
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- 拥有目标店铺的主题开发权限

### 本地开发

1. 安装 Shopify CLI（如未安装）：

```bash
npm install -g @shopify/cli @shopify/theme
```

2. 登录 Shopify：

```bash
shopify auth login
```

3. 在项目根目录启动本地预览：

```bash
shopify theme dev
```

4. 拉取线上主题（可选）：

```bash
shopify theme pull
```

5. 推送到开发主题：

```bash
shopify theme push
```

## 页面模板使用说明

- 联系页模板：在 Shopify 后台创建页面后，将模板设为 `page.contact`。
- 目录页模板：在 Shopify 后台创建页面后，将模板设为 `page.catalog`。
- 产品模板：默认使用 `templates/product.json`，并在对应 section 中调整 block 与设置。

## 主题设置建议

- 全局配置：`config/settings_schema.json`
- 当前主题数据：`config/settings_data.json`
- 重点配置项：
  - `contact_*`：联系页配色、营业时间、地图链接
  - `catalog_*`：目录页配色
  - `cart_type`：购物车展示模式
  - `predictive_search_*`：预测搜索行为

## 多语言与文案

- 文案文件位于 `locales/`。
- 新增文案时请同步：
  - `locales/en.default.json`
  - `locales/zh-CN.json`
  - `locales/ja.json`
  - 以及对应 schema 翻译文件

## 安全与配置注意事项

- 请勿在仓库中提交真实店铺凭据、访问令牌或敏感配置。
- `config.yml` 通常包含店铺与主题开发配置，建议仅保留本地开发所需信息并加入团队安全规范管理。
- 上线前请确认统计脚本 ID、站点验证信息与线上店铺一致。

## 常见排查

- 倒计时不显示：检查 `countdown_end_date` 格式（例如 `2026-12-31+00:00:00`）。
- Catalog 无商品：检查页面 metafield `catalog.collection_handle` 是否存在且匹配集合 handle。
- Contact 地图异常：检查 `contact_map_embed` 是否可访问，必要时确认 `contact_A_map_embed` 回退链接。
- 商品变体扩展信息缺失：确认对应 product variant 的 metafield 命名空间与 key 与主题设置一致。

## 维护建议

- 对 `sections/` 和 `snippets/` 的改动尽量保持小步提交。
- 涉及 `locales/` 的功能改动同步更新多语言文案。
- 每次发布前至少验证：首页、集合页、商品页、购物车、联系页、目录页。
