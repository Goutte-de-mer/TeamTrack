<template>
  <NuxtLayout name="dashboard">
    <template #header-title>Profile</template>
    <div class="space-y-4">
      <p
        v-for="(value, key) in formData"
        :key="key"
        class="flex items-center gap-x-2"
      >
        {{ key === "userName" ? "Nom d'utilisateur" : "Email" }} :
        <template v-if="editingFields[key]">
          <input
            v-model="formData[key]"
            class="input max-w-[200px]"
            :type="key === 'userName' ? 'text' : 'email'"
          />
          <button
            class="cursor-pointer p-1 text-green-400 transition hover:text-green-500 active:scale-90"
            @click="saveField(key)"
          >
            <CheckIcon class="size-5" />
          </button>
          <button
            class="cursor-pointer p-1 text-red-400 transition hover:text-red-500 active:scale-90"
            @click="cancelEdit(key)"
          >
            <XMarkIcon class="size-5" />
          </button>
        </template>
        <template v-else>
          <span class="w-full max-w-[200px] rounded-md bg-white px-2.5 py-1">{{
            value
          }}</span>
          <button
            class="hover:text-green cursor-pointer p-1 transition active:scale-90"
            @click="editField(key)"
          >
            <PencilIcon class="size-5" />
          </button>
        </template>
      </p>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/vue/24/outline";
const userStore = useUserStore();
const formData = reactive({
  userName: userStore.user.userName,
  email: userStore.user.email,
});
const editingFields = reactive({
  userName: false,
  email: false,
});
const editField = (key) => {
  editingFields[key] = true;
};
const cancelEdit = (key) => {
  formData[key] = userStore.user[key];
  editingFields[key] = false;
};
const saveField = async (key) => {
  editingFields[key] = false;

  await userStore.updateUser({ [key]: formData[key] });
};
</script>
