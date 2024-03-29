---
title:  API 网关搭建
theme: condensed-night-purple
createTime: 2022 年 6 月 24 日
updateTime: 2022 年 6 月 24 日
---

# API 网关搭建

公司内部系统初步构建，需求如下
>1. sso 登陆  
>2. 接口聚合、转发
>3. 访问控制
>4. 统一鉴权
>5. 动态配置
>6. 服务监控
>7. 链路查询

# 框架选择
node 框架很多，最终选择了 koa 而不是集成度更高的（egg、midway...）或 更快的（fastify...）。

主要有以下几点原因
>1. 团队成员没有人有搭建经验或是熟练的 node 框架使用经验
>2. 没有人熟悉 API 网关的搭建及相关。
>3. 需求会更加定制化, 
>4. 社区丰富

综合以上需求，确定使用 koa2 从头搭建一个网关。

# 基本架构

koa2 \ koa-ip \ jsonwebtoken \ koa-better-http-proxy \ koa-redis \koa-router \koa-views

# 接口聚合
所有内部系统的接口均请求到 API 网关，由网关进行统一的权限控制、登陆校验、接口分发

## 优点
1. 入口及出口统一，集中控制
2. 减少重复开发
3. 高内聚、低耦合

## 需要考虑的问题
1. 网关必然会有较大的访问流量，需做好负载均衡
2. 所有应用集中入口，需要确保网关的容灾能力
3. 应用监控及请求链路的查询

总的来说，接口聚合产生的优点明显，其带来的问题也很明显，需要确保网关的高可用、可拓展、低耦合
# sso 登陆

## 方案选择
jsonwebtoken + koa-redis + koa-views

## 前置考虑

### 看到的问题
1、jwt 需要客户端手动处理，将 token 存在本地并在每次请求时放在 header 上  
2、jwt 无法进行退出登陆的设置

### 希望达到的效果及方案  
1、登陆页与应用分离，无须重复开发，方便更新  koa-views  
2、登录流程尽量减少开发者的操作  set cookies  
3、实现内部系统登陆一次即可使用所有应用  set cookies  
4、聚合请求入口，做统一鉴权管理  proxy  
# 代理
校验用户登陆状态及权限并代理到相应的服务、接口

## 方案选择
 sso + koa-better-http-proxy

### 接口转发过滤
1、服务判断
网关代理中是否支持该服务配置

2、登陆状态判断
根据 jwt 的校验结合 redis 缓存是否存在判断是否正在登陆且在有效期内

3、用户权限
判断用户访问服务、接口的权限，符合条件的转发，不符合的进行相关提醒

# 访问控制
使用 koa-ip 维护一个访问白名单即可

# 统一鉴权
根据用户权限系统判断访问权限即可

# 配合需要的相关平台

1. 网关配置平台
2. acl 权限平台
3. 日志平台
4. 链路平台
5. 监控报警平台

# 遇到的问题

## set cookies
使用 node 在鉴权成功后重定向到指定页面的同时写入 cookies，如集中网关入口则必然出现跨域问题，服务器设置的 cookies 会被浏览器拒收，从而导致登陆操作失败

## 解决
1、前端请求配置
以 axios 为例
```js
// 允许跨域时携带 cookies。确保接口请求的服务为可信，否则会产生安全问题
axios.defaults.withCredentials = true
```


2、服务端配置  

koa 项目 中配置如下
```js
import cors from '@koa/cors' // 解决跨域问题

app.proxy = true

app.use(cors({
  // 每个请求的 origin 必须为当前请求的域名
  origin: (ctx): string => {
      const origin = ctx.request.header.origin || ''
      if (origin?.includes('wooc.com')) {
        return origin
      }
      return ''
    },
  credentials: true // 允许跨越请求携带 cookies
}))

```
