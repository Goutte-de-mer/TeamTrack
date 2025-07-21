<template>
  <NuxtLayout name="dashboard">
    <template #header-title>{{ project.title || "Chargement..." }}</template>
    <template #header-actions>
      <Modal>
        <template #default="{ open }">
          <button
            class="bg-light-green hover:bg-green flex h-8 w-9 cursor-pointer items-center justify-center rounded-full text-nowrap text-white transition active:scale-95 md:h-auto md:w-auto md:flex-nowrap md:gap-x-2 md:rounded-md md:px-3.5 md:py-2.5"
            @click="open"
          >
            <Icon name="heroicons:plus-circle" class="text-xl" />
            <span class="hidden md:inline">Nouvelle tâche</span>
          </button>
        </template>
        <template #content="{ close }">
          <NewTaskForm
            :project="project"
            :close="close"
            @task-created="refreshTasks"
          />
        </template>
      </Modal>
    </template>

    <div v-if="errorMessage">
      <p class="error">{{ errorMessage }}</p>
    </div>

    <div class="mb-7 flex w-full flex-col justify-between gap-3 sm:flex-row">
      <div
        v-if="userStore.user.userId === project?.owner?._id"
        class="grid w-full max-w-md grid-cols-[1fr_auto] items-center gap-x-3.5"
      >
        <Combobox
          v-model="selected"
          :items="users"
          placeholder="Ajouter un collaborateur"
          displayField="userName"
          keyField="_id"
        />
        <button
          class="hover:bg-green bg-light-green cursor-pointer rounded-sm p-1.5 text-white transition active:scale-90"
          @click="addCollaborator"
        >
          <CheckIcon class="size-5" />
        </button>
      </div>
      <Popover>
        <div v-if="project.collaborators?.length > 0" class="space-y-3">
          <div
            v-for="user in project.collaborators"
            :key="user._id"
            class="flex w-fit items-center justify-between gap-x-3 rounded-md bg-slate-200 px-3 py-1.5"
          >
            <span class="text-sm">{{ user.userName }}</span>
            <button
              @click="removeCollaborator(user._id)"
              class="cursor-pointer"
            >
              <XMarkIcon class="size-4" />
            </button>
          </div>
        </div>
        <p v-else class="text-sm text-gray-500 italic">Aucun collaborateur</p>
      </Popover>
    </div>

    <TabGroup>
      <!-- Onglets -->
      <TabList class="mb-6 flex w-fit space-x-4 rounded-md bg-[#fdfdfd] p-1">
        <Tab
          v-for="status in statuses"
          :key="status"
          as="template"
          v-slot="{ selected }"
        >
          <button
            class="cursor-pointer rounded-md px-4 py-2 transition focus-visible:outline-0"
            :class="
              selected
                ? 'bg-green font-semibold text-white'
                : 'text-gray-700 hover:text-black'
            "
          >
            {{ status }} ({{ tasksByStatus[status]?.length || 0 }})
          </button>
        </Tab>
      </TabList>

      <!-- Contenu par statut -->
      <TabPanels>
        <TabPanel
          v-for="status in statuses"
          :key="status"
          class="focus:outline-none"
        >
          <ul class="space-y-4">
            <li
              v-if="!tasksByStatus[status]?.length"
              class="text-gray-500 italic"
            >
              {{ loading ? "Chargement..." : "Aucune tâche" }}
            </li>
            <TaskItem
              v-for="task in tasksByStatus[status]"
              :key="task._id"
              :task="task"
              :statuses
              @status-changed="updateTaskStatus"
              @task-deleted="refreshTasks"
            />
          </ul>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </NuxtLayout>
</template>

<script setup>
import { getProjectById, getUsers, updateProjectInfos } from "~/api";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { CheckIcon, XMarkIcon } from "@heroicons/vue/24/outline";

const userStore = useUserStore();
const route = useRoute();
const loading = ref(true);
const errorMessage = ref(null);
const project = ref({});
const tasks = ref([]);
const users = ref([]);
const statuses = ["À faire", "En cours", "Terminé"];
let selected = ref(null);

watch(selected, (newUser) => {
  if (!newUser) return;

  if (!collaboratorsFormData.collaborators.includes(newUser._id)) {
    collaboratorsFormData.collaborators.push(newUser._id);
  }

  selected.value = null;
});

const collaboratorsFormData = reactive({
  projectId: "",
  collaborators: [],
});

const getAllUsers = async () => {
  if (userStore?.user.userId != project.value.owner._id) {
    return;
  }
  const res = await getUsers();
  if (res.ok) {
    const data = await res.json();
    const collaboratorIds = project.value.collaborators.map((c) => c._id);
    const ownerId = project.value.owner._id;
    users.value = data.filter((user) => {
      return user._id !== ownerId && !collaboratorIds.includes(user._id);
    });
  }
};
onMounted(async () => {
  loading.value = true;
  try {
    const response = await getProjectById(route.params.id);
    if (response.ok) {
      const data = await response.json();
      if (data.project) {
        project.value = data.project;
        console.log(project.value);
        tasks.value = data.tasks;
        collaboratorsFormData.collaborators =
          data.project.collaborators?.map((u) => u._id) || [];
        collaboratorsFormData.projectId = data.project._id;

        await getAllUsers();
      } else {
        navigateTo("/");
      }
    }
  } catch (error) {
    errorMessage.value = "Problème est survenu, veuillez réessayer";
    console.log("erreur :", error);
  } finally {
    loading.value = false;
  }
});

const refreshTasks = async () => {
  const response = await getProjectById(route.params.id);
  const data = await response.json();
  tasks.value = data.tasks;
};

const refreshCollaborators = async () => {
  const response = await getProjectById(route.params.id);
  const data = await response.json();
  project.value = data.project;
};

const tasksByStatus = computed(() => {
  return tasks.value.reduce((acc, task) => {
    if (!acc[task.status]) acc[task.status] = [];
    acc[task.status].push(task);
    return acc;
  }, {});
});

const addCollaborator = async () => {
  try {
    const res = await updateProjectInfos(collaboratorsFormData);
    if (res.ok) {
      selected.value = null;
      await getAllUsers();
      await refreshCollaborators();
    } else {
      const data = await res.json();
      console.log(data);
    }
  } catch (error) {}
};

const removeCollaborator = async (collaboratorId) => {
  collaboratorsFormData.collaborators =
    collaboratorsFormData.collaborators.filter((id) => id !== collaboratorId);

  try {
    const res = await updateProjectInfos(collaboratorsFormData);
    if (res.ok) {
      await refreshCollaborators();
      await getAllUsers();
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
  }
};

const updateTaskStatus = ({ taskId, newStatus }) => {
  const task = tasks.value.find((t) => t._id === taskId);
  if (task) task.status = newStatus;
};
</script>
