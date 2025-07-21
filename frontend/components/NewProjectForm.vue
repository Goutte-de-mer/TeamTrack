<template>
  <h3 class="mt-3 mb-8 text-center text-xl text-black">Nouveau projet</h3>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-y-8 text-black">
    <div>
      <p class="mb-3">Collaborateurs :</p>
      <div
        v-if="formData.collaborators.length > 0"
        class="flex w-full flex-wrap gap-2"
      >
        <span
          v-for="collaboratorId in formData.collaborators"
          :key="collaboratorId"
          class="flex w-fit items-center justify-between gap-x-3 rounded-md bg-slate-200 px-3 py-1.5 text-sm"
        >
          {{ getUserName(collaboratorId) }}
          <button
            type="button"
            @click="removeCollaborator(collaboratorId)"
            class="cursor-pointer"
          >
            <XMarkIcon class="size-4" />
          </button>
        </span>
      </div>
      <p v-else class="text-sm text-slate-400 italic">Aucun collaborateur</p>
    </div>
    <div class="flex gap-x-8">
      <input
        type="text"
        placeholder="Titre"
        class="input"
        v-model="formData.title"
      />
      <div class="flex items-center gap-2.5">
        <Combobox
          v-model="selected"
          :items="users"
          placeholder="Rechercher un utilisateur"
          displayField="userName"
          keyField="_id"
        />
        <button
          type="button"
          class="hover:bg-green bg-light-green h-fit cursor-pointer rounded-sm p-1.5 text-white transition active:scale-90"
          @click="addCollaborator"
          :disabled="!selected"
        >
          <CheckIcon class="size-5" />
        </button>
      </div>
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
import { CheckIcon, XMarkIcon } from "@heroicons/vue/20/solid";
import { reactive } from "vue";
import { createProject, getUsers } from "~/api";

const { close } = defineProps({
  close: Function,
});

const emit = defineEmits(["task-created"]);
const error = ref("");
const isLoading = ref(false);
let selected = ref(null);
const users = ref([]);

onMounted(async () => {
  await getAllUsers();
  console.log(users);
});

const formData = reactive({
  title: "",
  description: "",
  collaborators: [],
});

const handleSubmit = async () => {
  if (!formData.title) {
    return (error.value = "Le titre est obligatoire");
  }
  error.value = "";
  isLoading.value = true;

  try {
    const response = await createProject(formData);
    if (!response.ok) {
      error.value = response.error;
    } else {
      close();
      emit("project-created");
    }
  } catch (err) {
    error.value = "Une erreur inattendue est survenue.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const addCollaborator = () => {
  if (!selected.value) return;

  if (!formData.collaborators.includes(selected.value._id)) {
    formData.collaborators.push(selected.value._id);
  }

  selected.value = null;
};
const removeCollaborator = (collaboratorId) => {
  formData.collaborators = formData.collaborators.filter(
    (id) => id !== collaboratorId,
  );
};
const getUserName = (userId) => {
  const user = users.value.find((u) => u._id === userId);
  return user ? user.userName : "Utilisateur inconnu";
};
const getAllUsers = async () => {
  const res = await getUsers();
  if (res.ok) {
    const data = await res.json();
    users.value = data;
  }
};
</script>
