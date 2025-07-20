<template>
  <NuxtLayout name="dashboard">
    <template #header-title>Projects</template>

    <template #header-actions>
      <button
        class="bg-light-green hover:bg-green flex items-center gap-x-2 rounded-md px-3.5 py-2.5 text-white transition"
      >
        <Icon name="heroicons:plus-circle" class="text-xl" /> Nouveau projet
      </button>
    </template>

    <p v-if="loading">Chargement des projets...</p>

    <!-- PROJETS LISTE -->
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

onMounted(async () => {
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
});
</script>
