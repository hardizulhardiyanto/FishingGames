<template>
  <v-container class="d-flex justify-center" fluid style="height: 100%">
    <v-card elevation="4" class="startingapp__player">
      <v-card-title class="bg-white"> Welcome Fishing Games </v-card-title>
      <v-card-item>
        <v-text-field label="Enter Your Name" color="white" v-model="state.userName" />
        <v-btn block @click="enterBtn"> ENTER </v-btn>
      </v-card-item>
    </v-card>
  </v-container>
</template>

<script setup>
import { reactive } from "vue";
import { useStartingAppStore } from "@/store/startingApp";
import { useRouter } from "vue-router";

const startingAppStore = useStartingAppStore();
const router = useRouter();
const state = reactive({
  userName: "",
});

const enterBtn = () => {
    startingAppStore.enterUser(state.userName);
    router.push({name: "Dashboard"})
};
</script>

<style lang="css" scoped>
.startingapp__player {
  border: 3px;
  border-radius: 3px;
  background-color: rgb(243, 143, 33);
}
</style>
