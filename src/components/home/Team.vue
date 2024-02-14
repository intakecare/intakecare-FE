<script setup lang="ts">
const props = defineProps({
    name: String,
    surname: String,
    position: String,
    image: String,
    qualification: String,
})
const getImgUrl = () => {
  return `../src/assets/team_img/${props.image}.jpg`;
};
</script>

<template>
  <n-card
    hoverable
    content-style="text-align: center"
    style="min-height: 375px"
  >
    <img height="128" :src="getImgUrl()" style="border-radius: 50%" />
    <n-h1 style="margin: 0; padding: 0"
      ><n-text>{{ name }}</n-text></n-h1
    >
    <n-h1 style="margin: 0; padding: 0"
      ><n-text type="primary">{{ surname }}</n-text></n-h1
    >
    <n-h2 style="margin: 0; padding: 0">{{ position }}</n-h2>
    <n-text italic>{{ qualification }}</n-text>
  </n-card>
</template>

<style scoped>
.n-card {
  max-width: 320px;
}
</style>

