<script setup lang="ts">
import { useI18n } from "vue-i18n";
import ResponsiveView from "@/components/ResponsiveView.vue";

const { t } = useI18n({ useScope: "global", inheritLocale: true });

</script>


<template>
  <responsive-view>
    <template v-slot:m+>
      <n-space justify="space-between" style="max-width: 1260px; margin: auto">
        <div>
          {{ t("footer.contacts") }}
          <div>
            +39 02 2399 3390<br />
            project.intakecare@gmail.com<br />
          </div>
        </div>

        <div>
          {{ t("footer.services") }}
          <div>
            {{ t("footer.support") }}<br />
            {{ t("footer.reminderIntegration") }}<br />
            FAQ
          </div>
        </div>

        <div>
          {{ t("footer.link") }}
          <div>
            PlayStore
            <img
              height="10"
              alt="playstore"
              src="../../assets/icons/googleplay.svg"
            /><br />
            AppStore
            <img
              height="10"
              alt="appstore"
              src="../../assets/icons/appstore.svg"
            /><br />
            Amazon Alexa
            <img
              height="10"
              alt="amazonalexa"
              src="../../assets/icons/amazonalexa.svg"
            /><br />
          </div>
        </div>
      </n-space>
    </template>

    <template v-slot:small>
      <n-space justify="center">
        <n-space vertical>
          <div>
            {{ t("footer.contacts") }}
            <div>
              +39 02 2399 3390<br />
              project.intakecare@gmail.com<br />
            </div>
          </div>

          <div>
            {{ t("footer.services") }}
            <div>
              {{ t("footer.support") }}<br />
              {{ t("footer.reminderIntegration") }}<br />
              FAQ
            </div>
          </div>

          <div>
            {{ t("footer.link") }}
            <div>
              PlayStore
              <img
                height="10"
                alt="playstore"
                src="../../assets/icons/googleplay.svg"
              /><br />
              AppStore
              <img
                height="10"
                alt="appstore"
                src="../../assets/icons/appstore.svg"
              /><br />
              Amazon Alexa
              <img
                height="10"
                alt="amazonalexa"
                src="../../assets/icons/amazonalexa.svg"
              /><br />
            </div>
          </div>
        </n-space>
      </n-space>
    </template>
  </responsive-view>
</template>

<style scoped>
.n-space {
  font-size: 8pt;
  color: #333333;
}
</style>
