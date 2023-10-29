<template>
    <div>
        <Fishing 
            :loadPlayGames="state.loadPlayGames"
        />
    </div>
</template>

<script setup>
import Fishing from "@/components/fishing/Fishing.vue"
import { useStartingAppStore } from '@/store/startingApp';
import { reactive, ref } from "vue";

const startingApp = useStartingAppStore();

let state = reactive({
    loadPlayGames: {}
})

const getData = async () => {
    let result = await startingApp.loadPlayGames();
    state.loadPlayGames = result
    console.log(result);
}

getData()

</script>

<style lang="scss" scoped>

</style>