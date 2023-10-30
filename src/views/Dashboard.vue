<template>
  <div class="dashboard__hero">
    <v-container class="d-flex justify-center" fluid style="height: 100%">
      <v-card elevation="4" class="dashboard__player" width="1000">
        <v-card-item style="height: 100%">
          <v-row align="center" justify="center">
            <v-col>
              <UserInfo :username="state.userName" :gold="state.gold" />
              <FishInfo :textInfo="state.textInfo" />
            </v-col>
            <v-col>
              <v-card class="pa-3">
                <v-card-title class="text-subtitle-1"
                  >Beli Pancingan</v-card-title
                >
                <v-card-item>
                  <v-select
                    v-model="pancingan.select"
                    :items="pancingan.itemsMp"
                    item-title="name"
                    item-value="price"
                    label="Select"
                    persistent-hint
                    return-object
                    single-line
                    multiple
                  >
                  </v-select>
                </v-card-item>
              </v-card>

              <v-btn block @click="router.push({ name: 'Play' })"
                >PLAY GAMES</v-btn
              >
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
import { useRouter } from "vue-router";

const startingAppStore = useStartingAppStore();
const router = useRouter();
const state = reactive({
  userName: "",
  gold: 0,
  fishEquip: [],
  fishBait: [],
  fishLoadTarget: [],
  textInfo: "",
});

const pancingan = reactive({
  select: [],
  itemsMp: [],
});

const getUsers = async () => {
  let userDetail = await startingAppStore.getUser();
  state.userName = userDetail.userName;
  state.gold = userDetail.gold;
  let loadFishingTarget = await startingAppStore.loadFishTarget();
  state.textInfo = `Hari ini kami melihat ${loadFishingTarget[0].countToday} ikan kecil, ${loadFishingTarget[1].countToday} ikan sedang, dan ${loadFishingTarget[2].countToday} ikan besar. ${loadFishingTarget[0].percentage}% ikan berwarna merah, ${loadFishingTarget[1].percentage}% berwarna biru, ${loadFishingTarget[2].percentage}% berwarna hijau.`;
  let loadRequrement = await startingAppStore.getRequirement();
  if (loadRequrement.fishEquipment.length > 0) {
    loadRequrement = loadRequrement.fishEquipment.map((el) => {
      el.name = el.name + " GOLD: " + el.price;
      return el;
    });
  }
  pancingan.itemsMp = loadRequrement;
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
