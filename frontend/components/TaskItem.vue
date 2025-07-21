<template>
  <li
    class="grid w-full grid-cols-1 items-center gap-x-3.5 gap-y-3 rounded-md bg-white px-7 py-5 sm:grid-cols-3"
  >
    <p class="font-semibold">{{ task.title }}</p>
    <p class="flex items-center gap-x-3 sm:justify-center">
      <UserIcon class="size-6" />
      <span class="font-medium">{{ task.assignedTo.userName }}</span>
    </p>
    <div class="flex items-center gap-x-2.5">
      <Listbox v-model="selectedStatus" @update:modelValue="handleStatusChange">
        <div class="relative mt-1 w-full">
          <ListboxButton
            :disabled="isUpdating"
            class="relative w-full cursor-pointer rounded-md bg-white py-2 pr-10 pl-3 text-left shadow-sm focus-visible:outline-none sm:text-sm"
          >
            <span class="block truncate">{{ selectedStatus }}</span>
            <span
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <ChevronUpDownIcon
                class="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <transition
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <ListboxOptions
              class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg focus:outline-none sm:text-sm"
            >
              <ListboxOption
                v-slot="{ active, selected }"
                v-for="status in statuses"
                :key="status"
                :value="status"
                as="template"
              >
                <li
                  :class="[
                    active ? 'bg-green text-white' : 'text-black',
                    'relative cursor-default py-2 pr-4 pl-10 select-none',
                  ]"
                >
                  <span
                    :class="[
                      selected ? 'font-medium' : 'font-normal',
                      'block truncate',
                    ]"
                    >{{ status }}</span
                  >
                  <span
                    v-if="selected"
                    class="absolute inset-y-0 left-0 flex items-center pl-3 text-green-700"
                  >
                    <CheckIcon class="h-5 w-5" aria-hidden="true" />
                  </span>
                </li>
              </ListboxOption>
            </ListboxOptions>
          </transition>
        </div>
      </Listbox>
      <button
        v-if="userStore.user.userId === task?.user?._id"
        class="text-small h-fit cursor-pointer rounded-sm bg-red-400 px-2.5 py-1.5 text-white transition hover:bg-red-500 active:scale-95"
        @click="deleteTaskFromProject"
      >
        <XMarkIcon class="size-4" />
      </button>
    </div>
    <p v-if="message" class="mt-2 text-sm text-red-500">
      {{ message }}
    </p>

    <p
      v-if="task.description"
      class="rounded-md bg-gray-100 px-4 py-2 sm:col-span-3"
    >
      {{ task.description }}
    </p>
  </li>
</template>

<script setup>
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import { UserIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import { updateTaskStatus, deleteTask } from "~/api";
const { task, statuses } = defineProps({
  task: Object,
  statuses: Array,
});
const selectedStatus = ref(task.status);
const emit = defineEmits(["status-changed", "task-deleted"]);
const message = ref("");
const isUpdating = ref(false);
const userStore = useUserStore();

console.log(task.user._id);

const handleStatusChange = async (newStatus) => {
  isUpdating.value = true;
  message.value = "";
  try {
    const res = await updateTaskStatus({ taskId: task._id, status: newStatus });
    if (res.ok) {
      emit("status-changed", { taskId: task._id, newStatus });
    } else {
      message.value = "Une erreur est survenue veuillez réessayer";
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut :", error);
    message.value = "Impossible de contacter le serveur.";
  } finally {
    isUpdating.value = false;
  }
};

const deleteTaskFromProject = async () => {
  try {
    const res = await deleteTask(task._id);
    if (!res.ok) {
      message.value = "Une erreur est survenue veuillez réessayer";
    } else {
      emit("task-deleted");
    }
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
    message.value = "Impossible de contacter le serveur.";
  }
};
</script>
