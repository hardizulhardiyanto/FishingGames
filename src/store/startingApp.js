import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";
import { useRouter } from "vue-router";
import { fishBait, fishEquipment, fishMaster } from "./helpersObject";
import { getRandomNumber, getRandomPersentage } from "./helpersLogic";

const { cookies } = useCookies();
export const useStartingAppStore = defineStore({
  id: "StartingApp",

  state: () => ({
    fishTarget: [],
    playerStart: {
      equipment: "small", //pancingan
      equipmentList: [],
      fishBait: [
        // {
        //   name: "red",
        //   price: 1,
        //   fishCatch: 1,
        // },
        // {
        //   name: "red",
        //   price: 1,
        //   fishCatch: 1,
        // },
        // {
        //   name: "red",
        //   price: 1,
        //   fishCatch: 1,
        // },
        // {
        //   name: "green",
        //   price: 3,
        //   fishCatch: 1,
        // },
      ],
      fishBaitCount_old: {
        red: 10,
        blue: 10,
        green: 10
      },
      fishBaitCount: {}
    },
  }),

  actions: {
    async transactionClear(payload) {
      let rawObject = JSON.parse(JSON.stringify(payload))
      
      //set new data
      let userEnter = cookies.get("userEnter");
      let userSet = {
        date: Date.now(),
        userName: userEnter.userName,
        gold: rawObject.gold,
      };
      cookies.set("userEnter", JSON.stringify(userSet));

      let equipmentList = []
      //set equipment
      if (rawObject.listPancing.length > 0) {
        rawObject.listPancing.map((el) => {
          equipmentList.push({
            name: el.fishCatch,
            price: el.price,
            fishCatch: el.fishCatch,
          },)
        })
      }
      //Set Equipment
      this.playerStart.equipmentList = equipmentList;
      //set umpan
      this.playerStart.fishBaitCount =  {
        red: parseInt(rawObject.listUmpan.redFish),
        blue: parseInt(rawObject.listUmpan.blueFish),
        green: parseInt(rawObject.listUmpan.greenFish)
      }
      
    },
    async enterUser(userName) {
      let userSet = {
        date: Date.now(),
        userName: userName,
        gold: 100,
      };
      cookies.set("userEnter", JSON.stringify(userSet));
    },

    async getUser() {
      let userEnter = cookies.get("userEnter");
      return userEnter;
    },

    async checkUser() {
      const router = useRouter();

      if (cookies.get("userEnter")) {
        router.push({ name: "Dashboard" });
      }
    },

    async loadFishTarget() {
      let color = ["red", "blue", "green"];
      let initPercentage = [10, 20, 30];
      let fishingCount = fishEquipment.map((el, i) => {
        let result = {
          fishName: el.name,
          countToday: Math.floor(Math.random() * 10) + 1,
          fishColor: color[i],
          percentage: initPercentage[i], //add init percentage
        };
        return result;
      });
      let getPercentageFish = getRandomPersentage(fishingCount);
      this.fishTarget = getPercentageFish;
      cookies.set("fishTarget", JSON.stringify(getPercentageFish));

      return getPercentageFish;
    },

    async getRequirement() {
      return {
        fishBait,
        fishEquipment,
      };
    },

    async loadPlayGames() {
      //start menambahkan ke state: hanya untuk development
      // let fishBait = []
      // for (let i = 0; i<10;i++) {
      //   fishBait.push({
      //     name: "red",
      //     price: 1,
      //     fishCatch: 1,
      //   });
      // }
      // for (let i = 0; i<10;i++) {
      //   fishBait.push({
      //     name: "blue",
      //     price: 1,
      //     fishCatch: 1,
      //   });
      // }
      // for (let i = 0; i<10;i++) {
      //   fishBait.push({
      //     name: "green",
      //     price: 1,
      //     fishCatch: 1,
      //   });
      // }
      // this.playerStart.fishBait = fishBait
      //end

      let result = {
        fishLoad: JSON.parse(cookies.get("fishTarget")),
        playerStart: JSON.parse(JSON.stringify(this.playerStart)),
      };

      return result;
    },
  },
});
