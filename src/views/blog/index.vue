<template>
  <div class="blog">
    <div class="blog-box">
      <template v-for="item in allBlogs" :key="item.title">
        <RouterLink :to="`${item.route}`" class="link">
          <div class="blog-item">
            <div class="blog-item-name">
              {{ item.title }}
            </div>
            <div class="blog-item-type">
              {{ item.type }}
            </div>
            <div class="blog-item-date">
              {{ item.createTime }}
            </div>
          </div>
        </RouterLink>
      </template>
    </div>
    <div class="blog-types">
      <div class="blog-item" @click="clickBlogType({ type: '全部' })">
        <div class="blog-item-name">全部</div>
      </div>
      <template v-for="item in blogData.types" :key="item.title">
        <div class="blog-item" @click="clickBlogType(item)">
          <div class="blog-item-name">
            {{ item.title }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import blogData from "@/blog/data.json";
import type { RouterLink } from "vue-router";

type BlogItem = {
  title: string;
  type: string;
  author: string;
  updateTime: string;
  parentRoute: string;
  route: string;
  createTime?: string;
  createTimeStamp?: string;
};

type BlogTypeItem = {
  type?: string;
  title?: string;
};

const allBlogs = ref<BlogItem[]>(blogData.data as BlogItem[]);

const clickBlogType = (item: BlogTypeItem) => {
  if (item.type === "全部") {
    allBlogs.value = blogData.data as BlogItem[];
  } else {
    const currentBlogTypeData = blogData.data.filter((blog) => blog.type === item.title);
    allBlogs.value = currentBlogTypeData as BlogItem[];
  }
};
</script>

<style lang="scss" scoped>
.blog {
  padding: 10px;
  display: grid;
  justify-content: center;
  grid-template-columns: 800px 200px;
  gap: 15px;
  box-sizing: border-box;
  &-box {
    margin-top: 10px;
    padding: 10px;
    min-width: 300px;
    max-width: 800px;
    width: 100%;
    min-height: 300px;
    height: calc(100vh - 100px);
    border-radius: var(--g-border-radius);
    background-color: var(--g-border-color-1);
    overflow: auto;
    box-sizing: border-box;
  }
  &-item {
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 12px;
    transition: all 0.5s;
    cursor: pointer;
    &:hover {
      padding-left: 15px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: var(--g-border-radius);
    }
    &-name {
      flex: 3;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &-type {
      flex: 1;
      flex-shrink: 0;
      padding: 0 5px;
      width: 50px;
    }
    &-date {
      flex: 1.5;
      flex-shrink: 0;
      padding: 0 5px;
      width: 120px;
      text-align: right;
    }
  }

  .link {
    text-decoration: none;
  }

  &-types {
    margin-top: 10px;
    padding: 10px;
    min-height: 300px;
    width: 200px;
    border-radius: var(--g-border-radius);
    background-color: var(--g-border-color-1);
    box-sizing: border-box;
    overflow: auto;
  }
}

@media screen and (max-width: 800px) {
  .blog-item-type {
    display: none;
  }
}

@media screen and (max-width: 1200px) {
  .blog {
    grid-template-columns: minmax(300px, 1fr);
    &-box {
      margin: 10px auto 0;
    }
    &-types {
      display: none;
    }
  }
}
</style>
