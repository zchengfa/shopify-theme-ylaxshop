# YlaxTheme - Shopify 主题说明

这是一个基于 Shopify Online Store 2.0 的定制主题，面向鲜花/礼品类电商场景，包含商品详情增强、节日活动模块、目录页与联系页模板、多语言及搜索能力。

## 项目概述

YlaxTheme 是一个专为鲜花和礼品电商设计的 Shopify 主题，提供了丰富的定制功能和优化的用户体验。主题采用模块化设计，支持可视化配置，可根据不同节日和促销活动快速调整页面风格。

## 核心功能

### 1. 商品详情页增强

**关键文件：**
- `sections/main-product.liquid`
- `snippets/product-variant.liquid`
- `snippets/product-detail-desc.liquid`
- `snippets/recommend-products.liquid`
- `assets/magnifier.js`
- `assets/media-display.js`

**能力说明：**
- 支持变体相关 metafield（标题、描述、扩展图、视频、配送、材质、包装、设计语言等）
- 支持图片缩放模式与放大镜参数配置（遮罩颜色、放大倍率、尺寸等）
- 支持商品详情扩展卡片与关联推荐内容展示
- 响应式设计，适配不同设备屏幕

### 2. 节日营销模块

**关键文件：**
- `sections/holiday-theme.liquid`
- `sections/count-down.liquid`
- `snippets/card-flipping-effect.liquid`
- `assets/card-popover.js`

**能力说明：**
- 可配置节日背景图、活动截止时间、倒计时卡片样式
- 支持选择多个商品进行活动展示
- 可开启商品悬停弹层，支持延迟与展示方式设置
- 支持翻牌倒计时效果，增强节日氛围

### 3. Catalog 页面模板

**关键文件：**
- `templates/page.catalog.liquid`

**能力说明：**
- 自定义网格化商品目录展示
- 支持通过 `page.metafields.catalog.collection_handle` 指定集合来源
- 支持售罄/促销状态徽标与统一视觉风格
- 优化的商品卡片布局，提升浏览体验

### 4. Contact 页面模板

**关键文件：**
- `templates/page.contact.liquid`

**能力说明：**
- 自定义联系表单、联系信息、社交入口
- 支持 Google 地图嵌入，加载异常时可回退至高德链接
- 响应式设计，适配不同设备屏幕
- 表单验证与提交反馈

### 5. 购物流程优化

**关键文件：**
- `sections/cart-drawer.liquid`
- `assets/cart.js`
- `assets/quick-add.js`
- `snippets/batch-add-cart.liquid`

**能力说明：**
- 支持购物车抽屉/页面/通知三种展示模式
- 快速加购功能，提升转化效率
- 批量加购功能，方便用户快速下单
- 购物车实时更新与数量调整
- 支持购物车备注功能

### 6. 搜索与导航

**关键文件：**
- `sections/predictive-search.liquid`
- `assets/predictive-search.js`
- `snippets/header-menu.liquid`

**能力说明：**
- 预测搜索功能，支持显示商品、集合等结果
- 可配置搜索结果展示选项（供应商、价格等）
- 响应式导航菜单，支持移动端汉堡菜单
- 多级别下拉菜单，提升导航体验

## 技术栈

- **Shopify Liquid**：模板语言，用于构建动态页面
- **CSS**：组件化样式文件，采用模块化设计
- **原生 JavaScript**：无前端构建步骤，直接在浏览器中运行
- **Shopify CLI**：开发与部署工具

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

## 开发与部署

### 环境要求

