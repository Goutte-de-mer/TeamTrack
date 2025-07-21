<template>
  <div>
    <slot :open="() => (open = true)" />

    <TransitionRoot as="template" :show="open">
      <Dialog class="relative z-40" @close="open = false">
        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60" />
        </TransitionChild>
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="relative w-full max-w-xl transform rounded-lg bg-white p-6 shadow-xl"
              >
                <button
                  @click="open = false"
                  class="absolute top-2 right-2 cursor-pointer p-1 text-slate-500 transition hover:text-slate-400"
                >
                  <XMarkIcon class="size-5" />
                </button>

                <slot name="content" :close="() => (open = false)" />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
const open = ref(false);
import { XMarkIcon } from "@heroicons/vue/20/solid";
</script>
