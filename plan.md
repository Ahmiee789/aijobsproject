# 建站计划 (Plan)

## 阶段一: 基础网站架构与用户界面 (Phase 1: Basic Website Structure and User Interface - Must-have features)

*   **目标 (Objective):** 搭建网站的基本框架，实现用户注册登录、简历上传、以及初步的工作推荐展示和筛选功能。
*   **步骤 (Steps):**
    1.  **建立基础网站结构 (Set up basic website structure):**
        *   使用 HTML, CSS, JavaScript 构建网站前端框架。 (Using HTML, CSS, JavaScript to build the frontend framework.)
        *   创建首页 (Homepage)、用户注册/登录页面 (User registration/login page)、简历上传页面 (Resume upload page)、职位推荐列表页面 (Job recommendation list page)、职位筛选页面 (Job filter page) 等基本页面。 (Create basic pages such as homepage, user registration/login page, resume upload page, job recommendation list page, job filter page, etc.)
    2.  **实现用户账户系统 (Implement user account system):**
        *   实现用户注册 (User registration) 和登录 (Login) 功能 (基于 Email 和密码)。 (Implement user registration and login functions (based on Email and password).)
        *   用户数据 (User data) 存储可以使用简单的 JSON 文件或者轻量级数据库 (例如 SQLite) 暂存。 (User data storage can use simple JSON files or a lightweight database (such as SQLite) for temporary storage.)
    3.  **简历上传功能 (Implement resume upload function):**
        *   创建简历上传表单 (Create resume upload form)，允许用户上传 PDF 或 Word 格式的简历。 (Allow users to upload resumes in PDF or Word format.)
        *   初期可以先只实现文件上传功能，简历解析功能在后续阶段实现。 (Initially, only implement file upload function, resume parsing function will be implemented in later stages.)
    4.  **职位推荐列表页面 (Design job recommendation list page):**
        *   初步设计职位推荐列表页面，展示模拟的职位推荐数据。 (Initially design the job recommendation list page to display simulated job recommendation data.)
        *   职位数据 (Job data) 可以使用 JSON 文件模拟。 (Job data can be simulated using JSON files.)
    5.  **基本职位筛选功能 (Implement basic job filter function):**
        *   实现基于地点 (location)、薪资 (salary) 等基本条件的职位筛选功能。 (Implement job filter function based on basic conditions such as location and salary.)

## 阶段二: AI 驱动的职位推荐与简历解析 (Phase 2: AI-Driven Job Recommendations and Resume Parsing - Must-have features)

*   **目标 (Objective):** 整合 AI 技术，实现职位智能推荐和简历初步解析功能。
*   **步骤 (Steps):**
    1.  **整合 AI 职位推荐 (Integrate AI for job recommendations):**
        *   选择合适的 AI 推荐算法 (Choose a suitable AI recommendation algorithm)。 (需要进一步讨论具体算法选择，例如协同过滤 (Collaborative Filtering) 或基于内容的推荐 (Content-Based Recommendation)) (Need further discussion on specific algorithm selection, such as Collaborative Filtering or Content-Based Recommendation.)
        *   初步实现基于用户简历和职位描述的职位推荐功能。 (Initially implement job recommendation function based on user resumes and job descriptions.)
    2.  **实现简历初步解析 (Implement basic resume parsing):**
        *   初期可以先实现简历文本内容提取 (Initially, resume text content extraction can be implemented first)。 (例如使用 JavaScript 库提取 PDF 或 Word 文件中的文本内容) (For example, use JavaScript libraries to extract text content from PDF or Word files.)
        *   为后续的 AI 简历信息提取 (AI resume information extraction) 奠定基础。 (Lay the foundation for subsequent AI resume information extraction.)
    3.  **构建简易数据库 (Build simple database):**
        *   如果 JSON 文件不方便管理数据，可以考虑使用轻量级数据库 (例如 SQLite) 存储用户数据和职位数据。 (If JSON files are not convenient for data management, consider using a lightweight database (such as SQLite) to store user data and job data.)

## 阶段三: 高级功能扩展 (Phase 3: Advanced Features Expansion - Should-have features)

