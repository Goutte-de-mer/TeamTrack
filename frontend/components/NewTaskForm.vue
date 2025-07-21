<template>
  <h3 class="mt-3 mb-8 text-center text-xl text-black">Nouvelle tâche</h3>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-y-8 text-black">
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <input
        type="text"
        placeholder="Titre"
        class="input"
        v-model="formData.title"
      />

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
  if (!formData.title) {
    return (error.value = "Le titre est obligatoire");
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
