<template>
  <aside
    class="fixed top-0 z-30 flex h-screen min-w-3xs flex-col border-r-2 border-slate-200 bg-white p-5 shadow-lg transition-transform duration-500 md:sticky md:translate-0 md:shadow-none"
    :class="[isOpen ? 'translate-x-0' : '-translate-x-full']"
  >
    <div
      v-if="userStore.user"
      class="relative border-b-3 border-slate-200 px-3 pb-2.5 font-medium text-slate-400"
    >
      <button
        v-if="isOpen"
        class="absolute -top-4 -right-3 block cursor-pointer p-2 md:hidden"
        @click="isOpen = false"
      >
        <XMarkIcon class="size-5 text-black" />
      </button>
      <div class="mt-3 flex items-center justify-center gap-x-4">
        <UserCircleIcon class="size-9" />
        <!-- <Icon name="solar:user-circle-broken" class="text-3xl" /> -->
        <span>
          {{ userStore.user.userName }}
        </span>
      </div>
    </div>
    <nav class="py-5">
      <p class="text-sm font-bold text-slate-400 uppercase">menu</p>
      <ul class="mt-6 space-y-3">
        <li v-for="item in menuItems" :key="item.path">
          <NuxtLink
            :to="item.path"
            :class="['menuItem', isActive(item.path) ? 'isActive' : null]"
          >
            <component :is="item.icon" class="size-5" />
            <span>{{ item.name }}</span>
          </NuxtLink>
        </li>
        <Modal>
          <template #default="{ open }">
            <button class="menuItem w-full" @click="open">
              <PlusCircleIcon class="size-5" />
              <span>Nouveau projet</span>
            </button>
          </template>
          <template #content="{ close }">
            <NewProjectForm
              :project="project"
              :close="close"
              @project-created="refreshProjects"
            />
          </template>
        </Modal>
      </ul>
    </nav>
    <div class="mt-auto border-t-3 border-slate-200 pt-2.5">
      <button
        class="hover:bg-beige mx-auto flex w-full cursor-pointer items-center justify-center gap-x-3 rounded-md px-4 py-2.5 transition active:scale-95"
        v-on:click="logout"
      >
        <Icon
          name="heroicons:arrow-left-end-on-rectangle-solid"
          class="text-xl"
        />
        Déconnexion
      </button>
      <p v-if="errorMessage" class="font-medium text-red-500">
        {{ errorMessage }}
      </p>
    </div>
  </aside>
</template>

<script setup>
import { logoutUser } from "~/api";
import {
  Squares2X2Icon,
  PlusCircleIcon,
  UserIcon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/vue/24/outline";

const userStore = useUserStore();

const route = useRoute();
const errorMessage = ref("");

const isOpen = defineModel("open", { default: false });
const isActive = (path) => route.path === path;
const menuItems = [
  {
    name: "Tableau de bord",
    path: "/dashboard",
    icon: Squares2X2Icon,
  },

  {
    name: "Profil",
    path: "/profile",
    icon: UserIcon,
  },
];

const logout = async () => {
  try {
    const response = await logoutUser();
    if (response.ok) {
      userStore.clearUser();
      navigateTo("/");
    }
  } catch (error) {
    // console.log(error);
    errorMessage.value = "Un problème est survenu";
  }
};
</script>
