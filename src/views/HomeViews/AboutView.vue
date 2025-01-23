<script setup lang="ts">
import Team from "@/components/Home/Team.vue";

const team = [
  {
    name: "Enrico Gianluca",
    surname: "Caiani",
    position: "Team Manager",
    image: "",
    qualification: "Professore Associato in eHealth",
    institutions: ["Politecnico di Milano", "IRCCS Istituto Auxologico Italiano"]
  },

  {
    name: "Grzegorz",
    surname: "Bilo",
    position: "Physician",
    image: "",
    qualification: "Professore Associato in Medicina",
    institutions: ["IRCCS Istituto Auxologico Italiano", "Università degli Studi Milano-Bicocca"]
  },

  {
    name: "Emanuele",
    surname: "Tauro",
    position: "Full Stack Developer",
    image: "",
    qualification: "Ricercatore PostDoc",
    institutions: ["IRCCS Istituto Auxologico Italiano", "Politecnico di Milano"]
  },

  {
    name: "Lucia",
    surname: "Zanotti",
    position: "Project Manager",
    image: "",
    qualification: "Project Manager",
    institutions: ["IRCCS Istituto Auxologico Italiano"]
  },

  {
    name: "Alessandro",
    surname: "Croce",
    position: "Physician",
    image: "",
    qualification: "Medico Cardiologo",
    institutions: ["IRCCS Istituto Auxologico Italiano"]
  },

  {
    name: "Martino",
    surname: "Pengo",
    position: "Physician",
    image: "",
    qualification: "Medico Cardiologo",
    institutions: ["IRCCS Istituto Auxologico Italiano"]
  },

  {
    name: "Alessandra",
    surname: "Gorini",
    position: "Psicologa",
    image: "",
    qualification: "Psicologa",
    institutions: ["Istituti Clinici Scientifici Maugeri IRCCS", "Università degli Studi di Milano"]
  },

  {
    name: "Martina",
    surname: "Vigorè",
    position: "Psicologa",
    image: "",
    qualification: "Psicologa",
    institutions: ["Istituti Clinici Scientifici Maugeri IRCCS", "Università degli Studi di Milano"]
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
            :image="member.image"
            :qualification="member.qualification"
            :institutions="member.institutions"
        />
      </n-grid-item>
    </n-grid>
  </n-space>
</template>

