<template>
  <v-card v-if="custom_rule || meta_rule" variant="flat" class="pa-3">
    <v-divider />
    <div v-if="custom_rule">
      <div class="d-flex align-center mb-2 mt-4">
        <v-icon class="mr-2 text-primary">mdi-account-edit</v-icon>
        <span class="font-weight-medium">自定义规则</span>
      </div>
      <div class="flex-grow-1 d-flex align-center">
        <v-chip
          color="primary"
          variant="tonal"
          size="small"
          class="ma-1 text-truncate"
          style="max-width: 100%"
        >
          {{ custom_rule }}
        </v-chip>
      </div>
    </div>
    <div v-if="meta_rule">
      <div class="d-flex align-center mb-2 mt-4">
        <v-icon class="mr-2 text-success">mdi-movie-filter</v-icon>
        <span class="font-weight-medium">应用媒体规则</span>
      </div>
      <div class="flex-grow-1 d-flex align-center">
        <v-chip
          color="success"
          variant="tonal"
          size="small"
          class="ma-1 text-truncate"
          style="max-width: 100%"
        >
          {{ meta_rule }}
        </v-chip>
      </div>
    </div>
  </v-card>
</template>
<script lang="ts" setup name="RuleInfo">
import { defineProps } from "vue";

const props = defineProps<{
  custom_rule: string;
  meta_rule: string;
}>();
</script>
