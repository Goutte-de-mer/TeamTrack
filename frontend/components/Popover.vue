<template>
  <Popover class="relative ml-auto">
    <PopoverButton
      class="from-green to-light-green flex h-fit cursor-pointer items-center gap-3 rounded-md bg-gradient-to-br px-3 py-2 text-white transition active:scale-90"
    >
      <UsersIcon class="size-5" />
      Collaborateurs
    </PopoverButton>

    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0 "
    >
      <PopoverPanel
        class="absolute z-20 mt-2 min-w-full rounded-md bg-white px-4 py-2.5 shadow-md/5"
      >
        <slot></slot>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup>
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";
import { UsersIcon } from "@heroicons/vue/24/outline";
</script>
