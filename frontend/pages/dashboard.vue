<template>
  <div v-if="userStore.user">Bienvenue, {{ userStore.user.userName }} !</div>
  <p v-if="loading">Chargement des projets...</p>

  <ul v-else-if="projects.length > 0">
    <li v-for="project in projects" :key="project._id">
      Titre : {{ project.title }}
    </li>
  </ul>
  <p v-else>Aucun projet trouvé</p>
  <div v-if="errorMessage">
    <p class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
const userStore = useUserStore();
const projects = ref([]);
const loading = ref(true);
const errorMessage = ref(null);

onMounted(async () => {
  try {
    loading.value = true;

    const response = await fetch("/api/projects/all", {
      credentials: "include",
    });
    console.log("Status reçu:", response.status);

    if (response.status === 304) {
      // console.log("Données non modifiées (304)");
      return;
    }

    if (response.ok) {
      const data = await response.json();
      if (data.projects) {
        projects.value = data.projects;
      }
    } else {
      // console.log("Erreur HTTP:", response.status);
      navigateTo("/");
    }
  } catch (error) {
    errorMessage.value = "Problème est survenu, veuillez réessayer";
  } finally {
    loading.value = false;
  }
});
</script>
