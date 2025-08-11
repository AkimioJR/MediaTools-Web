<template>
  <v-app id="inspire">
    <AppNavigation />
    <AppHeader />
    <v-main>
      <GlobalMessage />
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import AppNavigation from "@/layouts/AppNavigation.vue";
import AppHeader from "@/layouts/AppHeader.vue";
import GlobalMessage from "@/components/GlobalMessage.vue";
</script>