*   **目标 (Objective):**  添加技能标签、第三方登录、雇主后台等 **應有 (Should-have)** 功能，完善用户体验。
*   **步骤 (Steps):**
    1.  **实现技能标签功能 (Implement skill tag function):**
        *   允许用户手动添加技能标签 (Allow users to manually add skill tags)。
        *   后续可以考虑使用 AI 自动检测简历中的技能标签 (Consider using AI to automatically detect skill tags in resumes in the future)。
    2.  **整合第三方登录 (Integrate third-party login):**
        *   接入 Google, LinkedIn 等第三方登录方式 (Integrate third-party login methods such as Google, LinkedIn)。
    3.  **开发雇主后台管理功能 (Develop employer backend management function):**
        *   实现雇主注册登录 (Employer registration and login)。
        *   雇主发布职位 (Employer job posting)、管理职位 (Manage jobs)、浏览候选人 (Browse candidates) 等基本功能。 (Basic functions such as employer job posting, job management, and candidate browsing.)

## 阶段四: 优化与附加功能 (Phase 4: Optimization and Nice-to-have Features - Nice-to-have features)

*   **目标 (Objective):**  实现智能面试排程、通知功能、社交分享等 **加分 (Nice-to-have)** 功能，并对系统进行优化。
*   **步骤 (Steps):**
    1.  **实现智能面试排程 (Implement intelligent interview scheduling):**
        *   (需要考虑与日历服务 (例如 Google Calendar) 的整合) (Need to consider integration with calendar services (such as Google Calendar).)
    2.  **添加通知功能 (Add notification function):**
        *   实现邮件 (Email) 或短信 (SMS) 通知功能 (Implement email or SMS notification function)。 (例如职位更新通知、面试邀请通知等) (Such as job update notifications, interview invitation notifications, etc.)
    3.  **社交分享功能 (Social sharing function):**
        *   实现职位社交分享功能 (Implement job social sharing function)。 (例如分享到 LinkedIn, Twitter 等) (Such as sharing to LinkedIn, Twitter, etc.)
    4.  **系统优化 (System optimization):**
        *   优化 AI 推荐算法 (Optimize AI recommendation algorithm) 和简历解析 (resume parsing) 功能。
        *   提升系统性能 (Improve system performance) 和用户体验 (user experience)。

## 技术选型 (Technology Stack):

*   **前端 (Frontend):**  HTML, CSS, JavaScript (可以考虑使用 React, Vue 或 Next.js 等前端框架在后续阶段) (Can consider using frontend frameworks such as React, Vue, or Next.js in later stages)
*   **后端 (Backend):**  JavaScript (Node.js) (初期可以先不涉及后端，前端模拟数据，后端可以在后续阶段根据需求选择合适的框架和数据库) (Initially, backend can be omitted, frontend simulates data, backend can choose appropriate framework and database in later stages according to needs)
*   **数据库 (Database):**  JSON 文件 (初期), SQLite (后续可以根据需求选择更强大的数据库，例如 PostgreSQL, MongoDB) (JSON files (initial), SQLite (later, more powerful databases such as PostgreSQL, MongoDB can be selected according to needs))
*   **AI 技术 (AI Technology):**  需要进一步调研和选择合适的 AI 算法和库 (Need further research and selection of suitable AI algorithms and libraries)

## Mermaid 图表 (Mermaid Diagram):

```mermaid
graph LR
    A[阶段一: 基础网站架构与用户界面] --> B(建立基础网站结构);
    A --> C(实现用户账户系统);
    A --> D(简历上传功能);
    A --> E(职位推荐列表页面);
    A --> F(基本职位筛选功能);

    G[阶段二: AI 驱动的职位推荐与简历解析] --> H(整合 AI 职位推荐);
    G --> I(实现简历初步解析);
    G --> J(构建简易数据库);

    K[阶段三: 高级功能扩展] --> L(实现技能标签功能);
    K --> M(整合第三方登录);
    K --> N(开发雇主后台管理功能);

    O[阶段四: 优化与附加功能] --> P(实现智能面试排程);
    O --> Q(添加通知功能);
    O --> R(社交分享功能);
    O --> S(系统优化);

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style G fill:#ccf,stroke:#333,stroke-width:2px
    style K fill:#fcc,stroke:#333,stroke-width:2px
    style O fill:#cfc,stroke:#333,stroke-width:2px
