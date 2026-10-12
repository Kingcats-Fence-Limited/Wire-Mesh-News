**Wire Mesh News 独立行业媒体建设框架**

版本 V2.4　\|　日期 2026 年 10 月 12 日　\|　适用人员：开发 设计 编辑
运营 法务 项目负责人

本文件将 wiremeshnews.com
确定为单独建设、单独运营的丝网与金属网行业媒体，统一栏目、页面、通用文案、用户互动、编辑审核、商业规则、合规要求与上线验收。网站以新闻、市场观察、技术、应用与采购知识为核心；采购知识属于编辑内容，不是销售内容。

V2.3 是在 V2.2
基础上的一次全面补齐，重点有三：第一，把每个页面的用途、必备元素与通用文案写定，开发与编辑不再需要口头确认；第二，把全站会反复出现的英文文案（版权行、披露句、免责句、标识）统一成固定句式，不允许各页自行发挥；第三，新增完整的法律风险清单与对应措施，并逐条指明落在哪一页、由谁负责。

V2.4 是对 V2.3 的四处补齐：Letters & Opinion
有了独立落地页与单封来信页；行情数据有了独立的 Methodology
方法说明页和「推动因素」文章模块；标准索引单条页增加关注提醒与变更记录，文章正文中的标准号自动链接到索引；搜索页与搜索浮层统一为同一套类型标识、高亮与接口。手机端同步到
13 屏。

**本文件不是法律意见。第 04
节中标注「须律师定稿」的三份文本（Privacy、Terms、Cookie
Policy）必须由执业律师按实际运营主体、服务器所在地与目标市场审阅后再上线。**

**00　版本变更记录**

**V2.3 → V2.4**

| **项目**             | **V2.3**                                                    | **V2.4**                                                                                                                                                                                                                                                                          |
|----------------------|-------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Letters & Opinion    | 只有首页模块与显示规则                                      | 新增落地页 /letters/（画板 LT）：列表页（Letters / Columns 双标签、按栏目与角色筛选、只给摘要）、单封来信页（正文、所回应文章、编辑回复、再回信、同文其他来信）、十条显示 / 审核 / 法律规则；来信页进 sitemap 与独立 RSS                                                          |
| Market data 方法说明 | 只在 5.1 要求「须有 Methodology 页」                        | 新增独立页 /market-data/methodology（画板 X2）：七节英文正文可直接用；入口为首页 METHODOLOGY →、每个数字旁的延迟 / AS OF 徽标、行情页三段文字、文章内嵌图表；归 Market Insights 编辑维护，法务只审署名与免责两节；授权未签前首页行情区整体不显示                                  |
| Market data 页       | 序列表 + 图表                                               | 新增 WHAT MOVED THE MARKET 模块：按当前序列显示最近三篇 Market Insights，由编辑在文章后台勾选序列代码挂接；单序列页第一期不做                                                                                                                                                     |
| 标准索引单条页       | 摘要、书目、相关、认证企业                                  | 新增 Follow this standard（登录后关注，仅在编辑确认的状态变更 / 新版本 / 撤回时发一封邮件）与 Change log 变更记录（每条含日期、类型、一句说明、来源，只追加不删）；维护规则表加两行                                                                                               |
| 文章内标准号         | 纯文字                                                      | 自动识别并链接到标准索引：加粗 + 红色点线下划线样式；行内规格卡的标准号可点并标 IN STANDARDS INDEX →；编辑可关闭单处链接                                                                                                                                                          |
| 搜索页 /search/      | 独立版式，仅按栏目筛选，只列文章与企业                      | 与浮层统一：同一套七类标识（ARTICLE / LETTER / OPINION / COMPANY / STANDARD / TOPIC / EVENT）、同一个高亮色、同一个检索接口与渲染组件；筛选分 TYPE + SECTION + 时间，全部写进 URL；空结果给替换词 + 放宽筛选的预计数；行情数字不进搜索，侧栏给 Market data 出口；有结果也 noindex |
| 搜索浮层             | 四类标识，三个计数芯片                                      | 补 LETTER / EVENT 标识与 Letters / Standards 计数芯片，与搜索页一致                                                                                                                                                                                                               |
| 手机端               | 9 屏                                                        | 13 屏：新增来信列表、标准详情（关注 + 变更记录）、行情页（序列卡 + 推动因素 + 署名条）、搜索结果页（类型芯片横滑 + 筛选底部弹层）                                                                                                                                                 |
| 命名统一             | 超级菜单写「Standards bodies」，浮层写「Standards tracker」 | 全站统一为 Standards Index                                                                                                                                                                                                                                                        |

**V2.2 → V2.3**

| **项目**                 | **V2.2**                       | **V2.3**                                                                                                |
|--------------------------|--------------------------------|---------------------------------------------------------------------------------------------------------|
| Standards Index 标准索引 | 未提及                         | 新增独立栏目与页面（画板 Y）。只收编号、标题与编辑自撰摘要，不转载标准正文，不提供下载                  |
| Market data 行情         | 数据来源未定，预留人工整理方案 | 确定走第三方授权（交易所 + 价格机构）。新增授权要点、展示规则、三种数据状态与技术架构（画板 X）         |
| Mesh Finder 选型器       | 首页曾计划加入                 | 撤销。组合爆炸、落地页稀薄、与名录「不按细规格筛选」的决定冲突，改由 Applications 区承担按网型导航      |
| Opinion 专栏             | 首页独立模块                   | 改为 Letters & Opinion，以读者来信为主、专栏为辅；编辑部不写专栏；来信少于 3 条或最新超过 60 天整块隐藏 |
| 企业名录展示             | 首条跨两列重点展示             | 取消。所有自然条目等宽等权，避免被读作付费位。新增独立的 Sponsored listing 区（第一期不启用）           |
| 广告库存                 | 四种固定位                     | 扩为八种，新增 Half page、正文插位、专题赞助、页脚合作伙伴条；同时写定每页硬上限与无广告区              |
| Cookie 同意              | 仅在政策页提及                 | 新增完整设计（画板 Z）：横幅、偏好面板、分类清单、留痕与重新征询规则；接受与拒绝同等显眼                |
| 回到顶部                 | 未提及                         | 新增。文章页带阅读进度环，遇页脚自动上移，点击后焦点交还页眉                                            |
| 页脚                     | 五列链接                       | 统一为完整版：周报条 + 五栏 + 法务条（年份自动、明暗切换、Cookie settings、Top）                        |
| 通用文案                 | 分散在各页                     | 集中到第 01 节，统一句式，禁止各页自行改写                                                              |
| 法律风险                 | 分散提及                       | 新增第 03 节完整清单：十类风险、对应措施、落点页面与责任人                                              |

**01　站点定位与全站通用规则**

**1.1　定位与读者**

面向国际采购人员、工程师、规格师、承包商、经销商与行业从业者，提供丝网与金属网的资讯、技术解释、应用案例、标准动态与采购知识。品牌统一使用简称
Wire Mesh News；公司全称仅出现在页脚版权行之外的 About / Privacy / Terms
三页。

**报头定位语（固定，不得各页改写）：**

> Independent news, markets and standards for the global wire mesh
> industry

只有这一句，不设第二行；页脚品牌栏用同一句。

**1.2　栏目结构**

| **层级**         | **内容**                                                                                                                                                                                           |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 编辑栏目（五个） | News 行业新闻 / Market Insights 市场观察 / Applications 应用领域 / Technical Guides 技术指南 / Buying Guides 采购指南                                                                              |
| 资源栏目（四个） | Company Directory 企业名录 / Events Calendar 展会日历 / Standards Index 标准索引 / Market data 行情数据                                                                                            |
| 读者参与         | Letters & Opinion 来信与专栏 / Submit an Article 投稿 / Topics 专题                                                                                                                                |
| 应用领域（五类） | Architecture & Infrastructure / Industrial & Security / Agriculture & Horticulture / Energy & Environment / Sports & Lifestyle。红字为典型使用场景，不是产品名；底纹取该领域常见网型，仅作视觉标识 |
| 名录分类（五类） | Fencing systems / Reinforcement & civil / Filtration & screening / Access & walkway / Materials & services。按用途分，不按具体规格切分                                                             |

**1.3　全站通用规则**

