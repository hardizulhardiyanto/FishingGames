<template>
    <v-dialog
      v-model="props.dialog"
      persistent
      :max-width="props.useWidthCard"
      overlay-opacity="0.20"
      scrollable
    >
      <v-card>
        <v-card-title class="bg-primary">
          <v-row align="center" justify="space-between" no-gutters>
            <div>
              <p class="text-subtitle-2">{{ formTitle }}</p>
            </div>
            <div v-if="props.isCloseBtn">
              <v-btn color="red">
                CLOSE
              </v-btn>
            </div>
          </v-row>
        </v-card-title>
  
        <v-card-text class="pa-2">
          <v-card class="accent bg-accent pa-2">
            <slot name="formItem" />
          </v-card>
        </v-card-text>
  
        <v-divider class="mt-3 mt-1" v-if="props.useAction" />
  
        <v-card-actions v-if="props.useAction">
          <slot name="action" class="pa-3" />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup>
  import { useDisplay } from "vuetify";
  import { computed, reactive, watch } from "vue";
  
  const emit = defineEmits(["closeDialog"]);
  const props = defineProps({
    dialog: {
      type: Boolean,
      default: () => false,
    },
    useAction: {
      type: Boolean,
      default: () => false,
    },
    isCloseBtn: {
      type: Boolean,
      default: () => false,
    },
    formTitle: {
      type: String,
      default: () => "title",
    },
    useWidthCard: {
      type: Number,
      default: () => 850,
    }
  });
  
  const dialog = reactive({
    value: false,
    widthCard: 0,
  });
  
  watch([props], () => {
    dialog.value = props.dialog;
    if (props.useWidthCard > 0) {
      dialog.widthCard = props.useWidthCard;
    } else {
      dialog.widthCard = widthCard;
    }
  });
  
  const { name } = useDisplay();
  const widthCard = computed(() => {
    // name is reactive and
    // must use .value
    switch (name.value) {
      case "xs":
        return 260;
      case "sm":
        return 400;
      case "md":
        return 500;
      case "lg":
        return 600;
      case "xl":
        return 800;
      case "xxl":
        return 1200;
    }
    return undefined;
  });
  </script>
  
  <style scoped></style>
  