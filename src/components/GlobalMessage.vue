<template>
  <v-snackbar
    v-model="globalMessageState.show"
    :color="globalMessageState.color"
    :timeout="globalMessageState.timeout"
    location="top"
  >
    <template v-slot:actions>
      <v-btn
        variant="text"
        @click="hideMessage"
        icon="mdi-close"
        size="small"
      />
    </template>
    {{ globalMessageState.message }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { globalMessageState, hideMessage } from "@/utils/message";
</script>
