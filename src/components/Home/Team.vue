<script setup lang="ts">

const props = defineProps({
  name: String,
  surname: String,
  position: String,
  image: String,
  qualification: String,
  institutions: []
})
const getImgUrl = () => {
  if (props.image){
    return `/team_img/${props.image}.jpg`;
  } else {
    return '/team_img/placeholder.jpg';
  }
};
</script>

<template>
  <n-card
    hoverable
    content-style="text-align: center"
    style="min-height: 395px"
  >
    <img alt="" height="128" :src="getImgUrl()" style="border-radius: 50%" />
    <n-h1 style="margin: 0; padding: 0">
      <n-text>{{ name }}</n-text>
    </n-h1>
    <n-h1 style="margin: 0; padding: 0">
      <n-text type="primary">{{ surname }}</n-text>
    </n-h1>
    <n-h2 style="margin: 0; padding: 0">{{ position }}</n-h2>
    <n-h4 style="font-size: 18px; margin: 0; padding: 0">{{ qualification }}</n-h4>
    <n-divider style="margin: 5px"/>
    <n-space direction="vertical">
      <n-text italic v-for="institution in institutions" :key="institution">
        {{ institution }}
      </n-text>
    </n-space>
  </n-card>
</template>


<style scoped>
.n-card {
  max-width: 320px;
}
</style>

