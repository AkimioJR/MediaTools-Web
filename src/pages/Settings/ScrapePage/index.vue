<template>
  <v-card outlined>
    <div class="d-flex align-center mb-6">
      <v-icon large color="primary" class="mr-3">mdi-movie</v-icon>
      <h2 class="text-h5 font-weight-bold">TMDB 设置</h2>
    </div>
    <TMDBPage ref="tmdbPageRef" />
  </v-card>

  <v-card outlined>
    <div class="d-flex align-center mb-6">
      <v-icon large color="primary" class="mr-3">mdi-image</v-icon>
      <h2 class="text-h5 font-weight-bold">Fanart 设置</h2>
    </div>
    <FanartConfigComponent ref="fanartPageRef" />
  </v-card>
</template>

<script lang="ts" setup name="ScrapePage">
import TMDBPage from "./TMDBPage.vue";
import FanartConfigComponent from "./FanartPage.vue";
import { ref, defineExpose } from "vue";

const tmdbPageRef = ref();
const fanartPageRef = ref();

async function loadData() {
  if (tmdbPageRef.value) {
    await tmdbPageRef.value.loadData();
  }
  if (fanartPageRef.value) {
    await fanartPageRef.value.loadData();
  }
}

defineExpose({ loadData });
</script>
