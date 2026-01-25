---
description: 生产模式打包与运行（用于论文演示）
---

# 生产模式打包与运行

## 第一步: 打包后端

在项目根目录运行：

```powershell
cd backend
mvn clean package -DskipTests
```

打包完成后，会在 `backend/target/` 目录生成 `backend-0.0.1-SNAPSHOT.jar` 文件。

---

## 第二步: 打包前端

在项目根目录运行：

```powershell
cd frontend
yarn install  # 首次需要安装依赖
yarn build
```

打包完成后，会在 `frontend/dist/` 目录生成静态文件。

---

## 第三步: 运行打包后的系统

### 3.1 启动后端服务

在 `backend` 目录下运行：

```powershell
cd backend
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

或者指定配置文件：

```powershell
java -jar target/backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

后端将运行在: http://localhost:8080

### 3.2 启动前端静态文件服务

方式一：使用 Vite preview (推荐)

```powershell
cd frontend
yarn preview
```

方式二：使用 http-server

```powershell
# 先安装 http-server（全局安装一次即可）
npm install -g http-server

# 启动服务
cd frontend/dist
http-server -p 5599
```

前端将运行在: http://localhost:5599

---

## 第四步: 访问系统

在浏览器中打开: **http://localhost:5599**

---

## 打包文件说明

### 后端 JAR 包

- 位置: `backend/target/backend-0.0.1-SNAPSHOT.jar`
- 大小: 约 50-80 MB
- 包含所有依赖，可独立运行

### 前端静态文件

- 位置: `frontend/dist/`
- 包含: HTML, CSS, JS 和资源文件
- 可部署到任何静态文件服务器

---

## 部署到服务器（可选）

### 1. 后端部署

将 `backend-0.0.1-SNAPSHOT.jar` 上传到服务器，运行：

```bash
nohup java -jar backend-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
```

### 2. 前端部署

将 `frontend/dist/` 目录下的所有文件上传到服务器，使用 Nginx 配置：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 注意事项

1. **数据库连接**: 确保 PostgreSQL 数据库可访问
2. **端口配置**: 可在 `application.yml` 中修改后端端口
3. **环境变量**: 可通过环境变量覆盖配置，如：
   ```powershell
   java -jar backend-0.0.1-SNAPSHOT.jar --server.port=9090
   ```
4. **跨域问题**: 如果前后端不在同一域名，需配置 CORS
