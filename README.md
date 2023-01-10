
![image](https://user-images.githubusercontent.com/94048608/211454772-b52076f4-55f6-4370-9920-b262b5d9fdb4.png)


### 解决的问题：
-  **数据资产化的问题** ：没有合适的文件管理工具，很难对员工无形知识转化为企业的有形资产，导致培训、学习、展示上浪费了大量的资源，而且效果还不尽人意。
-  **文件统一管控问题** ：数据文件分散在员工各自的电脑中，很难形成有效的统一管控，需要从文件的生成、使用、流动整个过程对 非结构化内容进行管理
-  **知识流动的问题** ：信息的流动速度是企业高效运转的重要保障，解构化的数据由业务系统管理起来，但是非结构化的信息确实可靠的流动渠道，基本靠吼、靠U盘，靠问
-  **信息的检索问题** ：文件由于没有解构化，所以不便于检索查找，是缺乏一个有效的企业级“百度”
-  **信息安全的问题** ：企业内部无法有效的分级管理文件，放在互联网上的SaaS平台又存在信息泄露风险，私有化+内部权限管控是基础

**无忧·企业文档=企业级知识库+在线编辑工具集+企业搜索引擎+内容展示平台**
![image](https://user-images.githubusercontent.com/94048608/211456673-b9770961-008a-48d0-8210-fa081f8e641a.png)


### 技术栈选择
- 前端：VUE+Element-ui
- 后端：spring_cloud_alibaba、spring boot、Mybatis plus、Nacos、RabbitMq、Xxl-job
- 数据：Mysql、ElasticSearch、Redis、MariaDB（根据情况）
- 运维：K8S+docker、dockercompose


### 项目价值
* 私有化部署
* 代码级开放（开源版本\商用版本，都可以开放代码）
* 功能可定制（标准化的人力单价）
* 能力的开放（提供文档、文库、增删编辑预览的接口能力）
* 应用的周边（相同的架构还有 项目管理、协同设计、OKR、视频会议、Web邮件客户端等应用可以扩展）
* JVS基础构架（采用JVS基础脚手架进行搭建、支持钉钉、企微、微信三方对接、支持多租户、支持自定义logo登录页面等设置）


### 核心功能：
* 集成多种文件编辑器（富文本编辑器、在线表格、在线脑图、在线流程图等，word、PPT、excel、pdf）
* 预览与编辑的权限控制
* 核心文档的协同编辑（富文本、在线表格、office三件套）
* 支持团队化协同操作（）
* 提供企业级搜索引擎（基于标题、基于内容）
* 支持文档内容评论与文档收藏
* 支持文档分享（密码二次校验设置）
* 支持文档模板
* 企业级组织构架与权限管理（刚性组织+柔性群组）
#### 文集（知识库）管理
* 全站智能搜索引擎，支持文档级、内容级检索
* 文集的增删改查
* 文集的团队成员协作（可查看、可编辑）
* 文集的目录结构化管理
* 文集的基础介绍
* 知识库的参与协作人员
* 支持多种角色协同（成员、管理者、所有者）
#### 文档管理：
* 支持富文本（类word）、脑图（类Xmind）、流程图（类viso）
* 文档的增删改查、文档在线编辑
* 文档的分享设置
#### 特色工具
* 同屏编辑，编辑+搜索完美融合
* 本地化OCR识别、实现搜索引擎进行图片内容的搜索
* 各种文档的转化处理
* 文档的合并加工
* 多场景的文库管理：全网、企业、私有
* 文档的评论与收藏功能
* 静态模板
* 支持移动端



## 项目组成
企业文档分为业务前台与管理后台，项目由 业务前台与业务后台组成：

- 业务前台前端地址：https://github.com/RKQF-JVS/jvs-knowledge-ui
- 业务前台后端地址：https://github.com/RKQF-JVS/jvs-apply-document
- 管理后台前端地址：https://github.com/RKQF-JVS/jvs-ui
- 管理后台后端地址：https://github.com/RKQF-JVS/jvs


## 体验地址与账号说明
![image](https://user-images.githubusercontent.com/94048608/211461950-28f018a2-cef2-4e9e-9ca4-793a5689be4a.png)

账号说明：
- 普通用户端：体验者自有微信扫码登录
- 管理端(全网共享)：testadmin 123456
- 管理端+应用编辑：联系运营微信号 ruanjbz，开设独立环境与独立账号
- 管理端+平台配置+应用编辑：联系运营微信号 ruanjbz，获取私有化部署文档与安装包

地址说明（系列产品）：
- 管理平台（含管理平台、低代码、数据智仓）：https://frame.bctools.cn/
- 企业文档：http://knowledge.bctools.cn/
- 企业计划（项目管理）：http://teamwork.bctools.cn/
- 企业邮筒（Web邮箱客户端）：http://mailbox.bctools.cn/
- 规则引擎：http://jvs-rules.bctools.cn/
- 视频会议：http://meeting.bctools.cn/


部分截图：
![image](https://user-images.githubusercontent.com/94048608/211458792-d4a45f03-2d31-49c6-a1d5-ce7e81b021c5.png)
![image](https://user-images.githubusercontent.com/94048608/211458820-5e4b6916-070d-4262-afcc-b291d725364e.png)
![image](https://user-images.githubusercontent.com/94048608/211458839-ba4b5205-7862-4c9c-8751-41a409252304.png)
![image](https://user-images.githubusercontent.com/94048608/211458860-4d32a4e5-9314-4e74-adf1-7a10089678a4.png)
![image](https://user-images.githubusercontent.com/94048608/211458885-49d99fe7-0aeb-4ac7-9a36-8b1c2cd32d5a.png)
![image](https://user-images.githubusercontent.com/94048608/211458902-93bf3f9b-9dcd-41ba-b0d6-3babd21d0d83.png)
![image](https://user-images.githubusercontent.com/94048608/211458932-cbeca18a-6df8-4e21-a1cc-b6979d5b3612.png)



### 快速部署文档
https://github.com/RKQF-JVS/jvs-docker-compose/blob/master/readme.md


### 使用与授权
无忧企业文档社区版本100%开源模式，在合规备案情况下，支持自用与商用，商用提供100%源代码。

### 禁止行为（为了保障产品走得更远）：
* 在未获得我方认可分发代码的情况下，禁止以任何形式进行代码分发（包含但不限于代码拷贝、代码公开、代码开源、代码分享等行为）
* 禁止在未备案的情况下，私自使用（包含自用与商用）

### 技术交流与商务支持

<img width="113" alt="1673319273561" src="https://user-images.githubusercontent.com/94048608/211451271-eb894f2f-f0d1-4e6e-9e4c-871d56d98e8d.png">


