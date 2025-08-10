import { ref } from "vue";

const navigationStatus = ref(true); // 全局导航栏状态

export function useNavigationManager() {
  // 切换导航状态
  const toggleNavigation = () => {
    navigationStatus.value = !navigationStatus.value;
  };

  return {
    navigationStatus,
    toggleNavigation,
  };
}
