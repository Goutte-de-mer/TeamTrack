<template>
  <aside
    class="sticky top-0 hidden h-screen min-w-3xs flex-col border-r-2 border-slate-200 bg-white p-5 md:flex"
  >
    <div
      v-if="userStore.user"
      class="flex items-center justify-center gap-x-4 border-b-3 border-slate-200 px-3 pb-2.5 font-medium text-slate-400"
    >
      <Icon name="solar:user-circle-broken" class="text-3xl" />
      <span class="">
        {{ userStore.user.userName }}
      </span>
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
} from "@heroicons/vue/24/outline";

const userStore = useUserStore();

const route = useRoute();
const errorMessage = ref("");

const isActive = (path) => route.path === path;
const menuItems = [
  {
    name: "Tableau de bord",
    path: "/dashboard",
    icon: Squares2X2Icon,
  },
  {
    name: "Nouveau projet",
    path: "/dashboard/newProject",
    icon: PlusCircleIcon,
  },
  {
    name: "Profil",
    path: "#",
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
    console.log(error);
    errorMessage.value = "Un problème est survenu";
  }
};
</script>
