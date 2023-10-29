<template>
    <div>
        <Fishing 
            :loadPlayGames="loadPlayGames"
        />
    </div>
</template>

<script setup>
import Fishing from "@/components/fishing/Fishing.vue"
import { useStartingAppStore } from '@/store/startingApp';
import { ref } from "vue";

const startingApp = useStartingAppStore();

const loadPlayGames = ref()

const getData = async () => {
    let result = await startingApp.loadPlayGames();
    loadPlayGames = result
    // console.log(result);
}

getData()

</script>

<style lang="scss" scoped>

</style>