<template>
    <div>
        <h1>Dashboard</h1>
    </div>
</template>

<script setup>
import { useStartingAppStore } from '@/store/startingApp';
const startingAppStore = useStartingAppStore();

const getUsers = async () => {
  let userDetail = await startingAppStore.getUser()
  console.log(userDetail);
}

getUsers();
</script>

<style lang="scss" scoped>

</style>