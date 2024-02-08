<script setup lang="ts">
import {
  Cloud as CloudIcon,
  PeopleCircle as PeopleIcon,
  Person as PersonIcon,
  Watch as WatchIcon,
} from "@vicons/ionicons5";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global", inheritLocale: true });
</script>

<template>
  <n-card class="content">
    <n-space
      justify="center"
      style="margin-top: 10px"
      item-style="padding:5px;
      margin-bottom:25px;"
    >
      <div style="max-width: 500px">
        <n-h1>{{ t("project.roadmap") }}</n-h1>
        <n-h2>{{ t("project.now") }}:</n-h2>

        <n-alert :show-icon="false">
          {{ t("project.now1") }}
        </n-alert>
        <n-alert type="info" :show-icon="false">
          {{ t("project.now2") }}
        </n-alert>

        <n-alert :show-icon="false">
          {{ t("project.now3") }}
        </n-alert>

        <n-alert type="info" :show-icon="false">
          {{ t("project.now4") }}
        </n-alert>
      </div>

      <n-timeline :icon-size="48" size="large">
        <n-timeline-item type="default" :title="t('project.month', { n: '9' })">
          <template #icon>
            <n-icon> <cloud-icon /> </n-icon>
          </template>
          <ul>
            <li>{{ t("project.m1o1") }}</li>
            <li>{{ t("project.m1o2") }}</li>
          </ul>
        </n-timeline-item>

        <n-timeline-item
          type="info"
          :title="t('project.month', { n: '12' })"
          :time="t('project.m2o3')"
        >
          <template #icon>
            <n-icon> <people-icon /> </n-icon>
          </template>
          <ul>
            <li>{{ t("project.m2o1") }}</li>
            <li>{{ t("project.m2o2") }}</li>
          </ul>
        </n-timeline-item>

        <n-timeline-item
          type="default"
          :title="t('project.month', { n: '18' })"
          :time="t('project.m3o3')"
        >
          <template #icon>
            <n-icon> <person-icon /> </n-icon>
          </template>
          <ul>
            <li>{{ t("project.m3o1") }}</li>
            <li>{{ t("project.m3o2") }}</li>
          </ul>
        </n-timeline-item>

        <n-timeline-item
          type="info"
          :title="t('project.month', { n: '30' })"
          :time="t('project.m2o3')"
        >
          <template #icon>
            <n-icon> <people-icon /> </n-icon>
          </template>
          <ul>
            <li>{{ t("project.m4o1") }}</li>
            <li>
              {{ t("project.m4o2") }}
            </li>
          </ul>
        </n-timeline-item>

        <n-timeline-item
          type="default"
          :title="t('project.month', { n: '36' })"
        >
          <template #icon>
            <n-icon> <watch-icon /> </n-icon>
          </template>
          <ul>
            <li>{{ t("project.m5o1") }}</li>
          </ul>
        </n-timeline-item>
      </n-timeline>
    </n-space>
  </n-card>
</template>

<style scoped>
.n-alert {
  margin-top: 10px;
  margin-right: 10px;
}
.content {
  max-width: 1260px;
  margin: auto;
  margin-top: 10px;
}
.content::before {
  content: "";
  position: absolute;
  background: transparent;
  border-radius: 10px;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: -10px;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.6);
  mix-blend-mode: soft-light;
}
</style>
