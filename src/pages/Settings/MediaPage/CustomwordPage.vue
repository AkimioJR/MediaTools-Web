<template>
  <v-card v-if="isConfigReady" class="pa-6" elevation="2">
    <!-- 自定义识别词 -->
    <v-card class="mb-6" elevation="1">
      <v-card-title class="bg-blue-lighten-5 d-flex align-center">
        <v-icon color="blue" class="mr-2">mdi-magnify</v-icon>
        <span>自定义识别词</span>
        <v-spacer></v-spacer>
        <v-btn
          small
          text
          color="primary"
          @click="showIdentifyWordHint = !showIdentifyWordHint"
        >
          <v-icon left small>mdi-information-outline</v-icon>
          {{ showIdentifyWordHint ? "隐藏提示" : "显示提示" }}
        </v-btn>
      </v-card-title>
      <v-textarea
        v-model="identifyWordText"
        auto-grow
        rows="4"
        max-rows="10"
        outlined
        placeholder="输入自定义识别词规则，每行一个"
        class="mb-2"
      />
      <v-expand-transition>
        <div v-if="showIdentifyWordHint" class="hint-box">
          <div class="hint-content">
            <p
              v-for="(line, index) in identifyWordHints"
              :key="index"
              class="hint-line"
            >
              {{ line }}
            </p>
          </div>
        </div>
      </v-expand-transition>
    </v-card>

    <!-- 自定义词条 -->
    <v-card class="mb-6" elevation="1">
      <v-card-title class="bg-green-lighten-5">
        <v-icon color="green" class="mr-2">mdi-format-list-bulleted</v-icon>
        自定义词条
      </v-card-title>
      <v-textarea
        v-model="customizationText"
        auto-grow
        rows="4"
        max-rows="10"
        outlined
        placeholder="每行一个自定义词条"
        hint="用于电影/电视剧重命名的自定义词（每行一个，支持使用正则表达式，注意转义）"
        persistent-hint
      />
    </v-card>

    <!-- 媒体库过滤词 -->
    <v-card class="mb-6" elevation="1">
      <v-card-title class="bg-orange-lighten-5">
        <v-icon color="orange" class="mr-2">mdi-filter</v-icon>
        媒体库过滤词
      </v-card-title>

      <v-textarea
        v-model="excludeWordsText"
        auto-grow
        rows="4"
        max-rows="10"
        outlined
        placeholder="每行一个过滤词"
        hint="路径中包含这些词的将不会自动转移（每行一个）"
        persistent-hint
      />
    </v-card>

    <div class="d-flex justify-end mt-4">
      <v-btn color="primary" @click="updateData" size="large" class="px-6">
        <v-icon left>mdi-content-save</v-icon>
        保存配置
      </v-btn>
    </div>
  </v-card>
</template>

<script lang="ts" setup name="MediaCustomwordPage">
import { defineExpose, ref } from "vue";
import { useCustomWordConfig } from "@/hooks";

const showIdentifyWordHint = ref(false);
const identifyWordHints: string[] = [
  "屏蔽词",
  "被替换词 => 替换词",
  "前定位词 <> 后定位词 >> 集偏移量（EP）",
  "被替换词 => 替换词 && 前定位词 <> 后定位词 >> 集偏移量（EP）",
  "（其中<被替换词>支持正则表达式，其余不支持，单独一个<被替换词>则会被替换为空字符串）",
];

const {
  isConfigReady,

  identifyWordText,
  customizationText,
  excludeWordsText,

  loadData,
  updateData,
} = useCustomWordConfig();

defineExpose({ loadData });
</script>

<style scoped>
.hint-box {
  position: relative;
  background-color: #e3f2fd;
  border-radius: 4px;
  padding: 16px 32px 16px 16px;
  margin-top: 8px;
  font-size: 0.9rem;
  color: #0d47a1;
  border: 1px solid #bbdefb;
}

.hint-content {
  max-height: 150px;
  overflow-y: auto;
}

.hint-line {
  margin-bottom: 8px;
  line-height: 1.4;
}
</style>
