<script setup lang="ts">
import { ref } from 'vue'
import ResponsiveView from "@/components/ResponsiveView.vue";
import { useI18n } from "vue-i18n";
import { NCarousel} from "naive-ui";


const { t } = useI18n({ useScope: "global", inheritLocale: true });

function getImgUrl(slide: string) {
  const url = `../src/assets/carousel/${t("home.carouselPath")}${slide}.png`;
  console.log(url);
  return url
}

const data = ref(
    null as { patients: number; therapies: number; intakes: number } | null
);

// const getData = () => {
//   api.host.getStats().then((value) => {
//     data.value = value.data;
//   });
// };
//
// onMounted(() => {
//   getData();
// });

</script>

<template>
  <!-- CAROUSEL RESPONSIVE  -->
  <responsive-view>
    <template v-slot:large>
      <div :touchable="false" style="padding-right: 24px; padding-left: 24px">
        <n-carousel
          class="content"
          style="border-radius: 10px"
          trigger="hover"
          :interval="10000"
          autoplay
        >
          <img alt="Ichi" class="carousel-img" :src="getImgUrl('1')" />
          <img alt="Ni" class="carousel-img" :src="getImgUrl('2')" />
          <img alt="San" class="carousel-img" :src="getImgUrl('3')" />
          <img alt="Shi" class="carousel-img" :src="getImgUrl('4')" />
        </n-carousel>
      </div>
    </template>
    <template v-slot:m->
      <n-carousel
        :touchable="false"
        class="content"
        trigger="hover"
        :interval="10000"
        autoplay
      >
        <img class="carousel-img" :src="getImgUrl('1')" />
        <img class="carousel-img" :src="getImgUrl('2')" />
        <img class="carousel-img" :src="getImgUrl('3')" />
        <img class="carousel-img" :src="getImgUrl('4')" />
      </n-carousel>
    </template>
  </responsive-view>

<!--  &lt;!&ndash; CARD REPONSIVE &ndash;&gt;-->
<!--  <responsive-view>-->
<!--    <template v-slot:m+>-->
<!--      <div v-if="data" style="padding-right: 24px; padding-left: 24px">-->
<!--        <n-card class="content">-->
<!--          <n-h1-->
<!--            ><n-text type="primary">{{ t("home.reach") }}:</n-text></n-h1-->
<!--          >-->

<!--          <n-space justify="space-around" size="large">-->
<!--            <div style="text-align: center">-->
<!--              {{ t("general.patient", data.patients) }}-->
<!--              <n-h1-->
<!--                ><n-text type="primary">{{ data.patients }}</n-text></n-h1-->
<!--              >-->
<!--            </div>-->
<!--            <div style="text-align: center">-->
<!--              {{ t("general.therapy", data.therapies) }}-->
<!--              <n-h1-->
<!--                ><n-text type="primary">{{ data.therapies }}</n-text></n-h1-->
<!--              >-->
<!--            </div>-->
<!--            <div style="text-align: center">-->
<!--              {{ t("home.reminder") }}-->
<!--              <n-h1-->
<!--                ><n-text type="primary">{{ data.intakes }}</n-text></n-h1-->
<!--              >-->
<!--            </div>-->
<!--          </n-space>-->
<!--        </n-card>-->
<!--      </div>-->
<!--    </template>-->
<!--    <template v-slot:small>-->
<!--      <n-card v-if="data" class="content" style="border-radius: 0px">-->
<!--        <n-h1-->
<!--          ><n-text type="primary">{{ t("home.reach") }}:</n-text></n-h1-->
<!--        >-->

<!--        <n-space justify="space-around" vertical size="large">-->
<!--          <div style="text-align: center">-->
<!--            {{ t("general.patient", data.patients) }}-->
<!--            <n-h1-->
<!--              ><n-text type="primary">{{ data.patients }}</n-text></n-h1-->
<!--            >-->
<!--          </div>-->
<!--          <div style="text-align: center">-->
<!--            {{ t("general.therapy", data.therapies) }}-->
<!--            <n-h1-->
<!--              ><n-text type="primary">{{ data.therapies }}</n-text></n-h1-->
<!--            >-->
<!--          </div>-->
<!--          <div style="text-align: center">-->
<!--            {{ t("home.reminder") }}-->
<!--            <n-h1-->
<!--              ><n-text type="primary">{{ data.intakes }}</n-text></n-h1-->
<!--            >-->
<!--          </div>-->
<!--        </n-space>-->
<!--      </n-card>-->
<!--    </template>-->
<!--  </responsive-view>-->
</template>


<style scoped>
.carousel-img {
  width: 100%;
  object-fit: cover;
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
