<template>
  <div class="flex min-h-screen flex-col items-center justify-center">
    <p v-if="error" class="mb-2.5 font-medium text-red-400">{{ error }}</p>
    <form
      @submit.prevent="handleRegister"
      class="flex w-full max-w-sm flex-col space-y-7 rounded-md px-8 py-5 shadow-md"
    >
      <h1 class="mb-10 text-2xl font-medium">Inscription</h1>
      <input
        v-model="formData.email"
        type="email"
        required
        class="input"
        placeholder="Email"
      />
      <input
        v-model="formData.userName"
        type="text"
        required
        class="input"
        placeholder="Nom"
      />

      <PasswordInput v-model="formData.password" label="Mot de passe" />
      <PasswordInput
        v-model="formData.confirmPassword"
        label="Confirmez le mot de passe"
      />

      <button
        type="submit"
        class="btn from-green to-light-green rounded-md bg-gradient-to-br text-white"
        :disabled="isLoading"
      >
        {{ isLoading ? "Inscription..." : "Je m'inscris" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { reactive } from "vue";
import { validateAllFields } from "@/utils/validateForm";
import { registerUser } from "~/api";

const error = ref("");
const isLoading = ref(false);

const formData = reactive({
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const handleRegister = async () => {
  if (!validateAllFields(formData)) {
    return (error.value = "Tous les champs sont obligatoires");
  }
  const usernameRegex = /^[A-Za-z0-9_\-\s]+$/;
  if (!usernameRegex.test(formData.userName)) {
    return (error.value =
      "Le nom d'utilisateur ne peut pas contenir d'accent. Seulement lettres, chiffres, _, espace et -");
  }
  if (formData.userName.length < 3 || formData.userName.length > 20) {
    return (error.value =
      "Le nom d'utilisateur doit contenir entre 3 et 20 caractères");
  }
  error.value = "";
  isLoading.value = true;

  try {
    const result = await registerUser(formData);
    if (!result.success) {
      error.value = result.message;
    } else {
      navigateTo("/dashboard");
    }
  } catch (err) {
    error.value = "Une erreur inattendue est survenue.";
    // console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>
