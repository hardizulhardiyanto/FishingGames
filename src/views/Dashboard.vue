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
                    :readonly="state.letsPlay"
                  >
                  </v-select>
                </v-card-item>
              </v-card>
              <div class="pa-2" />
              <v-card class="pa-3">
                <v-card-title class="text-subtitle-1">Beli Umpan</v-card-title>
                <v-divider />
                <v-row align="center">
                  <v-col>
                    <p>Umpan Ikan Merah 1Gold :</p>
                  </v-col>
                  <v-col cols="5">
                    <v-select
                      label="Jumlah Beli"
                      v-model="umpanBeli.redFish"
                      :items="umpanList"
                      hide-details
                      :readonly="state.letsPlay"
                    />
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col>
                    <p>Umpan Ikan Biru 2Gold :</p>
                  </v-col>
                  <v-col cols="5">
                    <v-select
                      label="Jumlah Beli"
                      v-model="umpanBeli.blueFish"
                      :items="umpanList"
                      hide-details
                      :readonly="state.letsPlay"
                    />
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col>
                    <p>Umpan Ikan Hijau 3Gold :</p>
                  </v-col>
                  <v-col cols="5">
                    <v-select
                      label="Jumlah Beli"
                      v-model="umpanBeli.greenFish"
                      :items="umpanList"
                      hide-details
                      :readonly="state.letsPlay"
                    />
                  </v-col>
                </v-row>
              </v-card>
              <div class="pa-2" />
              <v-btn block @click="payRequirement()" v-if="!state.letsPlay"
                >Beli Semua Persiapan</v-btn
              >

              <v-btn color="blue" block @click="router.push({ name: 'Play' })" v-else
                >PLAY GAMES</v-btn
              >
            </v-col>
          </v-row>
        </v-card-item>
      </v-card>
    </v-container>
    <Dialog
      :dialog="dialogOption.show"
      :useAction="true"
      formTitle="Pembayaran"
      :useWidthCard="1000"
    >
      <template v-slot:formItem>
        <p>Pembelian Pancingan</p>
        <div
          class="pa-2 bg-grey"
          v-if="fishTransaction.listPembelianPancing.length === 0"
        >
          <p>Tidak ada</p>
        </div>
        <div
          class="pa-2 bg-grey"
          v-for="(item, idx) in fishTransaction.listPembelianPancing"
          :key="idx"
        >
          <v-row>
            <v-col>
              <p class="">Pancingan Ikan {{ item.fishCatch }}</p>
            </v-col>
            <v-col>
              <p>Harga :{{ item.price }} Gold</p>
            </v-col>
            <v-col>
              <p>Total Pembayaran :{{ item.totalPembayaran }} Gold</p>
            </v-col>
          </v-row>
        </div>
        <div class="text-end bg-green">
          <p>
            Total Pembayaran Pancing :
            {{ fishTransaction.countPembayaranPancingan }} GOLD
          </p>
        </div>

        <div class="pa-2" />
        <p>Pembelian Umpan</p>
        <div
          class="pa-2 bg-grey"
          v-if="fishTransaction.listPembelianUmpan.length == 0"
        >
          <p class="text-subtitle-2">Tidak ada pembelian</p>
        </div>
        <div
          class="pa-2 bg-grey"
          v-for="(item, idx) in fishTransaction.listPembelianUmpan"
          :key="idx"
        >
          <v-row>
            <v-col> Ikan Merah </v-col>
            <v-col> Harga : {{ item.harga }} Gold</v-col>
            <v-col> Total Beli : {{ item.jumlahBeli }} </v-col>
            <v-col> Total Pembayaran : {{ item.totalPembayaran }} Gold </v-col>
          </v-row>
        </div>
        <div class="text-end bg-green">
          <p>
            Total Pembayaran Umpan:
            {{ fishTransaction.countPembayaranUmpan }} GOLD
          </p>
        </div>

        <!-- Total Transaction -->
        <div class="pa-2" />
        <p>Transaction</p>
        <v-divider />
        <div class="pa-2 bg-grey">
          <v-row>
            <v-col>
              <p>Gold Kamu:</p>
            </v-col>
            <v-col>
              <p>{{ state.gold }}</p>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p>Sub Total Pembayaran:</p>
            </v-col>
            <v-col>
              <p>
                {{ fishTransaction.subTotalPembayaran }}
              </p>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <p>Sisa GOLD Kamu:</p>
            </v-col>
            <v-col>
              <p>
                {{ fishTransaction.sisaGold }}
              </p>
            </v-col>
          </v-row>
        </div>
        <div class="pa-2 bg-red" v-if="state.goldTidakCukup">
          <p>Gold Tidak Cukup</p>
        </div>

        <v-divider />
      </template>
      <template v-slot:action>
        <v-btn variant="tonal" color="red" @click="closeDialog()">
          CANCEL
        </v-btn>

        <v-btn variant="tonal" color="blue" @click="payment()"> BUY </v-btn>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import Dialog from "@/components/Dialog.vue";
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
  goldTidakCukup: false,
  letsPlay: false,
});

