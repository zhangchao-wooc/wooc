import { fileURLToPath, URL } from 'node:url'
import * as fs from 'node:fs'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Markdown from 'unplugin-vue-markdown/vite'
import MarkdownItPrism from 'markdown-it-prism'
import Prism from 'prismjs'
import loadLanguages from 'prismjs/components/index'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)

const BLOG_TYPES = [{
  title: '前端',
  route: '/blog/font-end'
}, {
  title: '源码分析',
  route: '/blog/source-code-analysis'
}, {
  title: '系统',
  route: '/blog/system'
}]

const BLOG_DATA_PATH = resolve(process.cwd(), 'src/blog/data.json')

const readBlogData = (): Record<string, any> => {
  try {
    const raw = fs.readFileSync(BLOG_DATA_PATH, 'utf-8')
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed?.data)) {
      return {
        types: Array.isArray(parsed?.types) ? parsed.types : BLOG_TYPES,
        data: parsed.data
      }
    }
  } catch {
    // fallback to default data structure
  }

  return {
    types: BLOG_TYPES,
    data: []
  }
}

const blog: Record<string, any> = readBlogData()

const BlogType: Record<string, string> = {
  'front-end': '前端',
  'source-code-analysis': '源码分析',
  'system': '系统'
}

const MARKDOWN_STATIC_ORIGIN = (process.env.VITE_MD_STATIC_ORIGIN || '').replace(/\/$/, '')

const withStaticOrigin = (url: string) => {
  if (!MARKDOWN_STATIC_ORIGIN || !url) {
    return url
  }

  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('//') ||
    url.startsWith('data:') ||
    url.startsWith('mailto:') ||
    url.startsWith('tel:') ||
    url.startsWith('#')
  ) {
    return url
  }

  if (url.startsWith('/src/blog')) {
    return `${MARKDOWN_STATIC_ORIGIN}${url}`
  }

  return url
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      AutoImport({
        imports: [VueRouterAutoImports]
      }),
      Markdown({
        headEnabled: true,
        frontmatterPreprocess: (frontmatter: Record<string, any>, options, id, defaultHeadProcess) => {
          // deal blog data
          const normalizedId = id.replaceAll('\\', '/')
          const match = normalizedId.match(/\/src\/blog\/(.+)\.md$/)
          if (!match) {
            return {
              head: {
                ...frontmatter,
                title: `${frontmatter.title} - wooc.top`
              },
              frontmatter
            }
          }
          const filePath = match[1]
          const params = {
            title: frontmatter.title || filePath.split('/')[1] || '',
            type: BlogType[filePath.split('/')[0]] || '',
            author: 'wooc / 张超',
            createTime: frontmatter.createTime,
            createTimeStamp: frontmatter.createTime ? dayjs(frontmatter.createTime, 'YYYY 年 MM 月 DD 日').format('SSS') : frontmatter.createTime,
            updateTime: frontmatter.updateTime || frontmatter.createTime || '',
            parentRoute: filePath.split('/')[0],
            route: `/blog/${filePath}`
          }

          const currentIndex = blog.data.findIndex((item: Record<string, any>) => item.route === params.route)
          if (currentIndex === -1) {
            blog.data.push(params)
          } else {
            blog.data[currentIndex] = params
          }

          fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify(blog, null, 2))
          return {
            head: {
              ...frontmatter,
              title: `${frontmatter.title} - wooc.top`
            },
            frontmatter
          }
        },
        markdownSetup: (md: any) => {
          md.core.ruler.after('inline', 'add-static-origin', (state: any) => {
            state.tokens.forEach((token: any) => {
              if (token.attrs && typeof token.attrGet === 'function' && typeof token.attrSet === 'function') {
                ;['src'].forEach((attrName) => {
                  const value = token.attrGet(attrName)
                  if (typeof value === 'string') {
                    token.attrSet(attrName, withStaticOrigin(value))
                  }
                })
              }

              if ((token.type === 'html_inline' || token.type === 'html_block') && typeof token.content === 'string') {
                token.content = token.content.replace(
                  /(src|href)\s*=\s*(["'])(\/[^"']*)\2/g,
                  (_: string, attrName: string, quote: string, rawUrl: string) => `${attrName}=${quote}${withStaticOrigin(rawUrl)}${quote}`
                )
              }
            })
          })

          md.use(MarkdownItPrism as any, {
            defaultLanguage: 'bash', // 设置默认语言
            plugins: ['line-numbers'], // 添加其他插件
            init() {
              loadLanguages([
                'bash',
                'javascript',
                'typescript',
                'jsx',
                'tsx',
                'json',
                'css',
                'scss',
                'markup',
                'yaml',
                'sql',
              ])
              void Prism
            }
          })
        }
      }),
      VueRouter({
        routesFolder: ['src/views', { src: 'src/blog', path: 'blog/' }],
        extensions: ['.vue', '.md'],
        extendRoute: (route: any) => {
          return route
        }
      }),
      vue({
        include: [/\.vue$/, /\.md$/],
      }),
      vueJsx(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
