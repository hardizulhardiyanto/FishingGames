<template>
  <div class="dashboard__hero">
    <v-container class="d-flex justify-center" fluid style="height: 100%">
      <v-card elevation="4" class="dashboard__player" width="1000">
        <v-card-item style="height: 100%;">
          <v-row align="center" justify="center">
            <v-col>
                <UserInfo 
                    :username="state.userName"
                    :gold="state.gold"
                />
                <FishInfo />
            </v-col>

          </v-row>
        </v-card-item>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
import FishInfo from "@/components/FishInfo.vue";
import UserInfo from "@/components/UserInfo.vue";
import { useStartingAppStore } from "@/store/startingApp";
import { reactive } from "vue";
const startingAppStore = useStartingAppStore();

const state = reactive({
  userName: "",
  gold: 0,
  fishEquip: [],
  fishBait: [],
  fishLoadTarget: [],
});

const getUsers = async () => {
  let userDetail = await startingAppStore.getUser();
  state.userName = userDetail.userName;
  state.gold = userDetail.gold
  console.log("userDetail >> ", userDetail);
  let loadFishingTarget = await startingAppStore.loadFishTarget();
  console.log("loadFishingTarget >> ", loadFishingTarget);
  let loadRequrement = await startingAppStore.getRequirement();
  console.log("loadRequrement >> ", loadRequrement);
};

getUsers();
</script>

<style lang="scss" scoped>
.dashboard__hero {
  height: 100vh;
  background-image: url("../assets/letsgofishing_thumb.png");
  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.dashboard__player {
  border: 3px;
  border-radius: 3px;
  background-color: rgb(243, 143, 33);
}
</style>
