---
title: 网站首屏渲染优化
theme: smartblue
highlight: an-old-hope
meta:
  - name: description
    content: web 首屏渲染优化
  - name: keywords
    content: web 优化、首屏渲染优化、性能优化、网站优化、前端优化、前端性能优化
createTime: 2023 年 2 月 17 日
updateTime: 2023 年 2 月 17 日
---

# 网站首屏渲染优化
## 网站优化的几种方法

如果你了解一个问题的基本链路，那你对于网站优化的流程就有了一个基本的了解。

> 从输入 url 到页面呈现，中间发生了什么？  

**主要节点**
- DNS 解析。通过 DNS 解析到服务器真实的 IP 地址
- 网络请求。服务器带宽、 请求协议 等。
- 静态资源。HTML、CSS、JS、Font、Image 等
- 页面渲染

### DNS
准确的说是 DNS 通过 URL 解析出真实服务器 IP 地址的速度。基本原理可以看 [《阮一峰的博客》](!https://www.ruanyifeng.com/blog/2022/08/dns-query.html)。

可以通过配置 CDN 加速，加快网址的访问速度。

### 网络请求
请求发送到服务器响应结束的整个流程。影响到资源的请求时间、下载速度以及请求阻塞与否。
#### 请求速度、响应速度
受到 CDN 的影响，CDN 节点越多，请求速度越快。
同时受到服务器带宽、静态资源大小的影响。

想要最好的效果，最暴力的方式就是看投入的 ”钞能力“

#### 通讯协议
一般指 HTTP 协议的版本。

常见的版本为 HTTP 1.1（TCP），目前正在逐渐更替为 HTTP 1.2（TCP) 正在开始推广的为 HTTP 1.3(UDP)

HTTP 1.1 协议由于历史的原因，其请求头及响应头部都包含大量的无效信息，且每个请求都需要单独建立一次与服务的连接，增加网络的传输大小及建立连接的时间，必然会影响接口的请求与响应的时间。

浏览器发送 HTTP 请求都有并发量的限制，使用 HTTP 1.1 协议会使整体的响应时间更长

HTTP 1.2、1.3 均在压缩请求头、建立长连接、压缩传输内容的形式，解决传输内容大、建立连接时间长、并发量等限制上整体优化传输速度。

#### 服务器配置
如需实现 HTTP 1.2、1.3版本，一般需要对 Nginx 进行配置（既服务器代理，代理有很多种，这里以 Nginx 为例）。

同时可以配置 Nginx 使用服务器的最大核心数、请求处理数、内容压缩比等，优化服务器处理连接的数量、处理速度既内容传输速度。

同时提升服务器的带宽，可以更好的解决服务器处理数据和传输数据的速度。我们一般称之为：”钞能力“


### 静态资源
#### HTML、CSS、JS
单个资源的 chunk 包最好小于 200k, 当然这已经是比较大的容量，尽量的小但又不能过小。

因为过小的文件过多会导致页面的并发量增加， 触发浏览器限制，同时导致更多的建立连接的时间，得不偿失。

同时做好按需加载。只加载当前页面需要的资源。

#### Image 等
网站中随便一张 Image 的图片都是几十、上百 k 的大小，所以往往也是优化的重点。
一般使用一下几种方式优化

1. 压缩图片大小或是转换为 webp 等较小的且无损的格式。
2. 使用懒加载，即在 Image 标签的 loading 属性设置为 lazy 懒加载。当图片不在可视区域时不加载。减少首屏加载的资源大小。
3. 也可将图片上传至 CDN 连接，通过 CDN 的优化，通常比自己的服务器返回的速度更快。
4. 如果不考虑 CDN, 也可将图片转为 SVG 格式，拥有更小体积的同时可做到无损放大。
   
同时提醒，不要过度压缩图片，否则在大屏状态下会很模糊影响观感。


#### Font
字体包通常也是静态资源的大头，尤其是在企业官网、宣传页面会有较多的艺术字体。

优化的思路和代码优化一致，即按需引用。艺术字体使用的字数有限，可使用字体工具删除未使用到的字体。

工具：[font-spider](!https://github.com/aui/font-spider/blob/master/README-ZH-CN.md)

删除的逻辑可按照使用到该字体内容更新的频繁程度来决定删除的程度

**删除策略**

  1. 删除所有未使用到的
  2. 删除未使用到的语言、特殊字符
  3. 删除生僻字、特殊字符

**对应情况**
- 更新频率极低的文案。1
- 经常更新但基本用不到其他语言的 2
- 经常更新、语言广泛但多为简单语言的 3

这一步做好，你的收益跟字体包大小呈正比。例如我之前的真实案例，使用到的字体包为 20M，优化了 19M 的大小（属于第一种策略）。

#### Video
视频资源还好，应该不会有人将视频资源直接打包放到项目里。

一般直接放到 CDN 上，远程加载视频，大部分时候都是采用边放边下载的形式去播放。

**视频类的优化主要在以下几点**
- 制作时尽量简单，如大面积的黑色或白色背景，这样可以很大程度上减少视频的初始大小
- 压缩。同 Image 的压缩策略，压缩的同时要考虑大屏状态下的视频质量。
- 添加视频加载前的默认图片。一般为第一帧图片，防止视频加载在网速较慢时产生较长时间的白屏。


### 页面渲染
主要是减少页面布局的复杂度及产生 Reflow、Repaint 的次数。