| **规则**        | **要求**                                                                                                                                                                                                                                         |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 语言            | 只做英文站。HTML 根标签固定 lang="en"，不输出 hreflang，不接自动翻译插件，不设语言或地区切换                                                                                                                                                     |
| 品牌称呼        | 页面上一律用 Wire Mesh News；全称只在 About / Privacy / Terms 出现                                                                                                                                                                               |
| 页脚版权        | © {年份} Wire Mesh News. All rights reserved. 年份由服务端渲染时按服务器时区算好写进 HTML，不靠前端 JS 填                                                                                                                                        |
| 运营披露        | 运营主体、所有权关系与数据控制者统一写在 About / Privacy / Terms 三页，页脚不重复                                                                                                                                                                |
| Opinion 与 News | 列表页与详情页都必须带标识，不混排；投稿作者观点不代表编辑部立场                                                                                                                                                                                 |
| 赞助内容        | 标 Sponsored Content，外链加 rel="sponsored"，与编辑内容视觉上可区分                                                                                                                                                                             |
| 排序与付费      | 收录、排序、搜索结果与编辑报道一律不接受付费影响                                                                                                                                                                                                 |
| 无障碍          | 目标 WCAG 2.1 AA：正文对比度 ≥ 4.5:1，可点区域 ≥ 44×44，全站可键盘操作，图片有替代文本，尊重「减少动态效果」设置                                                                                                                                 |
| 暗色模式        | 默认跟随系统，页脚可手动切换并记住。红色作为文字时在暗色下改用 \#FF4A54                                                                                                                                                                          |
| 社媒            | 固定五个：LinkedIn（主）、YouTube、X、WhatsApp 频道、RSS。页脚品牌栏与文章分享行使用官方矢量字形，未开通的账号不显示；Header 不放社媒。Facebook / Instagram 后期靠同步发布接入，不单独运营                                                       |
| 受控字段        | 国家、省州、机构类型、产品、材质、认证类型与机构、员工规模、成立年份、出口市场等一律下拉选择，不手填；选项来自编辑维护的词表（Wire_Mesh_News_Vocabularies.xlsx / wmn_vocabularies.json），存码不存名；城市为唯一联想输入字段，新值经编辑确认入库 |
| 导航            | 五个编辑栏目（超级菜单）｜ Directory · Events · Standards。Market data 归在 Market Insights 下，不单独占导航位                                                                                                                                   |

**1.4　全站通用文案块（固定句式，直接使用）**

以下句子在多处重复出现，必须统一。改动需经编辑与法务同意，改后全站同步。

**① 页脚版权行**

> © {year} Wire Mesh News. All rights reserved.　About this publication

**② 关联披露（名录中与运营方有关系的企业）**

> Relationship disclosure: this company is related to the publisher of
> Wire Mesh News. Its listing is maintained to the same standard as
> every other entry and its position is not affected. See About.

**③ 赞助标识**

> SPONSORED CONTENT — paid for and supplied by the named company. Our
> editorial team had no role in writing it.
>
> ADVERTISEMENT
>
> SPONSORED LISTING — a paid placement. It does not affect the ranking
> of any company in this directory.

**④ 技术内容免责**

> This article is general information for specifiers and buyers. It is
> not engineering advice for a specific project, and it does not replace
> the current official text of any standard. Always verify against the
> standard itself and, where the application is safety-critical, against
> a qualified engineer.

**⑤ 标准摘要免责**

> This summary is written by our editors and is not the standard. It has
> no official status. Always work from the current official text,
> available from the issuing body. The status shown is our last verified
> check, not a certification of validity.

**⑥ 行情数据免责与署名**

> Prices are indicative and for reference only. They are not an offer, a
> quotation, or investment advice. Zinc: LME, delayed 30 minutes.
> Assessed prices: © {provider}, republished under licence.
> Redistribution, scraping and export are not permitted.

**⑦ 更正说明（文章内）**

> CORRECTION — {date}: {what was wrong, what it now says}. We do not
> delete the original text. See our Corrections Policy.

**⑧ 企业资料来源标注**

> SELF-REPORTED — supplied by the company and not independently
> verified.
>
> VERIFIED — checked by our editors against {source} on {date}.

**⑨ 定向联系表单（发送前显示）**

> This message goes only to {company}. We do not forward it to any other
> company, we charge nothing for it, and we cannot guarantee a reply.
> Wire Mesh News is not a party to any transaction that follows.

**⑩ 人工智能使用声明（About 页）**

> We may use software tools, including AI, to help with research,
> transcription and first drafts. Every article is written, checked and
> signed off by a named human editor, who is responsible for it. We do
> not publish machine-generated text as if it were reported work.

**02　页面清单与逐页说明**

共 25
个页面类型。下表给出路径、用途与对应设计画板；随后逐页列出必备元素。

| **页面**             | **路径**                   | **用途**                                                                                     | **对应画板** |
|----------------------|----------------------------|----------------------------------------------------------------------------------------------|--------------|
| 首页                 | /                          | 当期全貌：头条、要闻、行情、三栏新闻、来信与专栏、应用入口、技术指南、专题、采购与名录、订阅 | A            |
| 栏目页               | /{section}/                | 单个栏目的汇总与子栏目入口                                                                   | B            |
| 文章页               | /{section}/{slug}          | 正文、来源、更正、作者、评论、相关阅读                                                       | C            |
| 企业名录             | /directory/                | 按用途分类浏览与筛选企业                                                                     | D            |
| 企业详情页           | /directory/{company}       | 企业资料、产品图、认证、联系方式（登录可见）                                                 | E            |
| 展会日历             | /events/                   | 展会列表与详情，与 News 互链                                                                 | F            |
| 用户中心             | /account/                  | 资料、稿件、评论、收藏、消息、订阅与账单、通知、账号设置                                     | G            |
| 投稿页               | /submit/                   | 投稿编辑器与提交流程（需登录）                                                               | H            |
| 商业合作             | /advertise/                | 广告与赞助合作说明与申请表单                                                                 | I            |
| 超级菜单与页脚       | 组件                       | 四区超级菜单与完整版页脚                                                                     | J            |
| 搜索页               | /search/                   | 搜索结果与空结果态，与浮层同一套类型标识与接口                                               | K            |
| 专题页               | /topics/{slug}             | 围绕一个主题的长期聚合                                                                       | L            |
| 手机端               | 响应式                     | 手机端布局与导航（首页长图 + 13 屏）                                                         | M            |
| About                | /about/                    | 我们是谁、怎么工作、谁在运营、钱从哪来                                                       | N            |
| Contact 与政策页模板 | /contact/、/policies/\*    | 按事由分流的联系方式与政策页统一版式                                                         | O            |
| 作者页               | /authors/{name}            | 作者简介、专长、社媒与公开邮箱、已发表文章                                                   | P            |
| 注册登录             | /signin/、/register/       | 注册、登录、找回密码、真实邮箱四道校验                                                       | Q            |
| 错误页               | 404 / 500 / 403 / 410      | 错误态与出口                                                                                 | R            |
| 广告位与订阅弹窗     | 组件                       | 八种广告位、投放清单与订阅弹窗                                                               | S            |
| 暗色模式             | 组件                       | 明暗色标映射与切换规则                                                                       | T            |
| 企业认领             | /directory/{company}/claim | 认领申请、验证、审核、企业端编辑与认证锁定                                                   | U            |
| 定向联系表单         | 组件                       | 单一收件人的联系表单与企业端消息箱                                                           | V            |
| 搜索浮层             | 组件                       | 点击放大镜后的整宽浮层：空态、输入中、无结果                                                 | W            |
| 行情数据             | /market-data/              | 授权价格序列、图表、三种数据状态                                                             | X            |
| 标准索引             | /standards/                | 标准清单、单条标准页、等效对照表                                                             | Y            |
| Cookie 同意          | 组件                       | 横幅、偏好面板、页脚入口、回到顶部                                                           | Z            |
| Letters & Opinion    | /letters/、/letters/{slug} | 来信与专栏列表、单封来信页、写信入口                                                         | LT           |
| 行情方法说明         | /market-data/methodology   | 序列定义、延迟、自有调查口径、署名、免责、更正                                               | X2           |

