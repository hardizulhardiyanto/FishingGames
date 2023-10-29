import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";
import { useRouter } from "vue-router";

const { cookies } = useCookies();
export const useStartingAppStore = defineStore({
  id: "StartingApp",

  actions: {
    async enterUser(userName) {
      let userSet = {
        date: Date.now(),
        userName: userName,
        gold: 100,
      };
      cookies.set("userEnter", JSON.stringify(userSet));
    },

    async getUser () {
       let userEnter = cookies.get("userEnter")
       return userEnter 
    },

    async checkUser() {
      const router = useRouter();

      if (cookies.get("userEnter")) {
        router.push({ name: "Dashboard" });
      }
    },
  },
});
