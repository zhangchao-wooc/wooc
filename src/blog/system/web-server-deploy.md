---
title: 基础 web 服务器搭建
meta:
  - name: description
    content: 基础 web 服务器搭建
  - name: keywords
    content: 基础 web 服务器搭建、前端服务器搭建、前端服务器配置
theme: condensed-night-purple
createTime: 2023 年 10 月 18 日
updateTime: 2024 年 1 月 23 日
---

# 基础 web 服务器搭建

搭建满足前端项目运行环境的服务器。 以 **centos 8.0** 系统为例。

<br/>

## 必备基础配置
``centos`` 默认的包管理器为 ``yum``。 

``yum -y update`` 升级所有包同时也升级软件和系统内核。或者执行 ``yum -y upgrade`` 只升级所有包，不升级软件和系统内核。  
<br/>

### <a href="https://github.com/curl/curl" target="_blank">curl</a>
这里主要用来安装其他安装包，比较方便，也是比较常用的。
```sh 
$ yum install curl -y
```  
<br/>

### <a href="https://github.com/nvm-sh/nvm" target="_blank">nvm</a>
nvm 用于管理 node 版本, 可以到 <a href="https://github.com/nvm-sh/nvm" target="_blank">[Github nvm]</a> 获取最新版本进行安装。这里使用 0.39.7 版本进行演示。

```sh
# 安装 nvm
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 15916  100 15916    0     0  97434      0 --:--:-- --:--:-- --:--:-- 97644
=> Downloading nvm as script to '/root/.nvm'

=> Appending nvm source string to /root/.bashrc
=> Appending bash_completion source string to /root/.bashrc
=> Close and reopen your terminal to start using nvm or run the following to use it now:

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# 根据 nvm 输出的提示，配置 nvm 的环境变量
$ export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# 验证 nvm 是否安装成功
$ nvm -v
0.39.7

# 安装指定的 node 版本; 安装的第一个版本成为默认版本;
$ nvm install v16.20.2
```  
<br/>  

#### nvm 常用命令
```sh
$ nvm install v16.20.2 # 安装指定版本的 node; 安装的第一个版本成为默认版本;
$ nvm uninstall v16.20.2 # 卸载 node 版本, 不可卸载当前正在使用的 node 版本;
$ nvm ls # 列出本地已安装的 node 版本
$ nvm ls-remote # 列出远程可安装的 node 版本
$ nvm use v18.19.0 # 切换到 node 版本，即将切换到的版本需要先下载。如想永久生效，需设置为 node 的默认版本;
$ nvm alias default v16.20.2 # 设置默认 node 版本为 v16.20.2
$ nvm current # 显示当前使用的 node 版本
$ nvm which v16.20.2 # 获取可执行文件的安装路径
```
<br/>

### <a href="https://github.com/Unitech/pm2" target="_blank">PM2</a>
PM2 是一个守护进程管理器, 是使用比较广泛的 nodejs 项目的进程管理工具。提供日志管理、负载均衡、自动重启等功能。 PM2 提供了实时监控和诊断工具，可以查看内存使用情况、CPU 使用情况和请求量等关键指标，帮助排查问题和性能调优。

```sh
$ npm install pm2 -g
# 使用 npm 命令启动项目，并命名为 my-project; 也可直接执行 index.js 入口脚本来启动项目。
$ pm2 start -n my-project npm -- run start
# 列出所有进程
$ pm2 list
┌────┬───────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name          │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼───────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ my-project    │ default     │ N/A     │ fork    │ 13668    │ 0      │ 21   │ online    │ 0%       │ 0b       │ root     │ disabled │
└────┴───────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
# 查看项目运行监控
$ pm2 monit
```
<br/>

#### pm2 常用命令
```sh
$ pm2 start app.js -n my-project # 启动项目
$ pm2 restart my-project # 重启项目, 可使用命名的项目名称或者 id
$ pm2 stop my-project # 停止项目
$ pm2 delete my-project # 删除项目
$ pm2 logs # 查看项目日志
$ pm2 monit # 查看项目运行监控
```
<br/>

### <a href="https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-open-source/#compiling-and-installing-from-source" target="_blank">Nginx</a>
使用最广泛的代理服务，社区庞大、相关配置比较好查找。用于设置前端文件的代理服务器。可配置 https 证书、服务端压缩、负载均衡等必要配置，也可结合其他的开源插件使用更丰富的功能。

**安装方式分两种**
- 预构建包安装。安装简单，满足一般需求。
- 源码安装。安装复杂，方便扩展。

一般使用与构建包安装即可满足需求，如需使用 lua 插件等高级功能，可使用源码安装。
<br/>

