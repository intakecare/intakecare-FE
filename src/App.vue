<script setup lang="ts">
import ITCLight from "./assets/ITCLight.json"
import Footer from "@/components/Home/Footer.vue"
import NavBar from "@/components/Home/NavBar.vue";
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
              style="height: 10%; padding: 12px; padding-left: 24px"
          >
            <NavBar />
          </n-layout-header>
          <n-layout
              class="main"
              position="static"
              :native-scrollbar="false"
              style="min-height: 80%; margin: auto"
          >
            <div class="mainView">
              <router-view />
            </div>
          </n-layout>
          <n-layout-footer
              class="main"
              style="height: 10%; padding: 12px; padding-left: 24px"
          >
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


