<template>
  <v-btn
    color="primary"
    variant="elevated"
    prepend-icon="mdi-plus"
    @click="addLibrary"
  >
    添加媒体库
  </v-btn>

  <div v-if="librariesConfig && librariesConfig.length > 0">
    <v-container fluid>
      <draggable
        v-model="librariesConfig"
        item-key="name"
        handle=".drag-handle"
        @start="onDragStart"
        @end="onDragEnd"
        class="d-flex flex-wrap"
      >
        <template #item="{ element: library, index }">
          <div class="library-card-wrapper">
            <v-card
              elevation="2"
              :class="{ dragging: isDragging }"
              class="compact-card"
            >
              <v-card-title class="d-flex align-center pa-3">
                <v-icon
                  class="drag-handle mr-2 cursor-move"
                  color="grey"
                  size="small"
                >
                  mdi-drag
                </v-icon>
                <span class="text-subtitle-2 flex-grow-1">{{
                  library.name
                }}</span>
                <v-btn
                  icon="mdi-delete"
                  color="error"
                  variant="text"
                  size="x-small"
                  @click="removeLibrary(index)"
                >
                </v-btn>
              </v-card-title>

              <v-card-text class="pa-3">
                <v-text-field
                  v-model="library.name"
                  label="名称"
                  placeholder="媒体库名称"
                  density="compact"
                  hide-details
                  class="mb-2"
                  clearable
                />

                <v-select
                  v-model="library.transfer_type"
                  label="传输类型"
                  :items="getAvailableTransferTypes(library)"
                  item-title="label"
                  item-value="value"
                  density="compact"
                  hide-details
                  class="mb-2"
                />
                <v-select
                  v-model="library.src_type"
                  label="源存储类型"
                  :items="storageProviderList"
                  item-title="storage_type"
                  item-value="storage_type"
                  density="compact"
                  hide-details
                  class="mb-2"
                  placeholder="选择源存储类型"
                  :loading="loadingProviders"
                  :disabled="storageProviderList.length === 0"
                  :no-data-text="
                    loadingProviders ? '加载中...' : '暂无可用的存储类型'
                  "
                  @update:model-value="onStorageTypeChange(library)"
                />
                <v-text-field
                  v-model="library.src_path"
                  label="源路径"
                  placeholder="/path/to/source"
                  density="compact"
                  hide-details
                  class="mb-2"
                  clearable
                />

                <v-select
                  v-model="library.dst_type"
                  label="目标存储类型"
                  :items="storageProviderList"
                  item-title="storage_type"
                  item-value="storage_type"
                  density="compact"
                  hide-details
                  class="mb-2"
                  placeholder="选择目标存储类型"
                  :loading="loadingProviders"
                  :disabled="storageProviderList.length === 0"
                  :no-data-text="
                    loadingProviders ? '加载中...' : '暂无可用的存储类型'
                  "
                  @update:model-value="onStorageTypeChange(library)"
                />
                <v-text-field
                  v-model="library.dst_path"
                  label="目标路径"
                  placeholder="/path/to/destination"
                  density="compact"
                  hide-details
                  class="mb-2"
                  clearable
                />

                <div class="d-flex flex-column">
                  <v-checkbox
                    v-model="library.organize_by_type"
                    label="按类型分文件夹"
                    density="compact"
                    hide-details
                    class="mb-1"
                  />
                  <v-checkbox
                    v-model="library.organize_by_category"
                    label="按分类分文件夹"
                    density="compact"
                    hide-details
                  />
                </div>
              </v-card-text>
            </v-card>
          </div>
        </template>
      </draggable>
    </v-container>
  </div>

  <div v-else class="text-center py-8">
    <v-icon size="64" color="grey-lighten-1">mdi-folder-outline</v-icon>
    <p class="text-h6 text-grey-lighten-1 mt-2">暂无媒体库配置</p>
    <p class="text-body-2 text-grey-lighten-1">点击上方按钮添加第一个媒体库</p>
  </div>

  <div class="d-flex justify-end mt-6">
    <v-btn
      color="primary"
      variant="elevated"
      @click="updateData"
      :disabled="!librariesConfig || librariesConfig.length === 0"
    >
      保存配置
    </v-btn>
  </div>
</template>

<script lang="ts" setup name="MediaLibraries">
import { ref, defineExpose } from "vue";
import { configService, StorageService } from "@/services";
import type { LibraryConfig, StorageProviderInterface } from "@/types";
import draggable from "vuedraggable";

const librariesConfig = ref<LibraryConfig[]>([]);
const isDragging = ref(false);

// 传输类型选项
const transferTypeOptions = [
  { label: "复制", value: "Copy" },
  { label: "移动", value: "Move" },
  { label: "硬链接", value: "Link" },
  { label: "软链接", value: "SoftLink" },
];

