# Wire Mesh News · 开发交接说明（V2.4 → 代码化）

> 本文是设计阶段到开发阶段的交接基线。任何新对话、新设备、上下文丢失后，先读这一份。
> 规格全文见 `Wire_Mesh_News_Media_Framework_v2.4.docx`，受控词表见 `wmn_vocabularies.json`，设计画布见下方链接。

## 1. 三份依据

| 依据 | 位置 | 用途 |
|---|---|---|
| 设计画布（Claude Design，41 块画板） | https://claude.ai/artifact/7BEwAS24bLD6Fq9TqMzqrm | 所有页面的视觉与交互真源；画板文件为 `project/*.dc.html`，内含完整 HTML/CSS/SVG，可直接搬 |
| 框架文档 V2.4 | Project 文档 `Wire_Mesh_News_Media_Framework_v2.4.docx` | 页面清单、路由、显示规则、广告上限、法律风险、政策页正文 |
| 受控词表 | Project 文档 `wmn_vocabularies.json`（31 张表） | 国家 / 地区 / 组织类型 / 产品 / 材料 / 认证 / 标准机构 / 栏目 / 状态等枚举；**存码不存名** |

代码仓库：https://github.com/Kingcats-Fence-Limited/Wire-Mesh-News （默认分支 `main`）

## 2. 已拍板的技术决定

- **Next.js 15 App Router + TypeScript + Tailwind CSS**；包管理 pnpm
- 字体：`next/font/google` 加载 **Bricolage Grotesque**（800，标题）与 **Manrope**（500/700/800，其余全部，含数字；开启 `tnum`、`ss01`）。全站不用等宽字体
- 部署：**Vercel**；英文站，`<html lang="en">`，无 i18n、无语言切换、无翻译插件
- **第一期（静态可浏览版）**：内容为本地 MDX / JSON 假数据；不接 CMS、不建数据库、不做登录与表单后端
- 第二期再接 CMS（Sanity 或 Payload）+ Postgres；第三期做账号 / 认领 / 投稿 / 定向联系；行情数据在授权签署后接入
- 代码英文；给用户的解释用中文

## 3. 设计令牌（从画板抽取）

```
颜色
  ink        #15161C   主文字 / 深色底
  red        #E5242F   品牌红
  red-deep   #C41822   深红（按钮按下、徽标文字）
  red-dark   #FF4A54   暗色模式下的红色文字
  slate      #555A6B   次要文字
  grey-mid   #8A8F9E   弱化文字 / 图标
  line       #E6E6EC   分隔线、描边
  line-soft  #ECEDF1   表格内线
  paper      #F6F6F8   浅灰底
  paper-2    #FAFAFB   更浅的灰底
  dark-2     #1C1E27   暗色模式次级底
  status     current #F0F7F2/#1E6B35 · review #FFF4E2/#8A5A08 · withdrawn #F2F3F5/#6E7384 · draft #FFF1F2/#C41822
  mark       #FFE8B0   搜索高亮

字号（桌面）  正文 15–15.5px / 行高 1.6–1.75；meta 12.5px；kicker 10–11px 字距 .12em 全大写；H1 34–40px 字距 -.045em
圆角        卡片 14–16px；输入框 9–10px；按钮与芯片 999px；徽标 3–4px
容器        max-width 1240px，左右 padding 32–40px
断点        ≥1200 三栏 · 900–1199 两栏 · <900 单栏；手机 390px 基准；触控目标 ≥44×44；底部固定元素距底 28px
网格底纹    SVG <pattern>：pChain(菱形) pWeld(方格+红焊点) pWeldQ(无红点) pWoven(波) pGrate(格栅) pPerf(圆孔) pExp(扩张网)
            应用领域映射：Architecture→pExp · Industrial→pWeld · Agriculture→pWoven · Energy→pPerf · Sports→pChain
社媒图标    LinkedIn / YouTube / X / WhatsApp / RSS，Simple Icons 官方路径，42px 圆钮；hover / :active / :focus-visible 整颗变红
标识        wordmark「wire mesh」+ 红底白字「news」块；图标 symbol #w1（波形 + 红点）
```

## 4. 路由与画板对照