#### 预构建包安装

**安装分为两种**
- EPEL 存储库安装，安装简单，但安装的 nginx 版本往往是落后的。
- 官方 NGINX 存储库安装，配置稍多，配置一次以后，此后提供的包始终是最新的。``（推荐）``

```sh
# 1. 安装官方 NGINX 存储库
$ sudo yum install yum-utils

# 2. 将以下内容添加到 nginx.repo 文件中
$ sudo vi /etc/yum.repos.d/nginx.repo
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

# Tips:
#  默认使用 nginx-stable 存储库. （推荐）
#  nginx-mainline 为最新版
#  执行 sudo yum-config-manager --enable nginx-mainline 使用 nginx-mainline 存储库

# 3. 更新存储库
$ sudo yum update 

# 4. 安装 nginx 此时将安装 nginx 最新的稳定版本 (默认使用 nginx-stable 存储库)。
# 4.1 如设置使用 nginx-mainline， 此时将安装 nginx 最新版本 (使用 nginx-mainline 存储库)。
$ sudo yum install nginx 

# 5. 启动 nginx
$ systemctl start nignx 

 # 6. 验证 NGINX 开源代码是否已启动并正在运行, 出现以下输出即为成功
$ curl -I 127.0.0.1
HTTP/1.1 502 Bad Gateway
Server: nginx/1.24.0
Date: Mon, 22 Jan 2024 03:35:31 GMT
Content-Type: text/html
Content-Length: 157
Connection: keep-alive

# 7. 设置 nginx 开机自启动（推荐，防止服务器原因重启后可自动拉起 nginx 服务）
$ systemctl enable nginx 
```

#### nginx 常用命令
```sh
$ systemctl start nignx # 启动 nginx
$ systemctl restart nignx # 重新启动 nginx
$ systemctl status nignx # 查看 nginx 状态
$ systemctl stop nignx # 停止 nginx
$ systemctl enable nginx # 设置 nginx 开机自启动（推荐）
$ systemctl disable nginx # 关闭 nginx 开机自启动
```

#### 配置 nginx
```sh
# 备份默认的 nginx 配置文件
$ sudo mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak

# 编辑并新建 nginx 配置文件
$ sudo vi /etc/nginx/nginx.conf
# 配置内容并保存
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes 4; # 按服务器的 cpu 个数配置
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main; # nginx log 文件路径

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    gzip on; 
    gzip_min_length 10k;
    gzip_buffers 4 16k;
    gzip_http_version 1.1;
    gzip_comp_level 5;
    gzip_types  text/plain application/x-javascript text/css application/xml text/javascript application/x-httpd-php application/javascript application/json;
    gzip_disable "MSIE [1-6]\.";
    gzip_vary on;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

   server {
       listen 80;
       #填写绑定证书的域名, 如为通用域名证书可改为 *.wooc.com
       server_name gateway.wooc.com;
       #把http的域名请求转成https
       return 301 https://$host$request_uri;
   }

    server {
        listen       443 ssl http2 default_server;
        listen       [::]:443 ssl http2 default_server;
        server_name  gateway.wooc.com;
        root         /usr/share/nginx/html;

        # ssl 证书保存的目录，可根据自己的需求进行修改
        ssl_certificate /etc/pki/nginx/wooc.com_bundle.crt;
        ssl_certificate_key /etc/pki/nginx/wooc.com.key;
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout  10m;
        #请按照以下协议配置
        ssl_protocols TLSv1.2 TLSv1.3; 
        #请按照以下套件配置，配置加密套件，写法遵循 openssl 标准。
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE; 
        ssl_prefer_server_ciphers on;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        # 客户端渲染时使用此配置，如只使用构建好的前端产物
        location / {
          root /home/project/dist/; # 前端项目目录，可根据自己的需求进行修改
          index index.html;
          try_files $uri $uri/ /index.html;
        }

        # 服务端渲染使用此配置，如 next.js nuxt.js 等框架
        # location / {
        #   proxy_pass  http://localhost:3000; # 转发至本地服务端口
        #   proxy_set_header referer $http_referer;
        #   proxy_set_header Host $proxy_host; # 修改转发请求头，让3000端口的应用可以受到真实的请求
        #   proxy_set_header X-Real-IP $remote_addr;
        #   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        # }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }
}

# 检查 nginx 文件配置语法是否正确, 如下输出则为语法正确
$ nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```
<br/>

### 部署项目
使用手动上传或 CI/CD 工具上传前端构建产物到服务器指定目录，并重启 nginx 服务，即可完成部署。

