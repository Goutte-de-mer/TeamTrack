<template>
  <NuxtLayout name="dashboard">
    <template #header-title>Projets</template>

    <template #header-actions>
      <Modal>
        <template #default="{ open }">
          <button
            class="bg-light-green hover:bg-green flex h-8 w-9 cursor-pointer items-center justify-center rounded-full text-nowrap text-white transition active:scale-95 md:h-auto md:w-auto md:flex-nowrap md:gap-x-2 md:rounded-md md:px-3.5 md:py-2.5"
            @click="open"
          >
            <Icon name="heroicons:plus-circle" class="text-xl" />
            <span class="hidden md:inline">Nouveau projet</span>
          </button>
        </template>
        <template #content="{ close }">
          <NewProjectForm :close="close" @project-created="refreshProjects" />
        </template>
      </Modal>
    </template>

    <p v-if="loading">Chargement des projets...</p>

    <!-- LISTE PROJETS -->
    <ul
      v-else-if="projects.length > 0"
      class="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <li
        v-for="project in projects"
        :key="project._id"
        class="group relative flex cursor-pointer flex-col space-y-2.5 overflow-hidden rounded-lg bg-white px-6 py-4 transition active:scale-95"
        @click="navigateTo(`/dashboard/project/${project._id}`)"
      >
        <h3 class="text-green font-medium">{{ project.title }}</h3>
        <p class="truncate">{{ project.description }}</p>
        <small class="mt-auto"
          >Propriétaire : {{ project.owner.userName }}</small
        >
        <!-- OVERLAY -->
        <div
          class="absolute inset-0 flex translate-y-full items-center justify-center bg-black/60 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <div class="text-center text-white">
            <Icon name="heroicons:eye" class="mx-auto mb-2 text-2xl" />
            <p class="text-sm font-medium">Voir le projet</p>
          </div>
        </div>
      </li>
    </ul>
    <p v-else>Aucun projet trouvé</p>
    <div v-if="errorMessage">
      <p class="error">{{ errorMessage }}</p>
    </div>
  </NuxtLayout>
</template>

<script setup>
import { getProjects } from "~/api";
const projects = ref([]);
const loading = ref(true);
const errorMessage = ref(null);

const fetchProjects = async () => {
  loading.value = true;
  try {
    const response = await getProjects();

    if (response.ok) {
      const data = await response.json();
      if (data.projects) {
        projects.value = data.projects;
      }
    } else {
      navigateTo("/");
    }
  } catch (error) {
    errorMessage.value = "Problème est survenu, veuillez réessayer";
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  await fetchProjects();
});

const refreshProjects = async () => {
  await fetchProjects();
};
</script>
