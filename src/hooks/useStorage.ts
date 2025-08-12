import { ref, computed } from "vue";
import { StorageService } from "@/services/storage";
import { showSuccess, showError } from "@/utils/message";
import type { StorageProviderInterface, FileInfo } from "@/types";

/**
 * 存储管理相关的hook
 */
export const useStorage = () => {
  // 响应式数据
  const providers = ref<StorageProviderInterface[]>([]);
  const currentProvider = ref<string>("");
  const currentPath = ref<string>("/");
  const files = ref<FileInfo[]>([]);
  const loading = ref(false);

  // 计算属性 - 面包屑导航
  const breadcrumbs = computed(() => {
    const parts = currentPath.value.split("/").filter(Boolean);
    const items = [{ title: "根目录", href: "/", disabled: false }];

    let currentHref = "";
    parts.forEach((part) => {
      currentHref += "/" + part;
      items.push({
        title: part,
        href: currentHref,
        disabled: false,
      });
    });

    // 最后一项设为不可点击
    if (items.length > 0) {
      items[items.length - 1].disabled = true;
    }

    return items;
  });

  /**
   * 加载存储提供商列表
   */
  const loadProviders = async () => {
    try {
      providers.value = await StorageService.ProviderService.getProviderList();
      if (providers.value.length > 0) {
        currentProvider.value = providers.value[0].storage_type;
        await loadFiles();
      }
    } catch (error) {
      showError("加载存储器失败: " + (error as Error).message);
    }
  };

  /**
   * 加载文件列表
   */
  const loadFiles = async () => {
    if (!currentProvider.value) return;

    loading.value = true;
    try {
      files.value = await StorageService.List(
        currentProvider.value,
        currentPath.value
      );
    } catch (error) {
      showError("加载文件列表失败: " + (error as Error).message);
    } finally {
      loading.value = false;
    }
  };

  /**
   * 切换存储提供商
   */
  const onProviderChange = () => {
    currentPath.value = "/";
    loadFiles();
  };

  /**
   * 导航到指定路径
   */
  const navigateToPath = (path: string) => {
    currentPath.value = path;
    loadFiles();
  };

  /**
   * 行点击事件处理
   */
  const onRowClick = (event: Event, { item }: { item: FileInfo }) => {
    if (item.is_dir) {
      currentPath.value = item.path;
      loadFiles();
    }
  };

  return {
    // 响应式数据
    providers,
    currentProvider,
    currentPath,
    files,
    loading,

    // 计算属性
    breadcrumbs,

    // 方法
    loadProviders,
    loadFiles,
    onProviderChange,
    navigateToPath,
    onRowClick,
  };
};
