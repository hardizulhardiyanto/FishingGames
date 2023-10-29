<template>
    <v-container class="bg-white userinfo__container">
        <p class="text-subtitle-1">{{ props.textInfo }}</p>
    </v-container>
</template>

<script setup>
const props = defineProps({
    textInfo: {
        type: String,
        default: () => "Insert Props Info"
    }
})

</script>

<style lang="scss" scoped>
.userinfo__container {
    border: 3px;
    border-radius: 3px;
}
</style>