| 路由 | 页面 | 画板 |
|---|---|---|
| `/` | 首页 | Home-A |
| `/{section}/` | 栏目页（news / market-insights / applications / technical-guides / buying-guides） | Category-B |
| `/{section}/{slug}` | 文章页 | Article-C |
| `/letters/`、`/letters/{slug}` | 来信与专栏列表、单封来信 | Letters-LT |
| `/directory/`、`/directory/{company}` | 企业名录、企业详情 | Directory-D、Company-E |
| `/directory/{company}/claim` | 企业认领（第三期） | Claim-U |
| `/events/` | 展会日历 | Events-F |
| `/standards/`、`/standards/{no}` | 标准索引、单条标准页（Follow + Change log） | Standards-Y |
| `/market-data/`、`/market-data/methodology` | 行情页、方法说明页 | Market-X、Method-X2 |
| `/topics/{slug}` | 专题页 | Topic-L |
| `/search?q=` | 搜索页（与浮层同接口） | Search-K、SearchOv-W |
| `/about/`、`/contact/`、`/policies/*` | About、Contact、政策页模板 | About-N、Contact-O |
| `/authors/{name}` | 作者页 | Author-P |
| `/advertise/` | 商业合作 | Advertise-I |
| `/signin/`、`/register/`、`/account/*`、`/submit/` | 账号相关（第三期） | Auth-Q、Account-G、Submit-H |
| 404 / 500 / 403 / 410 | 错误页 | Error-R |
| 全局组件 | 超级菜单与页脚、广告位、暗色模式、Cookie 横幅与回到顶部、定向联系表单 | Nav-J、Ads-S、Dark-T、Cookie-Z、RFQ-V |
| 响应式 | 手机端 13 屏 | Mobile-M |

## 5. 开发时不能违反的规则（摘自 V2.4）

1. 页面上只出现 **Wire Mesh News**；运营主体全称只在 About / Privacy / Terms；页脚版权行 `© {year} Wire Mesh News.`，年份服务端渲染
2. 报头定位语唯一：*Independent news, markets and standards for the global wire mesh industry*
3. 导航：五个编辑栏目（超级菜单）｜ Directory · Events · Standards；Market data 归 Market Insights 下，不占一级导航
4. 广告：首屏（头条之前）不放广告；上限 首页 4 展示 + 3 原生、栏目 3+1、文章 3、名录 2、来信列表 1；无广告区：政策页、标准页、方法说明页、单封来信页、投稿与认领流程、账号、错误页、搜索浮层；订阅用户不见展示广告；全部 `rel="sponsored"` + ADVERTISEMENT / SPONSORED 标
5. Cookie：同意前不加载非必要脚本；Accept all 与 Reject all 同等显眼；无预勾选；页脚 Cookie settings 常驻
6. 标准索引：只收编号、标题、机构、状态与编辑自撰摘要；**不转载条文、不提供下载**；购买链接指向发布机构
7. 行情：署名条紧贴数据；DELAYED / AS OF 标；LIVE / STALE / UNAVAILABLE 三态，**绝不显示 0 或空白**；授权未签前首页行情区整体不渲染；不开放接口与下载
8. Letters：列表只给摘要；OPINION 标识不可省；单封页无广告
9. 搜索：浮层与搜索页共用同一检索接口与渲染组件；七类标识 ARTICLE / LETTER / OPINION / COMPANY / STANDARD / TOPIC / EVENT；搜索页 noindex；行情数字不进索引
10. 受控字段：国家 / 地区 / 组织类型 / 产品 / 材料 / 认证等全部下拉，取自词表；城市是唯一自由文本地理字段
11. 名录：自然条目等宽等权；付费位单独分区并标识（第一期不启用）
12. 不用任何第三方版权图片；图片全部原创或已授权

## 6. 实施顺序

1. 仓库骨架 + 设计令牌（`tailwind.config`、`globals.css`、字体）+ `components/ui` 基础件（按钮、芯片、徽标、卡片、kicker、section 标题、网格底纹、社媒圆钮、广告位占位）→ **给用户确认**
2. 全局：页眉（功能条 / 报头 / 导航 / 超级菜单 / 搜索浮层）、完整页脚、Cookie 横幅、回到顶部、暗色模式切换
3. 首页 + 文章页（假数据）→ **给用户确认风格**
4. 栏目页、专题页、作者页、About / Contact / 政策页模板、错误页
5. 名录列表与详情、展会日历
6. 标准索引与单条页、Letters 列表与单封页、行情页与方法说明页（三态假数据）、搜索页
7. 响应式按 Mobile-M 逐页核对；无障碍自检；Vercel 预览

## 7. 文件交付规则

生成的文件只在用户明确说"保存"后，才写入其电脑文件夹 `C:\Users\东哥\Desktop\金狮团队\正式归档网站资料\wiremeshnews.com\统一的信息文档`。代码一律推到 GitHub 仓库。
