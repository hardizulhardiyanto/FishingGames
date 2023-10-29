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
      fishBait: [
        {
          name: "red",
          price: 1,
          fishCatch: 1,
        },
        {
          name: "red",
          price: 1,
          fishCatch: 1,
        },
        {
          name: "red",
          price: 1,
          fishCatch: 1,
        },
        {
          name: "green",
          price: 3,
          fishCatch: 1,
        },
      ],
    },
  }),

  actions: {
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
      let result = {
        fishLoad: JSON.parse(cookies.get("fishTarget")),
        playerStart: JSON.parse(JSON.stringify(this.playerStart))
      }

      return result
    }
  },
});
