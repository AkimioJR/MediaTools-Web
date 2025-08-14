<template>
  <!-- <v-container fluid> -->
  <v-card variant="flat">
    <v-card-title>
      <v-row align="center">
        <v-col cols="auto">
          <h2>存储管理</h2>
        </v-col>
        <v-spacer />
        <v-col cols="auto">
          <v-btn-group>
            <v-btn
              color="primary"
              prepend-icon="mdi-folder"
              @click="showCreateFolderDialog = true"
              :disabled="!currentProvider"
            >
              新建文件夹
            </v-btn>

            <v-btn
              color="success"
              prepend-icon="mdi-upload"
              @click="showUploadDialog = true"
              :disabled="!currentProvider"
            >
              上传文件
            </v-btn>
          </v-btn-group>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <!-- 存储器选择 -->
      <v-row class="mb-4">
        <v-col cols="12" md="4">
          <v-select
            v-model="currentProvider"
            :items="providers"
            item-title="storage_type"
            item-value="storage_type"
            label="选择存储器"
            prepend-icon="mdi-database"
            variant="outlined"
            density="compact"
            @update:model-value="onProviderChange"
          />
        </v-col>
        <v-col cols="12" md="8">
          <!-- 路径导航 -->
          <v-breadcrumbs :items="breadcrumbs" divider="/" class="pa-0">
            <template v-slot:item="{ item }">
              <v-breadcrumbs-item
                :disabled="item.disabled"
                @click="item.href && navigateToPath(item.href)"
                class="cursor-pointer"
              >
                {{ item.title }}
              </v-breadcrumbs-item>
            </template>
          </v-breadcrumbs>
        </v-col>
      </v-row>

      <!-- 文件列表 -->
      <v-data-table
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="files"
        :loading="loading"
        item-value="path"
        class="elevation-1"
        density="compact"
        @click:row="onRowClick"
      >
        <template v-slot:item.name="{ item }">
          <div class="d-flex align-center">
            <v-icon
              :icon="item.is_dir ? 'mdi-folder' : getFileIcon(item.ext)"
              :color="item.is_dir ? 'amber' : 'grey'"
              class="me-2"
            />
            <span>{{ item.name }}</span>
          </div>
        </template>

        <template v-slot:item.size="{ item }">
          <span v-if="!item.is_dir">{{ formatFileSize(item.size) }}</span>
          <span v-else>-</span>
        </template>

        <template v-slot:item.mod_time="{ item }">
          <span>{{ formatDate(item.mod_time) }}</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn-group density="compact" variant="text">
            <v-btn
              v-if="!item.is_dir"
              icon="mdi-download"
              size="small"
              @click.stop="downloadFile(item)"
              title="下载"
            />
            <v-btn
              icon="mdi-content-copy"
              size="small"
              @click.stop="showCopyDialog(item)"
              title="复制"
            />
            <v-btn
              icon="mdi-content-cut"
              size="small"
              @click.stop="showMoveDialog(item)"
              title="移动"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              color="error"
              @click.stop="deleteFile(item)"
              title="删除"
            />
          </v-btn-group>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <!-- 上传对话框 -->
  <v-dialog v-model="showUploadDialog" max-width="500px">
    <v-card>
      <v-card-title>上传文件</v-card-title>
      <v-card-text>
        <v-file-input
          v-model="uploadFiles"
          label="选择文件"
          multiple
          prepend-icon="mdi-paperclip"
          variant="outlined"
          show-size
        />
        <v-text-field
          v-model="uploadPath"
          label="上传路径"
          prepend-icon="mdi-folder"
          variant="outlined"
          :value="currentPath"
          class="mt-3"
        />
        <v-progress-linear
          v-if="uploading"
          v-model="uploadProgress"
          color="primary"
          height="8"
          class="mt-3"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="showUploadDialog = false">取消</v-btn>
        <v-btn
          color="primary"
          :loading="uploading"
          @click="uploadFile"
          :disabled="!uploadFiles || uploadFiles.length === 0"
        >
          上传
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 新建文件夹对话框 -->
  <v-dialog v-model="showCreateFolderDialog" max-width="400px">
    <v-card>
      <v-card-title>新建文件夹</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="newFolderName"
          label="文件夹名称"
          prepend-icon="mdi-folder-plus"
          variant="outlined"
          autofocus
          @keyup.enter="createFolder"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="showCreateFolderDialog = false">取消</v-btn>
        <v-btn color="primary" @click="createFolder" :disabled="!newFolderName">
          创建
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 复制对话框 -->
  <v-dialog v-model="showCopyDialogFlag" max-width="500px">
    <v-card>
      <v-card-title>复制文件</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="copyDestPath"
          label="目标路径"
          prepend-icon="mdi-folder"
          variant="outlined"
        />
        <v-select
          v-model="copyDestProvider"
          :items="providers"
          item-title="storage_type"
          item-value="storage_type"
          label="目标存储"
          prepend-icon="mdi-database"
          variant="outlined"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="showCopyDialogFlag = false">取消</v-btn>
        <v-btn color="primary" @click="copyFile">复制</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 移动对话框 -->
  <v-dialog v-model="showMoveDialogFlag" max-width="500px">
    <v-card>
      <v-card-title>移动文件</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="moveDestPath"
          label="目标路径"
          prepend-icon="mdi-folder"
          variant="outlined"
        />
        <v-select
          v-model="moveDestProvider"
          :items="providers"
          item-title="storage_type"
          item-value="storage_type"
          label="目标存储提供商"
          prepend-icon="mdi-database"
          variant="outlined"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="showMoveDialogFlag = false">取消</v-btn>
        <v-btn color="primary" @click="moveFile">移动</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <!-- </v-container> -->
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  useStorage,
  useFileUpload,
  useFolderOperations,
  useFileOperations,
} from "@/hooks";
import { formatFileSize, formatDate, getFileIcon } from "@/utils";

// 使用存储相关的hook
const {
  providers,
  currentProvider,
  currentPath,
  files,
  loading,
  breadcrumbs,
  loadProviders,
  loadFiles,
  onProviderChange,
  navigateToPath,
  onRowClick,
} = useStorage();

// 使用文件上传相关的hook
const {
  showUploadDialog,
  uploadFiles,
  uploadPath,
  uploading,
  uploadProgress,
  uploadFile,
} = useFileUpload(
  () => currentProvider.value,
  () => currentPath.value,
  loadFiles
);

// 使用文件夹操作相关的hook
const { showCreateFolderDialog, newFolderName, createFolder } =
  useFolderOperations(
    () => currentProvider.value,
    () => currentPath.value,
    loadFiles
  );

// 使用文件操作相关的hook
const {
  selectedFile,
  showCopyDialogFlag,
  copyDestPath,
  copyDestProvider,
  showMoveDialogFlag,
  moveDestPath,
  moveDestProvider,
  downloadFile,
  showCopyDialog,
  copyFile,
  showMoveDialog,
  moveFile,
  deleteFile,
} = useFileOperations(() => currentProvider.value, loadFiles);

// 表格配置
const itemsPerPage = ref(10);
const headers = [
  { title: "名称", key: "name", sortable: true },
  { title: "大小", key: "size", sortable: true },
  { title: "修改时间", key: "mod_time", sortable: true },
  { title: "操作", key: "actions", sortable: false, width: "200px" },
];

// 生命周期
onMounted(() => {
  loadProviders();
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
