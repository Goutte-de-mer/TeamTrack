<template>
  <h3 class="mt-3 mb-8 text-center text-xl text-black">Nouvelle tâche</h3>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-y-8 text-black">
    <div class="flex gap-x-8">
      <input
        type="text"
        placeholder="Titre"
        class="input"
        v-model="formData.title"
      />
      <!-- <Combobox v-model="selected">
        <div class="relative mt-1">
          <div
            class="overflow-hidde relative w-full cursor-default bg-white text-black sm:text-sm"
          >
            <ComboboxInput
              class="focus:border-b-green w-full border-b-2 border-b-gray-200 py-2 pr-10 pl-1 leading-5 transition focus-visible:outline-0"
              :displayValue="(user) => user?.userName || ''"
              @change="query = $event.target.value"
              placeholder="Rechercher un utilisateur"
            />
            <ComboboxButton
              class="absolute inset-y-0 right-0 flex items-center pr-2"
            >
              <ChevronUpDownIcon
                class="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>
          <TransitionRoot
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            @after-leave="query = ''"
          >
            <ComboboxOptions
              class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm"
            >
              <div
                v-if="filteredPeople.length === 0 && query !== ''"
                class="relative cursor-default px-4 py-2 text-gray-700 select-none"
              >
                Aucun résultat
              </div>

              <ComboboxOption
                v-for="user in filteredPeople"
                as="template"
                :key="user._id"
                :value="user"
                v-slot="{ active }"
              >
                <li
                  class="relative cursor-default py-2 pr-4 pl-6 select-none"
                  :class="{
                    'bg-green text-white': active,
                    'text-black': !active,
                  }"
                >
                  <span class="block truncate">
                    {{ user.userName }}
                  </span>
                </li>
              </ComboboxOption>
            </ComboboxOptions>
          </TransitionRoot>
        </div>
      </Combobox> -->
      <Combobox
        v-model="selected"
        :items="users"
        placeholder="Rechercher un utilisateur"
        displayField="userName"
        keyField="_id"
      />
    </div>
    <textarea
      v-model="formData.description"
      name="description"
      id="description"
      placeholder="Description"
      class="input"
    ></textarea>
    <button
      type="submit"
      class="btn from-green to-light-green mx-auto flex items-center justify-center gap-x-3 rounded-md bg-gradient-to-br text-white"
      :disabled="isLoading"
    >
      <CheckIcon class="size-5" />
      {{ isLoading ? "Validation..." : "Valider" }}
    </button>
    <p v-if="error" class="mb-2.5 font-medium text-red-400">{{ error }}</p>
  </form>
</template>

<script setup>
import { CheckIcon } from "@heroicons/vue/20/solid";
import { reactive } from "vue";
import { validateAllFields } from "@/utils/validateForm";
import { createTask } from "~/api";

const { project, close } = defineProps({
  project: Object,
  close: Function,
});
const emit = defineEmits(["task-created"]);
const userStore = useUserStore();
const error = ref("");
const isLoading = ref(false);

const users = project.collaborators;
let selected = ref(null);

watch(selected, (newUser) => {
  formData.assignedTo = newUser?._id || null;
});

const formData = reactive({
  title: "",
  description: "",
  assignedTo: userStore.user._id,
  projectId: project._id,
});

const handleSubmit = async () => {
  if (!validateAllFields(formData)) {
    return (error.value = "Tous les champs sont obligatoires");
  }
  error.value = "";
  isLoading.value = true;

  try {
    const response = await createTask(formData);
    if (!response.ok) {
      error.value = response.error;
    } else {
      close();
      emit("task-created");
    }
  } catch (err) {
    error.value = "Une erreur inattendue est survenue.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>
