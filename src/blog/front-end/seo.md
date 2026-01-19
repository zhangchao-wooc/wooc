# SEO
提升网站排名。主要在于符合各搜索引擎的排名规则。
AI 工具出来以后，会弱化浏览器的 SEO 排名规则，同时生成一套针对 AI 的 SEO 设置。

## sitemap.xml
一般使用工具在网站构建时自动生成网站地图。搜索引擎会读取此文件，以便更高效地抓取你的网站。让搜索引擎知道你认为网站中的哪些网页和文件比较重要。  
sitemap 的文件类型有好几种，最常用的就是 xml 格式。

**示例结构**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>https://example.com/blog</loc> // 页面地址
    <lastmod>2026-01-19T02:33:44.460Z</lastmod> // 最后修改时间。始终准确并可验证（例如通过与网页的最后修改日期进行比较），Google 会使用该值
    <changefreq>daily</changefreq> // 更新频率。Tips: Google 会忽略
    <priority>0.7</priority> // 页面权重。Tips: Google 会忽略
  </url>
</urlset>
```


在 robots.txt 文件中添加下方，指定站点地图的路径。搜索引擎会在下次抓取 robots.txt 文件时找到该站点地图。
``` txt
Sitemap: https://example.com/sitemap.xml
```


### 搜索引擎抓取站点地图  
1. 等待搜索引擎自然抓取。
2. 使用 Search Console 网站或 API 主动提交。
3. 将 Sitemap 链接嵌入 robots.txt 文件，待搜索引擎读取 robots.txt 时获取 Sitemap。


### 可用工具
- next-sitemap  用于 nextjs 框架。
- sitemap  cli 工具
- 部分 CMS 自带生成工具。


### 参考链接
什么是站点地图：https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview?hl=zh-cn  
创建和提交站点地图：https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=zh-cn  
站点地图最佳做法：https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap?hl=zh-cn#general-guidelines

## robots.txt
规定了搜索引擎抓取工具可以访问您网站上的哪些网址。

- 可以阻止大量的爬虫导致的流量和服务消耗
- 并非所有搜索引擎都支持 robots.txt 规则
- 不同的抓取工具会以不同的方式解析语法
- 如果其他网站上有链接指向被 robots.txt 文件屏蔽的网页，则此网页仍可能会被编入索引