- Node.js 18+（推荐）
- [Shopify CLI](https://shopify.dev/docs/apps/tools/cli)
- 拥有目标店铺的主题开发权限

### 本地开发

1. **安装 Shopify CLI**（如未安装）：

```bash
npm install -g @shopify/cli @shopify/theme
```

2. **登录 Shopify**：

```bash
shopify auth login
```

3. **在项目根目录启动本地预览**：

```bash
shopify theme dev
```

4. **拉取线上主题**（可选）：

```bash
shopify theme pull
```

5. **推送到开发主题**：

```bash
shopify theme push
```

## 页面模板使用说明

- **联系页模板**：在 Shopify 后台创建页面后，将模板设为 `page.contact`
- **目录页模板**：在 Shopify 后台创建页面后，将模板设为 `page.catalog`
- **产品模板**：默认使用 `templates/product.json`，并在对应 section 中调整 block 与设置
- **集合模板**：使用 `templates/collection.json`，支持过滤和排序功能

## 主题设置指南

### 全局配置

- **配置文件**：`config/settings_schema.json`
- **当前主题数据**：`config/settings_data.json`

### 重点配置项

- **Logo 设置**：`logo`、`logo_width`
- **布局设置**：`page_width`、`spacing_sections`、`spacing_grid_horizontal`、`spacing_grid_vertical`
- **颜色设置**：`color_schemes`（背景、文本、按钮等颜色）
- **购物车设置**：`cart_type`（抽屉/页面/通知）、`show_vendor`、`show_cart_note`
- **搜索设置**：`predictive_search_enabled`、`predictive_search_show_vendor`、`predictive_search_show_price`
- **徽标设置**：`badge_position`、`badge_corner_radius`、`sale_badge_color_scheme`、`sold_out_badge_color_scheme`
- **卡片设置**：`card_style`、`card_image_padding`、`card_text_alignment`、`card_color_scheme`

## 多语言支持

- **文案文件**：位于 `locales/` 目录
- **支持语言**：
  - English (`en.default.json`)
  - 简体中文 (`zh-CN.json`)
  - 日语 (`ja.json`)
  - 俄语 (`ru.json`)
  - 世界语 (`eo.json`)

- **新增文案注意事项**：
  - 同步更新所有语言文件
  - 保持文案键名一致
  - 注意翻译的准确性和文化适配

## 性能优化建议

1. **图片优化**：
   - 使用 WebP 格式图片
   - 合理设置图片尺寸和质量
   - 实现图片懒加载

2. **代码优化**：
   - 减少 JavaScript 执行时间
   - 优化 CSS 选择器
   - 避免不必要的 DOM 操作

3. **加载优化**：
   - 合理使用浏览器缓存
   - 优化资源加载顺序
   - 减少 HTTP 请求数量

4. **Shopify 特定优化**：
   - 合理使用 metafield，避免过度使用
   - 优化 Liquid 模板，减少渲染时间
   - 使用 Shopify 的 CDN 优势

## 安全最佳实践

1. **配置安全**：
   - 请勿在仓库中提交真实店铺凭据、访问令牌或敏感配置
   - `config.yml` 通常包含店铺与主题开发配置，建议仅保留本地开发所需信息并加入团队安全规范管理
   - 上线前请确认统计脚本 ID、站点验证信息与线上店铺一致

2. **代码安全**：
   - 避免使用内联脚本，尤其是包含用户输入的内容
   - 对用户输入进行适当的验证和转义
   - 遵循 Shopify 的安全开发指南

3. **部署安全**：
   - 使用 HTTPS 协议
   - 定期更新主题代码，修复安全漏洞
   - 监控异常访问和可疑活动

## 常见问题排查

1. **倒计时不显示**：
   - 检查 `countdown_end_date` 格式（例如 `2026-12-31+00:00:00`）
   - 确认活动时间设置正确

2. **Catalog 无商品**：
   - 检查页面 metafield `catalog.collection_handle` 是否存在且匹配集合 handle
   - 确认集合中是否有商品

3. **Contact 地图异常**：
   - 检查 `contact_map_embed` 是否可访问
   - 必要时确认 `contact_A_map_embed` 回退链接
   - 检查网络连接是否正常

4. **商品变体扩展信息缺失**：
   - 确认对应 product variant 的 metafield 命名空间与 key 与主题设置一致
   - 检查 metafield 值是否正确设置

5. **购物车功能异常**：
   - 检查浏览器控制台是否有 JavaScript 错误
   - 确认购物车设置是否正确
   - 测试不同浏览器和设备

## 维护建议

1. **代码管理**：
   - 对 `sections/` 和 `snippets/` 的改动尽量保持小步提交
   - 涉及 `locales/` 的功能改动同步更新多语言文案
   - 使用版本控制工具（如 Git）管理代码变更

2. **测试流程**：
   - 每次发布前至少验证：首页、集合页、商品页、购物车、联系页、目录页
   - 测试不同设备和浏览器的兼容性
   - 测试不同网络环境下的加载性能

3. **更新策略**：
   - 定期检查 Shopify 主题更新和最佳实践
   - 及时修复已知问题和安全漏洞
   - 收集用户反馈，持续优化用户体验

4. **文档维护**：
   - 保持 README.md 文件的更新
   - 为复杂功能添加详细的注释和文档
   - 建立团队开发规范和最佳实践

## 贡献指南

欢迎对 YlaxTheme 进行贡献！如果您有任何改进建议或功能请求，请：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

本主题采用 MIT 许可证。详情请参阅 LICENSE 文件。

## 联系方式

如果您有任何问题或需要支持，请联系：

- 邮箱：your-email@example.com
- 店铺：your-shop.myshopify.com

---

**YlaxTheme** - 为鲜花和礼品电商打造的专业 Shopify 主题
