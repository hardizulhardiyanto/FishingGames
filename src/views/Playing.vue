<template>
    <div>
        <p>Playing</p>
    </div>
</template>

<script setup>
import { useStartingAppStore } from '@/store/startingApp';

const startingApp = useStartingAppStore();

const getData = async () => {
    let result = await startingApp.loadPlayGames();
    // let parseResult = JSON.stringify(JSON.parse())
    console.log(result);

}

getData()

</script>

<style lang="scss" scoped>

</style>