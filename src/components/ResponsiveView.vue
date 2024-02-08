<script lang="ts">
import { defineComponent } from "vue";
import useWindowResize from "@/use/useWindowResize";
import ResponsiveConfig from "@/assets/responsive-config.json";

/**
 * This component is used to render different content based on the screen size.
 */

export default defineComponent({
  name: "ResponsiveView",
  setup() {
    const { width, height } = useWindowResize();
    console.log()

    return { ResponsiveConfig, width, height };
  },
});
</script>

<template>
  <template v-if="width > ResponsiveConfig.large">
    <slot name="large"></slot>
  </template>

  <template v-if="width <= ResponsiveConfig.large">
    <slot name="m-"></slot>
  </template>

  <template
    v-if="width <= ResponsiveConfig.large && width > ResponsiveConfig.medium"
  >
    <slot name="medium"></slot>
  </template>

  <template v-if="width > ResponsiveConfig.medium">
    <slot name="m+"></slot>
  </template>

  <template v-if="width <= ResponsiveConfig.medium">
    <slot name="small"></slot>
  </template>
</template>

