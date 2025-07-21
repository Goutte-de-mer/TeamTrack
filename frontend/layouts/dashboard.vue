<template>
  <main class="flex">
    <SideBar v-model:open="isMobileMenuOpen" />

    <div class="flex min-h-screen min-w-0 flex-1 flex-col">
      <header
        class="grid w-full grid-cols-[auto_1fr_auto] gap-x-3.5 px-10 py-6 md:grid-cols-[1fr_auto]"
      >
        <button
          @click="isMobileMenuOpen = true"
          class="mr-3 block cursor-pointer transition active:scale-90 md:hidden"
        >
          <Bars3Icon class="size-6" />
        </button>
        <h1 class="truncate text-lg font-bold uppercase md:text-xl lg:text-2xl">
          <slot name="header-title" />
        </h1>
        <slot name="header-actions" />
      </header>
      <div class="flex-1 bg-[#f6f6f6] px-10 py-5">
        <slot />
      </div>
    </div>
  </main>
</template>
<script setup>
import { Bars3Icon } from "@heroicons/vue/20/solid";

const isMobileMenuOpen = ref(false);
</script>
