# 第一阶段：构建阶段 (使用Node.js镜像)
FROM node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json（或yarn.lock）
COPY package*.json ./

# 安装依赖（使用npm ci用于确定性构建，或使用yarn）
RUN npm ci --only=production && npm cache clean --force
# 如果使用yarn：RUN yarn install --frozen-lockfile --production

# 复制源代码
COPY . .

# 构建项目（假设构建命令是"npm run build"）
RUN npm run build-only

# 第二阶段：生产环境阶段 (使用Nginx镜像)
FROM nginx:alpine

# 安装curl用于健康检查（可选）
RUN apk add --no-cache curl

# 从构建阶段复制构建好的静态文件到Nginx的HTML目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义Nginx配置文件（如果有）
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露80端口
EXPOSE 80

# 健康检查（可选）
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# 启动Nginx（前台运行）
CMD ["nginx", "-g", "daemon off;"]
