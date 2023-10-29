<template>
    <v-container class="bg-white userinfo__container">
        <p class="text-subtitle-1">{{ props.username }}</p>
        <p class="text-subtitle-2">{{ 'your gold: '+ props.gold }}</p>
    </v-container>
</template>

<script setup>
const props = defineProps({
    username: {
        type: String,
        default: () => "Insert Username Props"
    },
    gold: {
        type: Number,
        default: () => 0
    }
})

</script>

<style lang="scss" scoped>
.userinfo__container {
    border: 3px;
    border-radius: 3px;
}
</style>