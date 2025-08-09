<template>
  <v-card outlined>
    <div class="d-flex align-center mb-6">
      <v-icon large color="primary" class="mr-3">mdi-movie</v-icon>
      <h2 class="text-h5 font-weight-bold">媒体库重命名格式</h2>
    </div>
    <FormatPage ref="formatPageRef" />
  </v-card>

  <v-card outlined>
    <div class="d-flex align-center mb-6">
      <v-icon large color="primary" class="mr-3"
        >mdi-text-box-edit-outline</v-icon
      >
      <h2 class="text-h5 font-weight-bold">媒体库配置</h2>
    </div>
    <LibrariesPage ref="librariesPageRef" />
  </v-card>

  <v-card outlined>
    <div class="d-flex align-center mb-6">
      <v-icon large color="primary" class="mr-3"
        >mdi-text-box-edit-outline</v-icon
      >
      <h2 class="text-h5 font-weight-bold">自定义词条配置</h2>
    </div>
    <CustomwordPage ref="customwordPageRef" />
  </v-card>
</template>

<script lang="ts" setup name="MediaPage">
import FormatPage from "./FormatPage.vue";
import LibrariesPage from "./LibrariesPage.vue";
import CustomwordPage from "./CustomwordPage.vue";
import { ref, defineExpose } from "vue";

const formatPageRef = ref();
const librariesPageRef = ref();
const customwordPageRef = ref();

async function loadData() {
  if (formatPageRef.value) {
    await formatPageRef.value.loadData();
  }
  if (librariesPageRef.value) {
    await librariesPageRef.value.loadData();
  }
  if (customwordPageRef.value) {
    await customwordPageRef.value.loadData();
  }
}

defineExpose({ loadData });
</script>