const pancingan = reactive({
  select: [],
  itemsMp: [],
});

const umpanBeli = reactive({
  redFish: "0",
  blueFish: "0",
  greenFish: "0",
});

const dialogOption = reactive({
  show: false,
});

const fishTransaction = reactive({
  countPembayaranPancingan: 0,
  countPembayaranUmpan: 0,
  countHarga: 0,
  listPembelianPancing: [],
  listPembelianUmpan: [],
  subTotalPembayaran: 0,
  sisaGold: 0,
});

const umpanList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const closeDialog = () => {
  state.goldTidakCukup = false;
  dialogOption.show = false;
  fishTransaction.listPembelianPancing = [];
  fishTransaction.listPembelianUmpan = [];
  fishTransaction.sisaGold = 0;
  fishTransaction.subTotalPembayaran = 0;
  fishTransaction.countPembayaranPancingan = 0;
  fishTransaction.countPembayaranUmpan = 0;
  fishTransaction.countHarga = 0;
};

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
  state.letsPlay = false;
};

getUsers();

const payRequirement = () => {
  //Umpan Transaction
  let listUmpanTransction = [];
  if (umpanBeli.redFish > 0) {
    listUmpanTransction.push({
      jumlahBeli: umpanBeli.redFish,
      harga: 1,
    });
  }
  if (umpanBeli.blueFish > 0) {
    listUmpanTransction.push({
      jumlahBeli: umpanBeli.blueFish,
      harga: 2,
    });
  }
  if (umpanBeli.greenFish > 0) {
    listUmpanTransction.push({
      jumlahBeli: umpanBeli.greenFish,
      harga: 3,
    });
  }
  //Hitung Pembayaran umpan
  if (listUmpanTransction.length > 0) {
    let countHargaUmpan = 0;
    listUmpanTransction.map((el) => {
      el.totalPembayaran = parseInt(el.harga) * parseInt(el.jumlahBeli);
      countHargaUmpan += el.totalPembayaran;
    });
    fishTransaction.countPembayaranUmpan = countHargaUmpan;
    umpanBeli.listTotalPembelian = listUmpanTransction;
    fishTransaction.listPembelianUmpan = listUmpanTransction;
  }

  //Pancingan transaction
  if (pancingan.select.length > 0) {
    let countHargaPancing = 0;
    pancingan.select.map((el) => {
      el.totalPembayaran = el.price;
      countHargaPancing += el.totalPembayaran;
    });
    fishTransaction.countPembayaranPancingan = countHargaPancing;
    fishTransaction.listPembelianPancing = pancingan.select;
  }

  fishTransaction.countHarga =
    fishTransaction.countPembayaranPancingan +
    fishTransaction.countPembayaranUmpan;

  fishTransaction.subTotalPembayaran =
    fishTransaction.countPembayaranUmpan +
    fishTransaction.countPembayaranPancingan;

  fishTransaction.sisaGold =
    state.gold -
    (fishTransaction.countPembayaranUmpan +
      fishTransaction.countPembayaranPancingan);

  //show transction
  dialogOption.show = true;
};

const payment = () => {
  if (
    state.gold -
      (fishTransaction.countPembayaranUmpan +
        fishTransaction.countPembayaranPancingan) <
    0
  ) {
    state.goldTidakCukup = true;
    return;
  }
  state.gold =
    state.gold -
    (fishTransaction.countPembayaranUmpan +
      fishTransaction.countPembayaranPancingan);
  state.letsPlay = true;    
  let sendData = {
    gold: state.gold,
    listPancing: fishTransaction.listPembelianPancing,
    listUmpan: umpanBeli
  } 
  startingAppStore.transactionClear(sendData)

  closeDialog(); 
};
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