// 获取指定媒体库可用的传输类型
const getAvailableTransferTypes = (library: LibraryConfig) => {
  // 如果源存储类型和目标存储类型不同，只支持复制和移动
  if (library.src_type !== library.dst_type) {
    return transferTypeOptions.filter(
      (option) => option.value === "Copy" || option.value === "Move"
    );
  }

  // 如果相同，根据存储提供商支持的传输类型来限制
  const provider = storageProviderList.value.find(
    (p) => p.storage_type === library.src_type
  );

  if (!provider) {
    // 如果找不到提供商，默认只支持复制和移动
    return transferTypeOptions.filter(
      (option) => option.value === "Copy" || option.value === "Move"
    );
  }

  // 根据提供商支持的传输类型过滤选项
  const supportedTypes = provider.transfer_type || ["Copy", "Move"];
  return transferTypeOptions.filter((option) =>
    supportedTypes.includes(option.value)
  );
};

// 验证并修正传输类型
const validateAndFixTransferType = (library: LibraryConfig) => {
  const availableTypes = getAvailableTransferTypes(library);
  const currentTypeValid = availableTypes.some(
    (option) => option.value === library.transfer_type
  );

  if (!currentTypeValid && availableTypes.length > 0) {
    // 如果当前传输类型不可用，选择第一个可用的类型
    library.transfer_type = availableTypes[0].value;
  }
};

// 当存储类型改变时的处理函数
const onStorageTypeChange = (library: LibraryConfig) => {
  validateAndFixTransferType(library);
};

const storageProviderList = ref<StorageProviderInterface[]>([]);
const loadingProviders = ref(false);

// 创建默认媒体库配置
const createDefaultLibrary = (): LibraryConfig => {
  const defaultSrcType =
    storageProviderList.value.length > 0
      ? storageProviderList.value[0].storage_type
      : "";

  const library: LibraryConfig = {
    name: "",
    src_path: "",
    src_type: defaultSrcType,
    dst_type: defaultSrcType,
    dst_path: "",
    transfer_type: "Copy", // 先设置一个默认值
    organize_by_type: false,
    organize_by_category: false,
  };

  // 验证并修正传输类型
  validateAndFixTransferType(library);

  return library;
};

// 添加媒体库
const addLibrary = () => {
  if (!librariesConfig.value) {
    librariesConfig.value = [];
  }
  librariesConfig.value.push(createDefaultLibrary());
};

// 删除媒体库
const removeLibrary = (index: number) => {
  if (librariesConfig.value) {
    librariesConfig.value.splice(index, 1);
  }
};

// 拖拽开始
const onDragStart = () => {
  isDragging.value = true;
};

// 拖拽结束
const onDragEnd = () => {
  isDragging.value = false;
};

// 加载数据
async function loadData() {
  loadingProviders.value = true;
  try {
    storageProviderList.value = await StorageService.ProviderList();
  } catch (error) {
    console.error("Failed to load storage providers:", error);
    storageProviderList.value = [];
  } finally {
    loadingProviders.value = false;
  }

  try {
    librariesConfig.value = await configService.getMediaLibrariesConfig();
    if (!librariesConfig.value) {
      librariesConfig.value = [];
    } else {
      // 验证并修正已有配置的传输类型
      librariesConfig.value.forEach((library) => {
        validateAndFixTransferType(library);
      });
    }
  } catch (error) {
    console.error("Failed to load library config:", error);
    librariesConfig.value = [];
  }
}

// 更新数据
async function updateData() {
  if (librariesConfig.value) {
    try {
      await configService.updateMediaLibrariesConfig(librariesConfig.value);
      console.log("Library config updated successfully");
    } catch (error) {
      console.error("Failed to update library config:", error);
    }
  }
}

defineExpose({ loadData });
</script>

<style scoped>
.library-card-wrapper {
  width: 300px;
  min-width: 280px;
  max-width: 350px;
  margin: 12px;
  flex: 0 0 auto;
}

.compact-card {
  min-height: 420px;
  height: 100%;
}

.cursor-move {
  cursor: move;
}

.dragging {
  opacity: 0.8;
  transform: rotate(2deg);
  transition: all 0.3s ease;
}

.drag-handle:hover {
  color: #1976d2 !important;
}

.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12) !important;
}

.compact-card .v-card-title {
  min-height: 48px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.compact-card .v-field--density-compact {
  margin-bottom: 8px;
}

.compact-card .v-checkbox {
  margin-bottom: 4px;
}

.compact-card .v-checkbox .v-label {
  font-size: 0.875rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .library-card-wrapper {
    width: calc(100% - 24px);
    max-width: none;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .library-card-wrapper {
    width: calc(50% - 24px);
  }
}

@media (min-width: 1025px) and (max-width: 1400px) {
  .library-card-wrapper {
    width: calc(33.333% - 24px);
  }
}

@media (min-width: 1401px) {
  .library-card-wrapper {
    width: calc(25% - 24px);
  }
}
</style>
