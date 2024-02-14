<script setup lang="ts">
import Team from "@/components/home/Team.vue";

const team = [
    {
      name: "Enrico",
      surname: "Caiani",
      position: "Team Manager",
      image: "enrico_caiani",
      qualification: "Associate Professor in eHealth",
    },

    {
      name: "Emanuele",
      surname: "Tauro",
      position: "Persuasive Design",
      image: "emanuele_tauro",
      qualification: "PhD Student",
    },

    {
      name: "Margot",
      surname: "Mazziotti",
      position: "Natural Language Interface Developer",
      image: "margot_mazziotti",
      qualification: "MSc Student",
    },

    {
      name: "Giacomo",
      surname: "Galuzzi",
      position: "Natural Language Interface Developer",
      image: "giacomo_galuzzi",
      qualification: "MSc Student",
    },

    {
      name: "Fosco",
      surname: "Cancelliere",
      position: "Full Stack Web Developer",
      image: "fosco_cancelliere",
      qualification: "MSc Student",
    },
  ];

</script>

<template>
  <n-space justify="center" style="margin: 10px">
    <n-grid
        :x-gap="10"
        :y-gap="10"
        cols="1 s:2 m:3 l:4 xl:5 2xl:6"
        responsive="screen"
    >
      <n-grid-item v-for="member in team" :key="member.name">
        <Team
            :name="member.name"
            :surname="member.surname"
            :position="member.position"
            :image="member.image"
            :qualification="member.qualification"
        />
      </n-grid-item>
    </n-grid>
  </n-space>
</template>

