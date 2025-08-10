<template>
  <v-navigation-drawer v-model="navigationStatus">
    <v-list density="compact" nav class="px-2">
      <v-list-item
        v-for="item in navigations"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="{ name: item.to }"
        active-class="primary--text bg-blue-lighten-5"
        rounded="xl"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup name="APPNavigation">
import { useNavigationManager } from "@/hooks";
const { navigationStatus } = useNavigationManager();
interface NavigationsItem {
  title: string; // 导航标题
  icon: string; // 图标名称
  to: string; // 路由路径
}
const navigations: NavigationsItem[] = [
  { title: "仪表盘", icon: "mdi-view-dashboard", to: "DashBoard" },
  { title: "存储管理", icon: "mdi-database", to: "Storage" },
  { title: "系统设置", icon: "mdi-cog", to: "Settings" },
];
</script>
