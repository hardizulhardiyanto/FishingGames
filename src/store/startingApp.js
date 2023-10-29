import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";
import { useRouter } from "vue-router";

const { cookies } = useCookies();
const router = useRouter();
export const useStartingAppStore = defineStore({
  id: "StartingApp",

  actions: {
    async enterUser(userName) {
      let userSet = {
        date: Date.now(),
        userName: userName,
        gold: 100 
      }  
      cookies.set("userEnter", JSON.stringify(userSet));
    },

    async checkUser() {
      if (cookies.get("userEnter")) {
        router.push({ name: "Dashboard" });
      }
    },
  },
});
