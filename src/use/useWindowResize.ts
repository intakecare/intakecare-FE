/* eslint-disable */
import { onMounted, onUnmounted, ref } from "vue";

export default function useWindowResize() {
  const height = ref();
  const width = ref();

  function resize() {
    height.value = window.innerHeight;
    width.value = window.innerWidth;
  }

  onMounted(() => {
    resize();
    window.addEventListener("resize", resize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", resize);
  });

  return { height, width };
}
