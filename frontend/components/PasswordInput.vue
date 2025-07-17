<template>
  <div class="flex items-center">
    <input
      v-model="password"
      :type="showPass ? 'text' : 'password'"
      class="input"
      :placeholder="label"
      required
    />

    <Icon
      @click="showPass = !showPass"
      class="cursor-pointer text-2xl text-black"
      :name="showPass ? 'heroicons:eye' : 'heroicons:eye-slash'"
    />
  </div>
</template>

<script setup>
const password = defineModel();
const showPass = ref(false);
defineProps({
  label: String,
});
</script>
