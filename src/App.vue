<script setup lang="ts">
import ITCLight from "./assets/ITCLight.json"
import Footer from "./components/Footer.vue"
import NavBar from "@/components/NavBar.vue";
import Home from "@/views/Home.vue";
import { NConfigProvider, NGlobalStyle, NLayout, NLayoutHeader, NLayoutFooter, NMessageProvider, NDialogProvider } from "naive-ui";

/**
 * This is the main component of the application. It contains the main layout, the navigation bar and the footer.
 */

const theme = ITCLight;

</script>

<template>
  <n-config-provider :theme-overrides="theme">
    <n-global-style />
    <n-dialog-provider>
      <n-message-provider>
        <n-layout position="absolute" style="height: 100%">
          <n-layout-header
              class="main"
              style="height: 70px; padding: 12px; padding-left: 24px"
          >
            <NavBar />
          </n-layout-header>
          <n-layout
              class="main"
              position="static"
              :native-scrollbar="false"
              style="min-height: calc(100% - 194px); margin: auto"
          >
            <div class="mainView">
              <Home />
            </div>
          </n-layout>
          <n-layout-footer position="static" style="padding: 24px">
            <Footer />
          </n-layout-footer>
        </n-layout>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped>
.body {
  font-family: Montserrat;
}
</style>


