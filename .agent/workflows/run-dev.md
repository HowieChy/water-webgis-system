---
description: 开发模式运行项目（用于论文演示）
---

# 开发模式运行项目

## 步骤 1: 启动后端服务

在项目根目录打开第一个终端，运行：

```powershell
cd backend
mvn spring-boot:run
```

等待后端启动完成，看到如下日志表示成功：

```
Started WaterWebgisApplication in X.XXX seconds
```

后端将运行在: http://localhost:8080

---

## 步骤 2: 启动前端服务

在项目根目录打开第二个终端，运行：

```powershell
cd frontend
yarn install  # 首次运行需要安装依赖
yarn dev
```

前端将运行在: http://localhost:5599

---

## 步骤 3: 访问系统

在浏览器中打开: **http://localhost:5599**

---

## 注意事项

1. **数据库**: 确保 PostgreSQL 已启动并创建了 `smart_water_db` 数据库
2. **端口占用**: 确保 8080 和 5599 端口未被占用
3. **停止服务**: 在各自终端按 `Ctrl+C` 停止服务
