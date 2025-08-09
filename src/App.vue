<template>
  <v-app>
    <v-navigation-drawer permanent color="surface" class="elevation-3">
      <!-- 顶部品牌区域 - 使用flex布局确保整体高度一致 -->
      <div class="brand-section pa-4 d-flex align-center">
        <v-avatar size="48" color="primary" class="mr-3">
          <v-icon size="32" color="white">mdi-play-box-multiple</v-icon>
        </v-avatar>

        <div class="d-flex flex-column justify-center" style="height: 48px">
          <h1
            class="text-h6 font-weight-bold primary--text mb-0"
            style="line-height: 1.2"
          >
            MediaTools
          </h1>
          <p
            class="text-caption text-medium-emphasis mt-0"
            style="line-height: 1.2"
          >
            下一代媒体刮削/整理工具
          </p>
        </div>
      </div>

      <v-divider class="my-2" />

      <!-- 导航菜单 -->
      <v-list density="compact" nav class="px-2">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          title="仪表盘"
          :to="{ name: 'DashBoard' }"
          active-class="primary--text bg-blue-lighten-5"
          rounded="xl"
        />

        <v-list-item
          prepend-icon="mdi-database"
          title="存储管理"
          :to="{ name: 'Storage' }"
          active-class="primary--text bg-blue-lighten-5"
          rounded="xl"
        />

        <v-list-item
          prepend-icon="mdi-cog"
          title="系统设置"
          :to="{ name: 'Settings' }"
          active-class="primary--text bg-blue-lighten-5"
          rounded="xl"
        />
      </v-list>

      <!-- 底部空间填充 -->
      <v-spacer></v-spacer>

      <!-- 底部信息 -->
      <!-- <div class="pa-3 text-center text-caption text-disabled">
    v{{ version }} &copy; {{ new Date().getFullYear() }}
  </div> -->
    </v-navigation-drawer>

    <AppHeader />

    <v-main>
      <router-view />
    </v-main>

    <!-- 全局弹窗容器 -->
    <GlobalDialogs />

    <!-- 全局消息组件 -->
    <GlobalMessage />
  </v-app>
</template>

<script lang="ts" setup>
import GlobalMessage from "@/components/GlobalMessage.vue";
import AppHeader from "@/components/AppHeader.vue";
import GlobalDialogs from "@/components/GlobalDialogs.vue";
</script>

<style scoped>
/* 全局样式 */
</style>
