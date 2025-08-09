<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="2" class="mb-6">
        <v-tabs
          v-model="activeTab"
          bg-color="white"
          color="primary"
          align-tabs="center"
          show-arrows
        >
          <v-tab value="log">
            <v-icon class="mr-2">mdi-text-box</v-icon>
            日志配置
          </v-tab>
          <v-tab value="scrape">
            <v-icon class="mr-2">mdi-image</v-icon>
            刮削配置
          </v-tab>

          <v-tab value="media">
            <v-icon class="mr-2">mdi-movie</v-icon>
            媒体库配置
          </v-tab>
        </v-tabs>

        <v-card-text class="pa-6">
          <v-window v-model="activeTab">
            <!-- 日志配置 -->
            <v-window-item value="log">
              <LogPage ref="logPageRef" />
            </v-window-item>

            <!-- 刮削配置 -->
            <v-window-item value="scrape"
              ><ScrapePage ref="scrapePageRef" />
            </v-window-item>

            <!-- 媒体库配置 -->
            <v-window-item value="media">
              <MediaPage ref="mediaPageRef" />
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup name="Settings">
import { ref, watch, onMounted } from "vue";
import LogPage from "./LogPage.vue";
import ScrapePage from "./ScrapePage/index.vue";
import MediaPage from "./MediaPage/index.vue";

const activeTab = ref("log");

const logPageRef = ref();
const scrapePageRef = ref();
const mediaPageRef = ref();

async function loadData() {
  switch (activeTab.value) {
    case "log":
      console.log("Loading log config data...");
      if (logPageRef.value?.loadData) {
        await logPageRef.value.loadData();
      }
      break;

    case "scrape":
      if (scrapePageRef.value?.loadData) {
        await scrapePageRef.value.loadData();
      }
      break;

    case "media":
      if (mediaPageRef.value?.loadData) {
        await mediaPageRef.value.loadData();
      }
      break;
  }
}

watch(activeTab, loadData);
onMounted(loadData);
</script>

<style scoped>
.v-tabs--align-tabs-center .v-tab {
  margin: 0 8px;
}
</style>