**2.1　首页 /**

**模块顺序（自上而下，内容不足的模块整块隐藏，不留空壳）：**

- 顶部功能条：本周更新数 · LIVE 快讯 · Newsletter / RSS · 明暗切换

- 报头：左侧星期 + 日期 +
  上海／汉堡／休斯顿三地时钟；中间字标；右侧搜索、Sign In、Subscribe
  free；下方定位语一句

- 一级导航：五个编辑栏目（超级菜单）｜ Directory · Events · Standards

- 导航下细横幅广告 970 × 90（高度限 90，不压头条）

- 头条：图片拼版（1 大 + 2 小），标题压在图上；下方 The brief
  四条横排（浅色）

- 线径渐变带（视觉分隔）

- Market snapshot：四格行情 + 12 周走势 + 延迟标 + 取数时间 + 授权署名条

- The industry in numbers：四个大数字，每个挂来源

- Latest：报纸式三栏，主稿与次稿带缩略图（网型底纹占位），赞助卡、Standards
  watch、Most read（带小图）、侧栏广告

- Letters & Opinion：来信为主、专栏为辅（显示规则见 2.17）

- Applications：五个领域入口卡（图标 + 三条典型场景 + 网型底纹）+ LATEST
  IN APPLICATIONS 四张图文卡

- Technical Guides：三张带图编号卡 + More guides 两列六条

- 横幅广告位（970 ×
  120）；另一条横幅在行情与数字带之间；名录版块左栏一个 MPU；Buying
  Guides 文章流一张赞助卡——首页共 6 个位，均不进首屏

- 专题带：红底 + 焊接网底纹

- Market Insights ｜ Buying Guides 双栏文章流：各 1 主稿（16:9 图）+ 4
  条带缩略图；Market Insights 流中插一张赞助卡

- Company Directory
  版块：左侧定位、三个数字、五个用途入口、认领链接、MPU；右侧四张企业卡，标注「自然收录，与付费无关」，按最近更新排序

- 横幅广告位 970 × 120（名录与订阅之间）

- 订阅 + 投稿邀请

- 合作伙伴 logo 条

- 完整版页脚 + 右下角回到顶部

**首页不设询价入口、不设供应商搜索、不设采购需求发布。首页每个菜单栏目都必须能看到实际文章，大类入口不能替代文章。**

**2.2　栏目页 /{section}/**

- 深色栏目头：栏目名、一句话说明、文章总数、子栏目入口（各带数量）

- 编辑精选（图文对半）→ FROM THE EDITOR 短评 → 头条一条带图 →
  两列紧凑列表 → 深色 SERIES 插条 → 侧栏（订阅、标准、广告）

- 广告：栏目头下细横幅 970 × 90、侧栏 MPU + Half page、页脚前横幅 970 ×
  120；每 10 条列表最多插一张赞助卡，带标识

- 分页或「加载更多」二选一，全站统一

**2.3　文章页 /{section}/{slug}**

- 顶部阅读进度条；滚动后页眉显示当前文章标题

- 深色文章头：面包屑、栏目标、发布与更新时间、大标题、摘要、作者条（头像、职务、阅读时长、保存、分享、打印）

- 主图压在文章头上，带 FIG. 1 标与图说、来源署名

- KEY TAKEAWAYS 三格要点（网孔格 + 红焊点）

- 三栏布局：吸顶目录（当前位置 + 阅读百分比）／正文／侧栏

- 正文元素：APPLIES TO
  适用范围、首字下沉、行内规格卡、引语、图表、对比表格、自检清单

- 标准号自动链接：正文与规格卡中的标准编号（EN / ISO / ASTM / BS / DIN /
  GB 等前缀 + 编号）自动匹配标准索引，样式为加粗 +
  红色点线下划线，悬停变实线；规格卡下标 IN STANDARDS INDEX
  →；标题中不链接；编辑可在后台关闭单处链接

- SOURCES & FURTHER READING：编号列表，每条带链接与访问日期

- CORRECTION 更正块（有更正时才出现，不删原文）

- TOPICS 标签 → 作者卡（深色，社媒一横排）→ 评论区 → Read next 三篇

- 广告：侧栏 MPU + 侧栏 Half page +
  正文第三节前插位，最多三个；短文不出正文插位

**2.4　企业名录 /directory/**

- 深色页头：收录数、国家数、已认领数、大搜索框

- 按用途分五个大类卡，各带网型底纹与数量

- 控制条：黑色工具条（Application / Region / Product / More filters +
  结果数 + 三段式排序）+ 浅灰已选条件行（红色标签带 ✕ + CLEAR ALL）

- More filters 面板只保留 MATERIAL 与 PROFILE
  两组粗维度；孔径、线径、涂层量不做筛选项

- Sponsored listing 区：独立成块、虚线框、SPONSORED LISTING
  标，第一期不启用；旁列免费与付费对照

- 自然列表：三列等宽卡，无视觉重点条目（避免被读作付费位）；顶部网型色带、国别码、认领标、更新日期；排序与付费无关

- 翻页条：条数 + 页码 + 跳页

- 底部认领 CTA（深色）

**2.5　企业详情页 /directory/{company}**

- 深色头：企业名、类型、国别、CLAIMED 标、最近更新时间

- 产品图廊：注明图片由企业提供、经编辑审核，不构成规格担保

- 认证区：证书编号、发证机构、有效期、核对说明；过期自动下架

- Key facts：每项带来源标注（VERIFIED / SELF-REPORTED）

- 联系方式：登录后可见（防爬取），并说明原因

- 与本刊报道的互链；与运营方有关联时显示关系标注

- Contact this company 按钮：仅已认领且填写接收邮箱的企业显示

**2.6　展会日历 /events/**

- 按时间排列的展会卡：名称、日期、城市、主办方、官网

- 展会详情页与展会报道互链

- 主办方赞助位需带 SPONSORED 标，只卖当届

**2.7　用户中心 /account/**

- 角色标：READER / AUTHOR / COMPANY，可叠加，不在注册时选择

- 左侧导航：Profile、My submissions、My comments、Author
  profile、Bookmarks、My messages、My company、Subscription &
  billing、Notifications、Account settings

- My submissions 五种状态：draft / pending / changes requested /
  rejected / published

- Author
  profile：简介、公开邮箱、LinkedIn、X、个人网站、专长。公开邮箱会被爬虫抓取，注册邮箱永不公开

- My messages：REPLIED / AWAITING REPLY / NO REPLY 三态

- 用户中心无广告

**2.8　投稿页 /submit/**

- 必须登录且邮箱已验证

- 编辑器 + 草稿预览 + 图片上传 + 来源与版权声明勾选 + 利益关系披露

- 提交即进入审核队列；状态变化邮件通知

- 投稿须知链接常驻（见 4.4）

**2.9　商业合作 /advertise/**

- 入口只在页脚、About、Contact，不进主导航

- 八种广告位的尺寸、位置与规格说明；赞助内容的边界

- 合作申请表单 → 人工沟通 → 报价 → 排期 → 审核发布

- 第一期无在线支付与自助投放

**2.10　搜索 /search/ 与搜索浮层**

浮层负责「边输边跳」，搜索页负责「完整列表 + 筛选 + 可分享的
URL」。两者调用同一个检索接口与同一个结果渲染组件，只是分页大小与布局不同；两边各写一套是以后不一致的根源。

| **项目**   | **浮层（W）**                                                                                      | **搜索页（K）**                                                                       |
|------------|----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| 进入       | 放大镜 / 按 /                                                                                      | 浮层里回车、「在全部内容中搜索」、外部链接 /search?q=                                 |
| 类型与标识 | 同一套：ARTICLE 黑 / LETTER 琥珀 / OPINION 描边 / COMPANY 灰 / STANDARD 红底 / TOPIC 红 / EVENT 绿 | 同左；颜色与文字两处都不许各自定义                                                    |
| 高亮       | \<mark\> 色 \#FFE8B0，只高亮词干匹配                                                               | 同左                                                                                  |
| 结果量     | 每类最多 5 条                                                                                      | 20 条一页，分页                                                                       |
| 筛选       | 只有类型计数芯片，点了即跳搜索页                                                                   | TYPE + SECTION + 时间 + 排序；全部写进 URL                                            |
| 排序       | 相关度，类型内按时间                                                                               | 默认相关度；可切最新；Standards 类按编号                                              |
| 空结果     | 替换词 + Suggest a topic                                                                           | 替换词 + 放宽筛选（全部类型 / 任意时间 / 全部栏目）各自的预计结果数 + Suggest a topic |
| 不进搜索   | 行情数字、广告、政策页正文、用户资料、未发布与下线内容                                             | 同左；搜索页侧栏给 Market data 出口                                                   |
| 键盘       | ↑↓ 移动，回车打开，Esc 关闭并把焦点还给放大镜，200ms 防抖，role=listbox                            | 标准 Tab 顺序；回车提交                                                               |
| 手机       | 全屏页（M ⑧）                                                                                      | 同一页，筛选折成底部弹层（M ⑬）                                                       |
| 索引       | —                                                                                                  | 有结果也 noindex；不进 sitemap                                                        |

- 最近搜索只存浏览器本地，不上传服务器

**2.11　专题页 /topics/{slug}**

- 内容充足后再建，避免空分类页

- 可接 Series sponsor，位于顶部一条，注明赞助不参与选题

**2.12　About /about/**

**必须包含：**

- 我们是谁、为什么做、为谁做

- 编辑独立声明与编辑流程（谁写、谁审、谁签发）

- OWNERSHIP
  DISCLOSURE：运营主体全称与所有权关系，以及由此产生的四条硬规则

- 钱从哪里来：订阅、广告与赞助；哪些事情不接受付费影响

- 更正与投诉渠道

- 人工智能使用声明（见 1.4 ⑩）

- At a glance：成立时间、团队、语言（English only）、联系方式

**2.13　Contact /contact/**

- 按事由分流：编辑线索、更正、投稿、广告与合作、账号与隐私

- 每个事由给出对应邮箱与预期回复时间

- 兜底表单；公开的出版信息（publication details）指向 About

**2.14　作者页 /authors/{name}**

- 头像、姓名、职务、简介、专长标签

- CONTACT & SOCIAL 一横排按钮：Email 文字按钮 + LinkedIn / X / 个人网站
  / RSS 圆形图标按钮 + Follow

- 作者未填写的项目不显示

- 已发表文章列表

**2.15　注册登录 /signin/ /register/**

- 真实邮箱四道关：格式与域名 MX 检查 → 一次性邮箱域名库拦截 →
  点击验证（链接 N 小时有效、单次使用；未验证账号 N 天后清理）→
  持续有效（改邮箱重验、退信超阈值降级、认领企业须用企业域名邮箱）

- 未验证账号：不能投稿、不能评论、不能收藏、不能联系企业、不能认领企业，只能浏览

- 不做短信验证（成本高、国际号码覆盖差、对我们的滥用场景无实质帮助）

**2.16　企业认领与定向联系**

- 认领八步：发起 → 填写申请 → 企业域名邮箱验证码 → 人工复核 → 通过／驳回
  → 企业端编辑 → 改动审核 → 生效

- 认证资料提交后锁定，修改需走人工流程；提交前有二次确认弹窗与勾选

- 定向联系：只发给选定的一家、不分发、不收费、不保证回复、本刊不介入交易；需登录；每账号每日发送上限

**2.17　Letters & Opinion /letters/（画板 LT）**

**列表页**

- Letters \[N\] / Columns \[N\] 两个标签，默认停在
  Letters；筛选条：REPLYING TO（按栏目）+ WRITER（按角色：Specifier /
  Buyer / QA / Manufacturer / Engineer / Standards）+ 排序

- 每条只显示：LETTER 标、署名或 Name
  withheld、角色与机构类型、日期、引语式标题、前两句摘要、Replying to
  文章链接；可带 EDITOR REPLIED / LED TO A CORRECTION / N FURTHER
  LETTERS 标

- 右栏固定三块：Write to the editor（四条规则 + 授权声明 + Send a
  letter）、COLUMNS（外部作者，署名 + 职务 + 机构，ALL COLUMNS →）、How
  we choose letters

- 广告：列表页只允许来信区下方一个赞助卡（与首页同款）；单封页无广告

**单封来信页 /letters/{slug}**

- 顺序：面包屑 → LETTER TO THE EDITOR + 日期 → 引语标题 →
  作者条（署名、角色、机构、Identity verified by the editor、Share /
  Copy link）→ 正文 → 所回应文章卡 → EDITOR’S
  REPLY（红边框，只回事实与改动，一段）→ Have a different view? Reply
  with a letter → 同文其他来信 → 固定免责脚注

- 独立 URL 与 canonical，进 sitemap 与独立
  RSS（/letters/feed）；标题带引号以区分报道

**显示、审核与法律规则**

| **项目**     | **规则**                                                                                                                                                     |
|--------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 首页模块显示 | 来信少于 3 条或最新一条超过 60 天：首页模块隐藏，但 /letters/ 页始终可访问；无在刊专栏时 Columns 标签隐藏，侧栏换成寻找专栏作者的邀请                        |
| 身份核实     | 登录账号 + 编辑邮件或电话核实姓名与机构；核实前不发；可匿名刊登，页面标注 identity verified by the editor；编辑部必须知道作者是谁                            |
| 审核红线     | 不刊登：点名指控竞争对手、具体报价或价格建议、产品推广、无法核实的事实断言、人身攻击。涉及第三方企业的事实指控先给对方回应机会（right of reply）再决定刊不刊 |
| 编辑权       | 可删节、改拼写与格式，不改观点；改动超过删节须经写信人确认；发布后写信人可要求撤下，撤下后 URL 保留并显示 Withdrawn at the writer’s request                  |
| 编辑回复     | 只回应事实与改动，不辩论；若来信导致更正，来信页与原文更正记录互链，列表加 LED TO A CORRECTION 标                                                            |
| 专栏         | 编辑部不写专栏；外部作者署真名、职务、机构，文末固定利益披露；OPINION 标识在列表、文章页、搜索结果、RSS 中都不可省略；专栏不进 News 流                       |
| 授权与隐私   | 提交即授予非独占、可编辑、可永久展示的许可（写进 Terms 用户内容条款）；写信人邮箱、电话仅编辑可见                                                            |
| 篇幅         | 200–400 字；一个具体问题、一次现场经验或一处更正                                                                                                             |

**来信是用户生成内容中诽谤风险最高的一类：署名、有机构、谈具体工程。right
of reply 与审核红线不能省；Letters policy 页须由律师定稿。**

**2.18　手机端（画板 M）**

- 左侧为首页全貌长图，模块顺序与桌面一致；右侧八屏：菜单、文章、名录、注册、用户中心、Cookie、搜索、页脚；下方新增四屏：来信列表（双标签 +
  横滑筛选 + 写信卡）、标准详情（Follow / Official text 各半宽 +
  变更记录时间线 + 侧栏折成标签）、行情页（6 序列折两列卡 +
  单图可切周期 + WHAT MOVED THE MARKET 两条 +
  页底署名条）、搜索结果页（类型芯片横滑 + 栏目 / 时间 /
  排序进底部弹层，按钮实时显示结果数）

- 降级规则：超级菜单→手风琴；筛选条→底部弹层；搜索浮层→全屏页；文章目录→折叠行；侧栏→下沉正文后；每栏目最多三条，更多点
  ALL；Methodology 页手机端直接套政策页单栏样式，不另画

- 有意不同步：不放 In numbers 数字带；每页只保留一个广告位（320 ×
  90）；回到顶部距底 28px 避开手势区

- 社媒圆钮 38px，按下（:active）与聚焦时整颗变红，等同桌面
  hover；关闭系统点击灰色高亮

**2.19　错误页**

- 404 带搜索框与栏目出口；500 只给可报修的 Ref 编号，不显示堆栈；403
  指向登录；410 用于确定不恢复的内容并指向更正页

- 状态码必须真实返回；错误页一律
  noindex；保留页眉与搜索框，不让用户被困住

**03　法律风险清单与规避措施**

按风险类别列出：可能出事的场景、后果、我们的对策、对策落在哪一页或哪个功能、由谁负责。所有对策都已体现在设计画板中；本节是给法务、编辑与开发的对照表。

**3.1　版权**

| **风险场景**               | **后果**                 | **对策**                                                                                            | **落点 / 责任人**           |
|----------------------------|--------------------------|-----------------------------------------------------------------------------------------------------|-----------------------------|
| 文章中使用第三方图片、图表 | 发函、赔偿、搜索降权     | 全部原创或已授权；图说带来源与署名；图片库只放授权文件并记录授权范围与期限                          | 文章页图说 / 编辑           |
| 转载标准正文、条款、表格   | 标准机构发函，情节重可诉 | 只写编号、公开标题与编辑自撰摘要；不复制条文、不提供 PDF、不做全文翻译；页面挂固定免责句（1.4 ⑤）   | Standards Index / 编辑      |
| 行情数据超授权使用         | 违约、授权终止、索赔     | 按授权展示：延迟标、署名、禁止再分发；不提供导出与 API；不做衍生指数；feed 不直连前端；一键下架开关 | Market data / 开发 + 运营   |
| 投稿含抄袭或未授权内容     | 连带责任                 | 投稿须勾选原创与授权声明；编辑查重；发现后撤稿并记录（410 + 更正页）                                | 投稿页、Corrections / 编辑  |
| 用户评论、来信侵权         | 通知删除义务             | 先审后显；Copyright 页公布侵权通知渠道与处理时限；保留通知记录                                      | 评论区、Copyright 页 / 编辑 |
| 我们的内容被抄             | 损失流量与权威           | 页脚版权行；RSS 全文输出改摘要；文章页 canonical；必要时发函                                        | 全站 / 运营                 |

**3.2　商标与企业名称**

| **风险场景**               | **后果**           | **对策**                                                                                     | **落点 / 责任人**       |
|----------------------------|--------------------|----------------------------------------------------------------------------------------------|-------------------------|
| 名录中使用企业名称与 logo  | 被指冒用或暗示背书 | 仅作指称性使用；logo 由企业认领后自行上传并承诺有权使用；未认领条目不展示 logo，只用网型占位 | Directory / 编辑        |
| 与运营方关联企业出现在名录 | 被指利益输送       | 关系标注固定句（1.4 ②）；排序、收录、报道与其他企业同标准；About 公开披露                    | Directory、About / 主编 |
| 广告主 logo 使用           | 超出授权范围       | 合同约定使用范围与期限；到期自动下架                                                         | 广告系统 / 运营         |

**3.3　失实与名誉**

| **风险场景**                 | **后果**         | **对策**                                                                                         | **落点 / 责任人**                    |
|------------------------------|------------------|--------------------------------------------------------------------------------------------------|--------------------------------------|
| 报道点名企业的负面事实       | 名誉侵权索赔     | 事实核查两源以上；发稿前给当事方回应机会并记录；意见与事实分开标注；更正政策公开                 | Editorial Policy、Corrections / 主编 |
| Opinion 与来信中的指控性言论 | 连带责任         | Opinion 不与 News 混排并带标识；作者实名与机构；利益披露；涉及可识别对象的指控须有依据，否则不发 | Letters & Opinion / 编辑             |
| 企业资料失实（认证、产能）   | 误导采购方       | 认证须证书副本并核对；锁定后不可自改；自述项标 SELF-REPORTED；产能等不可核实数字一律不发布       | 企业页、认领流程 / 编辑              |
| 行情、标准状态写错           | 读者据此决策受损 | 每条带来源与核对日期；状态变更须附来源链接与核对人；错误走更正流程                               | Market data、Standards Index / 编辑  |

**3.4　技术内容的责任**

| **风险场景**                 | **后果**             | **对策**                                                                                            | **落点 / 责任人** |
|------------------------------|----------------------|-----------------------------------------------------------------------------------------------------|-------------------|
| 读者按技术指南施工或采购出事 | 被指提供错误专业建议 | 固定免责句（1.4 ④）；指南写方法不写结论性保证；涉及安全的内容注明须由合格工程师确认；以标准正文为准 | 文章页 / 编辑     |
| 规格表数字抄错               | 同上                 | 表格注明示意或来源；数字类内容二人核对                                                              | 文章页 / 编辑     |

**3.5　隐私与数据保护**

本站面向全球，欧盟/英国
GDPR、美国各州隐私法、中国个人信息保护法都可能适用。统一按最严一档执行，只维护一套逻辑。

| **风险场景**                 | **后果**         | **对策**                                                                                                                                               | **落点 / 责任人**         |
|------------------------------|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| 未经同意设置分析/营销 cookie | 监管处罚、投诉   | 同意前不加载；接受与拒绝同等显眼；不预勾选；不设 cookie 墙；选择留痕（内容、时间、政策版本）；12 个月重新征询；尊重 GPC 信号；页脚常驻 Cookie settings | Cookie 横幅与面板 / 开发  |
| 数据控制者不明               | 无法履行主体权利 | Privacy 写明控制者全称、地址、联系邮箱；About 同步披露                                                                                                 | Privacy、About / 法务     |
| 营销邮件未经同意             | 反垃圾邮件法处罚 | 订阅双重确认（double opt-in）；每封带一键退订；退订即时生效；不预勾选营销同意                                                                          | 订阅表单、邮件模板 / 开发 |
| 用户数据跨境传输             | 合规缺口         | Privacy 说明服务器所在地与传输机制；处理者清单；按律师意见补标准合同条款                                                                               | Privacy / 法务            |
| 主体权利请求无渠道           | 投诉             | Privacy 列出访问、更正、删除、导出、撤回同意的渠道与时限；用户中心提供导出与注销                                                                       | Privacy、用户中心 / 开发  |
| 公开邮箱被爬                 | 用户投诉         | 作者公开邮箱由本人自愿填写并提示风险；企业联系方式登录后可见；注册邮箱永不公开                                                                         | 作者资料、企业页 / 开发   |
| 定向联系表单的信息流向       | 超范围使用       | 只发给选定一家；不入广告系统；不并入名录资料；发送前显示固定说明（1.4 ⑨）                                                                              | 定向联系表单 / 开发       |
| 未成年人                     | 违规收集         | Terms 要求 16 岁以上；不面向未成年人；发现即删除                                                                                                       | Terms / 运营              |
| 数据泄露                     | 通知义务         | 最小化收集；密码哈希；访问日志；泄露 72 小时内评估与通知流程                                                                                           | 后台 / 开发 + 法务        |

**3.6　广告与赞助披露**

| **风险场景**             | **后果**                   | **对策**                                                                                 | **落点 / 责任人**                  |
|--------------------------|----------------------------|------------------------------------------------------------------------------------------|------------------------------------|
| 赞助内容与编辑内容混淆   | 监管认定误导、读者信任崩塌 | SPONSORED CONTENT 固定标识在列表与详情页；视觉可区分；外链 rel=sponsored；编辑不参与撰写 | 广告规范 / 运营                    |
| 付费影响排序或报道       | 同上，且违反自身政策       | 收录、排序、搜索、报道一律不接受付费；Sponsored listing 与自然列表物理分区               | Directory、Editorial Policy / 主编 |
| 广告素材本身违规或侵权   | 连带责任                   | 合同约定广告主对素材负责；上线前审核；可随时下架                                         | 广告合同 / 运营                    |
| 接入第三方广告网络的追踪 | 隐私违规                   | 第一期不接广告网络；只做排期直投；不做行为定向                                           | 广告系统 / 开发                    |

**3.7　用户生成内容**

| **风险场景**                           | **后果**       | **对策**                                                                                                                                                    | **落点 / 责任人**         |
|----------------------------------------|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------|
| 评论、来信、投稿含诽谤、侵权、违法内容 | 平台责任       | 登录 + 邮箱验证才能发布；先审后显；Comment Policy 公布规则；举报渠道；记录处理过程                                                                          | 评论区、投稿、来信 / 编辑 |
| 读者来信点名第三方企业或工程           | 诽谤、商业诋毁 | 来信红线（不刊点名指控竞争对手、报价、推广、不可核实断言）；涉第三方事实指控先 right of reply；身份核实后才发；撤稿 URL 保留并标注；Letters policy 律师定稿 | Letters 页 / 主编 + 法务  |
| 企业认领资料造假                       | 误导、纠纷     | 企业域名邮箱验证；人工复核；认证资料锁定；二次确认勾选；造假撤销认领并公示                                                                                  | 认领流程 / 编辑           |
| 账号被用于垃圾信息                     | 滥用           | 一次性邮箱拦截；发送频率上限；滥用封禁                                                                                                                      | 注册、定向联系 / 开发     |

**3.8　竞争法（容易被忽视）**

| **风险场景**                                               | **后果**   | **对策**                                                                                                                          | **落点 / 责任人**               |
|------------------------------------------------------------|------------|-----------------------------------------------------------------------------------------------------------------------------------|---------------------------------|
| 发布可促成价格协同的信息（企业未来报价意向、未来产量计划） | 反垄断调查 | 行情只用交易所与价格机构的公开/授权数据和我们自己的匿名调查汇总；不发布单个企业的未来价格或产量意图；自有调查价写明样本与剔除规则 | Market data、Methodology / 主编 |
| 名录或文章成为同行交换敏感商业信息的场所                   | 同上       | 评论区与来信不接受企业间的价格讨论；企业资料不含报价                                                                              | 评论、企业页 / 编辑             |

**3.9　制裁与出口管制**

| **风险场景**                               | **后果** | **对策**                                                                                           | **落点 / 责任人**             |
|--------------------------------------------|----------|----------------------------------------------------------------------------------------------------|-------------------------------|
| 名录收录受制裁实体；定向联系被用于受限交易 | 合规风险 | 收录与认领前对企业名称做制裁名单筛查；定向联系表单声明本刊不介入交易；Terms 禁止用于违反制裁的用途 | 认领流程、Terms / 运营 + 法务 |

**3.10　可访问性与其他**

| **风险场景**                       | **后果**                   | **对策**                                                                                  | **落点 / 责任人**      |
|------------------------------------|----------------------------|-------------------------------------------------------------------------------------------|------------------------|
| 网站不可访问（对比度、键盘、读屏） | 部分地区可诉；读者流失     | WCAG 2.1 AA 为验收标准；图标带 aria-label；减少动效设置；错误页可操作                     | 全站 / 开发 + 设计     |
| 出版主体信息缺失                   | 部分法域要求公开出版者信息 | About 列出运营主体全称、注册地、联系方式与责任编辑；页脚只写简称                          | About / 法务           |
| AI 生成内容未披露                  | 信任与潜在监管             | About 公布 AI 使用声明（1.4 ⑩）；不发布无人审核的机器文本；标准摘要与行情文字必须人工签发 | About、编辑流程 / 主编 |

**04　政策页正文**

十份政策页。前七份给出可直接发布的英文正文（占位符用 {}
标出）；Privacy、Terms、Cookie Policy
三份是法律合同文本，这里给出结构与关键条款，正式文本须由执业律师按运营主体、服务器所在地与目标市场定稿后上线。所有政策页使用同一版式（画板
O），顶部注明生效日期与版本号，改动保留历史版本。

**4.1　Editorial Policy 编辑政策（可直接发布）**

> Wire Mesh News reports on the wire mesh, welded mesh and metal fabric
> industry for the people who specify, buy, make and install it. This
> policy explains how we work.
>
> Independence. Our editorial decisions are made by our editors alone.
> No advertiser, sponsor, directory listing or commercial relationship
> buys coverage, influences a story, or changes where anything appears
> on this site. Our ownership and commercial relationships are disclosed
> in full on our About page; companies related to our publisher are
> covered under exactly the same rules and carry a visible relationship
> label wherever they appear.
>
> Accuracy. We verify facts against primary sources — standards bodies,
> company filings, named individuals on the record — and we attribute
> them. Where a figure is an estimate or supplied by a company without
> independent verification, we say so. Every technical article carries a
> list of sources.
>
> Fairness. When a story is critical of a named company or person, we
> ask them for a response before publication and give them reasonable
> time to reply. Their response, or the fact that they declined, is
> included.
>
> Fact and opinion. News and analysis are written by our editors and
> reflect verified facts. Opinion pieces and letters are clearly
> labelled, carry the author's real name and affiliation, and disclose
> any interest the author has in the subject. They do not represent the
> view of Wire Mesh News.
>
> Sponsored content and advertising are always labelled, visually
> distinct, and never written by our editorial team. See our Advertising
> & Sponsorship Disclosure.
>
> Corrections. We correct errors promptly and visibly, and we keep a
> public record. See our Corrections Policy.
>
> Tools. We may use software, including AI tools, to help with research,
> transcription and first drafts. Every article is written, checked and
> signed off by a named human editor who is responsible for it. We do
> not publish machine-generated text as reported work.
>
> Contact the editor: {editorial email}.

**4.2　Corrections Policy 更正政策（可直接发布）**

> We get things wrong sometimes. When we do, we fix them in the open.
>
> What we correct. Factual errors of any size — a wrong figure, a
> misattributed quote, a misnamed company, a standard cited incorrectly.
> Typos that do not change meaning are fixed silently.
>
> How we correct. The article is updated, and a dated correction note is
> added to it stating what was wrong and what it now says. We do not
> delete the original wording from our records. Serious errors are also
> listed on our Corrections page.
>
> Retractions. If an article's central claim cannot be supported, we
> withdraw it. The URL returns a notice explaining the withdrawal; it
> does not disappear quietly.
>
> Right of reply. If you are the subject of an article and believe it is
> unfair or inaccurate, write to {corrections email}. We will reply
> within {N} working days and, where justified, publish a correction or
> your response.
>
> How to report an error: email {corrections email} with the article
> link, the error, and your source. Reports are logged and reviewed by
> an editor who did not write the piece.

**4.3　Comment Policy 评论政策（可直接发布）**

> Comments are open to registered readers with a verified email address.
> Every comment is reviewed before it appears; expect a delay of up to
> one working day.
>
> We publish comments that add to the record: a correction, a site
> experience, a standard we missed, a reasoned disagreement.
>
> We do not publish: sales pitches or contact details; personal attacks;
> claims about named companies or people that are not supported;
> plagiarised text; anything unlawful. Company accounts may comment and
> are labelled as such; they may not promote their own products in
> comments.
>
> Comments that point out a factual error are prioritised and may
> trigger a correction. Comments are moderated by editors; decisions are
> final but you may write to {editorial email} if you think we got it
> wrong.
>
> Your comment appears only to you while it is in review. We may remove
> published comments that later prove to breach this policy.

**4.4　Submission Guidelines 投稿须知（可直接发布）**

> We publish technical articles, case studies, market analysis and
> letters from people who work in the industry. We do not publish press
> releases, product promotion or SEO articles.
>
> Who can submit. Anyone with a verified account. Articles must be the
> author's own original work, not published elsewhere, and free of
> third-party material you do not have the right to use.
>
> What we look for: a specific problem and a specific answer; real
> numbers with sources; experience from a site, a plant or a lab; clear
> statements of what the reader should do differently. Length: 800–2,000
> words for articles, 200–400 words for letters.
>
> Disclosure. State your employer and any commercial interest in the
> subject. Undisclosed interests discovered after publication lead to
> removal of the article and the account.
>
> Process. Submit through your account. Drafts go to an editor for
> review; you will see one of five states — draft, pending review,
> changes requested, rejected, published — and receive an email on each
> change. Accepted articles are edited for clarity and house style; we
> send you the edited version before publication.
>
> Rights. You keep copyright. You grant Wire Mesh News a non-exclusive,
> perpetual licence to publish, edit, translate and distribute the
> article in any medium. We do not pay for submissions.
>
> After publication. Articles carry your byline, bio and the public
> contact details you choose to show on your author profile. We may
> correct or update the article under our Corrections Policy.

**4.5　Advertising & Sponsorship Disclosure
广告与赞助披露（可直接发布）**

> Wire Mesh News is funded by reader subscriptions, display advertising
> and sponsored content. This page explains how to tell them apart and
> what money does and does not buy.
>
> Advertising is labelled ADVERTISEMENT and appears in fixed positions.
> Advertisers do not know what articles their ads appear next to, and we
> do not change editorial content for them.
>
> Sponsored content is paid for and supplied by the named company,
> labelled SPONSORED CONTENT in every list and on the article itself,
> visually distinct from editorial, and never written by our editorial
> team. Links in it are marked as sponsored.
>
> Series sponsorship means a company has supported a topic hub
> financially. The sponsor has no role in choosing or editing the
> articles in it.
>
> What money cannot buy: a place in the news; a higher position in any
> list, search result or the Company Directory; a certification badge;
> removal of a competitor; a softer story. Directory listing is free and
> ranking is never paid. Where we later offer a paid directory placement
> it will be in a separate, labelled section that does not change the
> free listing's order.
>
> Our publisher's own companies and their partners may advertise or
> sponsor under exactly the same rules, and are labelled with their
> relationship to us. See About.

**4.6　Directory Listing Policy 名录收录政策（可直接发布）**

> The Company Directory lists manufacturers, processors, distributors,
> laboratories, standards bodies and associations that appear in our
> reporting or are relevant to it. Listing is free, is decided by our
> editors, and cannot be bought.
>
> What we show and where it comes from. Each fact on a company profile
> is labelled: VERIFIED means our editors checked it against a named
> source on a given date; SELF-REPORTED means the company supplied it
> and we have not independently confirmed it. Certifications are shown
> only when the company has provided a copy of the certificate and we
> have checked it; they are removed automatically on expiry.
>
> Claiming a profile. A company may claim its profile using an email
> address at its own domain. Claimed companies can maintain their
> description, product range, photos and contact details; changes are
> reviewed before they go live. Company type, related coverage and
> editorial notes remain under our control. Certification details are
> locked after submission and can only be changed by contacting us.
>
> What we will not publish: capacity, market share or performance
> figures without a verifiable third-party source; claims about
> competitors; promotional copy.
>
> Removal and corrections. Write to {directory email}. We do not remove
> companies because they dislike our coverage. We correct factual errors
> under our Corrections Policy.
>
> Related companies. Companies related to our publisher carry a visible
> relationship label and are listed under the same rules as everyone
> else.

**4.7　Copyright & Takedown
版权与侵权通知（可直接发布，表单字段按法域调整）**

> All content on wiremeshnews.com is © Wire Mesh News or its licensors.
> You may quote short extracts with attribution and a link. You may not
> republish articles in full, scrape the site, or redistribute market
> data or company information from it.
>
> Standards. We summarise standards in our own words and link to the
> issuing bodies. We do not host or distribute standards texts. Buy them
> from the issuer.
>
> Market data shown on this site is licensed from third parties and may
> not be copied, redistributed or exported.
>
> If you believe content on this site infringes your copyright, send a
> notice to {legal email} containing: the work you own; the URL of the
> material; your contact details; a statement that you believe in good
> faith the use is unauthorised; and your signature. We act on valid
> notices within {N} working days and notify the person who posted the
> material, who may send a counter-notice.

**4.8　Privacy Policy 隐私政策（结构与关键条款 · 须律师定稿）**

- Controller: {运营主体全称}, {注册地址}, {privacy email}. 与 About 一致

- What we collect and why: account (email, name, password hash); profile
  you choose to make public; submissions, comments, letters, messages
  you send to companies; subscription and billing (via payment processor
  — we do not store card numbers); analytics only with consent; server
  logs for security

- Legal bases (GDPR): contract (account, subscription), consent
  (analytics, marketing email, public profile), legitimate interest
  (security, fraud prevention, editorial record)

- Sharing: payment processor, email provider, hosting, analytics (only
  with consent), the single company you choose to contact via the
  contact form. No sale of personal data. No advertising networks

- International transfers: server location; transfer mechanism (SCCs /
  adequacy) — 律师定

- Retention: account until deletion + {N} days; unverified accounts
  purged after {N} days; logs {N} months; editorial record (published
  articles, published comments) retained as part of the publication

- Your rights: access, rectification, erasure, portability, restriction,
  objection, withdraw consent; how to exercise; response time;
  supervisory authority

- California / US state rights: right to know, delete, opt out of
  sale/sharing (we do not sell); GPC honoured; non-discrimination

- Children: not directed at under-16s; deletion on discovery

- Security measures; breach notification; changes to this policy;
  effective date and version history

**4.9　Terms of Use 使用条款（结构与关键条款 · 须律师定稿）**

- Parties: {运营主体全称} and you; governing law and venue — 律师定

- Accounts: one person per account; verified email required;
  responsibility for credentials; we may suspend for breach

- Acceptable use: no scraping, bulk download, automated access,
  redistribution of data; no unlawful, defamatory or infringing content;
  no use of the contact form for spam or for transactions prohibited by
  sanctions

- User content licence (as in Submission Guidelines); representations of
  originality and rights; moderation and removal

- Directory and company profiles: information basis; no warranty of
  accuracy; labels (VERIFIED / SELF-REPORTED); claiming terms; lock on
  certification data; revocation

- Contact-a-company: single recipient; no forwarding; no fee; no
  guarantee of reply; Wire Mesh News is not a party to any transaction

- Market data and standards summaries: for information only; not an
  offer, quotation, engineering advice or substitute for the official
  text; licensed data restrictions

- Subscriptions: price, billing cycle, cancellation, refunds,
  auto-renewal notice — per consumer law of target markets

- Advertising and sponsorship: separate terms for advertisers

- Disclaimers and limitation of liability (to the extent permitted);
  indemnity for user content; termination; changes; contact

**4.10　Cookie Policy Cookie 政策（结构与关键条款 · 须律师定稿）**

- What cookies and similar technologies we use, by category: strictly
  necessary; analytics; embedded media; advertising measurement
  (currently unused)

- A table of each cookie: name, purpose, set by, duration — must match
  the consent panel's table and actual deployment

- Consent: nothing non-essential before consent; equal Accept / Reject;
  change at any time via the footer; re-consent every 12 months or on
  material change; GPC honoured

- Third parties and their policies; how to control cookies in browsers;
  contact; effective date

**05　行情数据：授权、展示与技术**

已定方案：锌价取交易所行情（LME），钢丝、钢卷等取价格机构的日度评估价，另加一条自有调查价。授权数据带合同义务，来源、延迟、版权声明、禁止再分发四件事做进模块本身。

**5.1　展示规则**

| **项目**       | **规则**                                                                                                                                                                                                                |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 署名           | 署名条紧贴数据，含供应商 logo 位（按其品牌规范固定尺寸）、序列来源、延迟档位、版权与禁止再分发声明；不能只写在页脚                                                                                                      |
| 延迟标         | DELAYED 30 MIN / NEXT DAY 等档位标 + AS OF 时间戳（UTC）                                                                                                                                                                |
| 三种状态       | LIVE 正常；STALE 超期显示上次有效值并灰掉、隐藏涨跌幅、标出 LAST GOOD 时间；UNAVAILABLE 整格换文字说明 + Methodology 链接。绝不显示 0 或空格                                                                            |
| 序列数         | 第一期 6 条：LME 锌 3 月 / LME 锌现货结算 / 钢丝盘条 / 热轧卷 / 自有调查镀锌网片价 / 集装箱运价                                                                                                                         |
| 图表           | 只在授权回溯期内；悬停显示单点；不提供下载                                                                                                                                                                              |
| Methodology 页 | 独立页 /market-data/methodology（画板 X2），见 5.4                                                                                                                                                                      |
| 推动因素模块   | 行情页 WHAT MOVED THE MARKET：按当前序列显示最近三篇 Market Insights；编辑在文章后台勾选序列代码挂接，一篇可挂多条；没有挂接的序列回落到 Market Insights 最新三篇。这是把授权数据变成媒体内容的地方；单序列页第一期不做 |
| 自有调查价     | 匿名汇总，不发布单个企业报价或未来意向（见 3.8 竞争法）                                                                                                                                                                 |

**5.2　授权要点（签约前核实）**

| **项目**   | **LME**                                                                                                                                                               | **价格机构**                               |
|------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| 是否需授权 | 对外展示属 external distribution，需 distribution licence                                                                                                             | 需内容/转载授权，按序列与用途计价          |
| 费用结构   | 年度分发授权约 USD 25,000（2026 年对会员及其客户、下级客户豁免）；订阅单位月费：实时 L1 约 44、延迟 30 分钟约 25、次日 0 且免报送（数字取自其 2026 年 FAQ，须再确认） | 按序列数 + 展示范围 + 是否可做衍生计算分档 |
| 报送       | 按月报送订阅用户数；用户月度诚信声明；授权记录留存 ≥ 3 年                                                                                                             | 通常按年申报，保留审计权                   |
| 技术审核   | 提交股权结构、客户条款；演示权限控制系统；feed/API 输出须事先批准                                                                                                     | 原始数据不得暴露给前端或第三方             |
| 建议       | 第一期走次日档 + 最少序列；流量与订阅起来后再升 30 分钟延迟档                                                                                                         | 同                                         |

**5.3　技术架构**

- INGEST：服务端按允许频率拉取；凭证只在服务端环境变量

- STORE：自有库只存授权回溯期内的点，到期自动清理；每条带来源与取数时间

- RENDER：服务端渲染进 HTML；不开放公共接口

- GUARD：限频；robots 禁抓行情页；访问日志留存；一键下架开关

**三个坑：feed key 放前端 JS；缓存不设过期；没有一键下架开关。**

**5.4　Methodology 方法说明页 /market-data/methodology（画板 X2）**

套政策页模板版式，左侧小导航，正文七节英文可直接使用，方括号内为授权合同签订后填写的字段：

| **节**                        | **内容**                                                                                                                                      |
|-------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| IN SHORT                      | 一段话：来源为授权第三方与自有季度调查；不是实时报价；交易所数据延迟显示；每个数字带来源与时间戳；不提供下载、接口与交易信号                  |
| 1 · What this page covers     | 适用于站内所有显示价格的图表、表格与迷你走势                                                                                                  |
| 2 · Series definitions        | 六条序列的定义、单位、更新频率、延迟、来源，定义不经变更记录不改                                                                              |
| 3 · Timing and delays         | 交易所 ≥30 分钟延迟；评估价按机构发布后一个工作日内；AS OF 用 UTC；超期标 STALE；取数失败标 LAST GOOD VALUE；回溯期按授权（目前 \[12\] 个月） |
| 4 · Our own survey price      | 固定参考规格；每季向 \[N\] 家制造商与 \[N\] 家经销商询价；匿名；剔除最高最低 \[10\]%；公布样本数；不公布任何单家报价                          |
| 5 · Attribution and copyright | 供应商 logo 位 + 逐字照抄的署名文案；可引用单个数字须注明来源与本刊；禁止抓取、再分发、转载序列                                               |
| 6 · Disclaimer                | 仅供参考；不是报价、要约或投资 / 采购建议；具体产品价格因规格、量、交付条件、交易对手而异；本刊与供应商不承担据此决策的责任                   |
| 7 · Corrections               | 写信到编辑邮箱附序列、日期与期望值；供应商错误转交供应商；自有调查错误站上带日期更正；适用总的 Corrections 政策                               |

- 入口：首页 Market snapshot 右上 METHODOLOGY
  →；行情页三段文字；每个数字旁的 DELAYED / AS OF
  徽标；文章内嵌价格图表下方 Source & method。不放进页脚
  POLICIES，这页归 Market data 栏目

- 维护：签新授权或换供应商改 §2 §5 并升版本号；延迟或回溯期变化改 §3
  并同步首页徽标；自有调查改口径改
  §4，旧口径数据在图上断开并标注；供应商要求改署名当天逐字替换；每年 1
  月对照在效合同复核。归 Market Insights 编辑维护，法务只审 §5 §6

**上线顺序：这页和行情模块一起上，不能先上数字后补说明。授权没签之前，首页行情区整体不显示，而不是显示占位数字。**

**06　标准索引：内容与版权**

**6.1　做什么、不做什么**

- 做：编号、公开标题、发布机构、ICS、状态、版本年、核对日期、替代关系、主题标签、三段编辑自撰摘要（管什么／不管什么／对采购的意义）、官方购买与免费预览链接、相关文章、等效对照表

- 不做：复制条文、表格、图样；提供
  PDF；全文翻译；托管任何版本；赚取未披露的返佣

- 编辑判断尺子：看完摘要，读者还需要买这份标准吗？答案是"不需要了"就写过界了

**6.2　填充与维护**

- 用 ICS 分类枚举候选集，不零散收集；候选来源：ICS
  目录、已购标准的规范性引用、招标文件、供应商质保书

- 首发 30–50 条核心；一年内 120–150 条；按季度补区域标准；长尾按读者需求

- 单条录入 15–20 分钟：官网查状态存链接 → 填元数据 → 写三段 →
  挂标签与替代关系 → 核对人与日期

- 存成结构化表，不存成文章；索引页、筛选、对照表、文章里的标准卡片全由表生成

- 自动化边界：候选池、元数据归类、互链、变动监测可自动；状态改动与摘要发布必须人工；不抓取机构商城目录

- 合法全量目录的正路：向标准经销商/数据库商谈元数据授权，不是写爬虫

**6.3　关注提醒、变更记录与文章内链接（V2.4 新增）**

| **项目**             | **规则**                                                                                                                                                                                                                                                                    |
|----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Follow this standard | 单条页头部按钮，与 Buy the official text 并排；登录后可按条关注；显示关注人数。只在编辑确认的状态变更、新版本、撤回时发一封邮件，摘要修订不发；邮件只含标准号、变化、来源链接，不带广告；一键退订。关注量是衡量哪些标准值得写深度稿的直接信号，也是用户注册的第一个硬理由   |
| Change log           | 单条页正文中的时间线，位于 Why it matters 之后、Our coverage 之前；每条含日期、类型徽标（状态变更 / 等效新增 / 收录 / 新版本 / 撤回）、一句说明、来源链接；只追加不删除。机器监测到的变化先进「待核实」队列，编辑确认并补来源后才出现，关注者在确认后收到邮件，不在监测时发 |
| 文章内标准号         | 自动识别并链接到索引（见 2.3）；标题不链接；编辑可关闭单处                                                                                                                                                                                                                  |
| 搜索                 | STANDARD 类结果显示编号、主题与状态（CURRENT / UNDER REVIEW / WITHDRAWN），按编号排序                                                                                                                                                                                       |

**6.4　等效对照表**

ISO / EN / ASTM / GB
四列并排，三档判断（基本等效／部分等效／不等效）加一句关键差异。等效判断优先采用发布机构自己声明的采用关系，其次为编辑比对并注明。这是事实陈述，不涉及转载正文，可以放心做。

**07　广告位库存与商业规则**

| **广告位**             | **尺寸**      | **位置**                         | **限制**                         |
|------------------------|---------------|----------------------------------|----------------------------------|
| Leaderboard            | 970 × 120     | 首页、栏目、名录、展会           | 不进首屏                         |
| MPU                    | 300 × 250     | 文章、首页、栏目、名录、专题侧栏 |                                  |
| Half page              | 300 × 600     | 文章侧栏（吸顶不出侧栏）         | 文章 ≥ 1200 字                   |
| In-article             | 580 × 180     | 文章正文小标题之间               | 每篇最多 1；标题与首段之间永不放 |
| In-feed sponsored card | 卡片          | 首页、栏目列表                   | 每 10 条最多 1                   |
| Series sponsor         | 文字 + logo   | 专题页顶部                       | 赞助不参与选题                   |
| Partner strip          | logo 横排     | 全站页脚上方                     | 按年售卖                         |
| Newsletter sponsor     | 图文 / 文字链 | 周报邮件                         | 每期 2                           |
| Sponsored listing      | 卡片          | 名录独立分区                     | 第一期不启用；不改变自然排序     |

**每页硬上限：首页 6（横幅 2、MPU 2、赞助卡 2）、文章 3、栏目与名录
2、专题 2、展会 2、周报
2。无广告区：政策页、更正页、标准索引与详情、投稿与认领流程、定向联系表单、用户中心、错误页、搜索浮层。付费订阅用户关闭全部展示广告，只保留页脚伙伴条。**

所有广告框用站内同一套圆角、1px
描边、灰度标识；客户素材不得自带外框与阴影；不做弹窗插屏、不吸底悬浮、不动画闪烁、不接第三方广告网络、不做行为定向；付费不影响任何排序。

**08　上线前法务与合规检查清单**

逐项勾选，缺一项不上线。责任人在括号内。

| **项目**   | **检查内容（责任人）**                                                                                                                                         |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 运营主体   | About / Privacy / Terms 三页的主体全称、地址、邮箱一致；页脚只写简称；Events、Advertise 等页面的联系电话与地址与主体一致，不出现占位的他国号码（法务 + 运营）  |
| 政策页     | 十份政策页全部上线，带生效日期与版本号；Privacy / Terms / Cookie 经律师定稿（法务）                                                                            |
| Cookie     | 同意前无非必要脚本；接受与拒绝同等显眼；无预勾选；留痕字段齐全；页脚 Cookie settings 常驻；cookie 表与实际部署一致（开发）                                     |
| 邮件       | 双重确认；一键退订；退订即时生效；发件域名 SPF/DKIM/DMARC（开发）                                                                                              |
| 注册       | 四道邮箱校验上线；未验证账号权限限制生效；一次性邮箱库可更新（开发）                                                                                           |
| 评论与投稿 | 先审后显；举报渠道；投稿原创声明与利益披露勾选（编辑 + 开发）                                                                                                  |
| 名录       | 收录政策上线；资料来源标注；认证锁定与二次确认；关联企业关系标注；受控字段全部下拉、词表已导入（编辑 + 开发）                                                  |
| 定向联系   | 单一收件人；发送前说明；频率上限；企业端消息箱；不入广告系统（开发）                                                                                           |
| 行情       | 授权合同签署；署名条与延迟标；三种状态；一键下架开关已测试；Methodology 页上线且 §5 署名文案与合同逐字一致；授权未签前首页行情区整体隐藏（运营 + 开发 + 法务） |
| 标准索引   | 无任何标准正文；免责句固定；购买链接指向发布机构；核对日期显示；关注邮件只在编辑确认后发且可一键退订；变更记录每条有来源（编辑 + 开发）                        |
| 来信       | Letters policy 经律师定稿并写进 Terms；身份核实流程就位；right of reply 流程就位；撤稿后 URL 保留；单封页无广告（主编 + 法务）                                 |
| 搜索       | 浮层与搜索页共用同一接口与渲染组件；七类标识一致；搜索页 noindex；行情数字不进索引（开发）                                                                     |
| 广告       | 标识固定；每页上限生效；无广告区生效；订阅用户关闭广告；rel=sponsored（开发）                                                                                  |
| 版权       | 所有图片有授权记录；图说带来源；RSS 输出摘要；canonical 正确（编辑 + 开发）                                                                                    |
| 可访问性   | 对比度 ≥ 4.5:1；可点区域 ≥ 44×44；键盘可操作；图标 aria-label；减少动效生效（设计 + 开发）                                                                     |
| 错误页     | 404/403/410/500 真实状态码；noindex；保留页眉与搜索（开发）                                                                                                    |
| 英文站     | lang=en；无 hreflang；无翻译插件；无语言切换（开发）                                                                                                           |
| 年份       | 页脚年份服务端渲染，按服务器时区（开发）                                                                                                                       |
| 制裁筛查   | 名录收录与认领前的名称筛查流程就位（运营）                                                                                                                     |
| AI 声明    | About 页 AI 使用声明上线；编辑签发流程记录（主编）                                                                                                             |

**09　分工与验收**

| **角色**     | **职责**                                                                                                                                                      |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 项目负责人   | 定版本范围与上线日期；拍板本文件中标注「须确认」的事项（主体信息、行情授权档位、社媒账号）                                                                    |
| 主编 / 编辑  | 编辑政策执行；来信与专栏审核（含身份核实与 right of reply）；标准变更记录确认；行情文章的序列挂接；名录收录与核对；标准索引录入与季度复核；更正处理；词表维护 |
| 设计         | 按画板实现全部页面与组件；暗色模式；手机端降级规则；无障碍自检                                                                                                |
| 开发         | 全站实现；受控字段与词表导入；Cookie 同意与留痕；邮箱四道校验；认领与锁定；行情接入与下架开关；广告上限与无广告区；错误页与状态码                             |
| 运营         | 社媒账号开通与同步发布；周报；广告与赞助合同；行情授权谈判；制裁筛查                                                                                          |
| 法务（外部） | Privacy / Terms / Cookie 定稿；行情授权合同；广告合同模板；侵权通知流程                                                                                       |

验收标准：第 08 节清单全部勾选；画板 A–Z、LT、X2 与 M
对应页面均通过设计走查；手机端与桌面端模块顺序一致；第 03
节每条对策在站上可指认。

**附录　画板索引**

| **画板** | **内容**                                                                                                                                        |
|----------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| 站点地图 | 框架 V2.4 全站结构                                                                                                                              |
| A        | 首页 v6：报头、图片拼版头条、行情、数字带、三栏、来信与专栏、应用、技术指南、广告、专题、双栏文章流、名录版块、订阅、伙伴条、完整页脚、回到顶部 |
| B        | 栏目页                                                                                                                                          |
| C        | 文章页 v2（含分享行、广告位、标准号自动链接样式）                                                                                               |
| D        | 企业名录（控制条、付费位分区、等宽卡）                                                                                                          |
| E        | 企业详情页                                                                                                                                      |
| F        | 展会日历                                                                                                                                        |
| G        | 用户中心                                                                                                                                        |
| H        | 投稿页                                                                                                                                          |
| I        | 商业合作页                                                                                                                                      |
| J        | 超级菜单与完整页脚（五个社媒、Cookie settings、Top）                                                                                            |
| K        | 搜索页（与浮层同一套类型标识、空结果放宽建议、分工表）                                                                                          |
| L        | 专题页                                                                                                                                          |
| M        | 手机端：首页全貌长图 + 13 屏                                                                                                                    |
| N        | About                                                                                                                                           |
| O        | Contact 与政策页模板                                                                                                                            |
| P        | 作者页                                                                                                                                          |
| Q        | 注册登录（真实邮箱四道校验）                                                                                                                    |
| R        | 错误页                                                                                                                                          |
| S        | 广告位（8 种）与订阅弹窗                                                                                                                        |
| T        | 暗色模式                                                                                                                                        |
| U        | 企业认领（认证锁定 + 受控字段表）                                                                                                               |
| V        | 定向联系表单                                                                                                                                    |
| W        | 搜索浮层（七类标识）                                                                                                                            |
| X        | 行情数据（第三方授权版 + WHAT MOVED THE MARKET）                                                                                                |
| X2       | 行情方法说明页 /market-data/methodology                                                                                                         |
| Y        | 标准索引（填充、对照表、下载边界、自动化边界、关注与变更记录）                                                                                  |
| Z        | Cookie 同意与回到顶部                                                                                                                           |
| LT       | Letters & Opinion 落地页与单封来信页                                                                                                            |
| 附件     | Wire_Mesh_News_Vocabularies.xlsx / wmn_vocabularies.json：31 张受控字段词表                                                                     |
