<template>
  <div class="flex min-h-screen flex-col items-center justify-center">
    <p v-if="error" class="mb-2.5 font-medium text-red-400">{{ error }}</p>
    <form
      @submit.prevent="handleLogin"
      class="flex w-full max-w-sm flex-col space-y-7 rounded-md px-8 py-5 shadow-md"
    >
      <h1 class="mb-10 text-2xl font-medium">Connexion</h1>
      <input
        v-model="formData.email"
        type="email"
        class="input"
        placeholder="Email"
      />
      <PasswordInput v-model="formData.password" label="Mot de passe" />

      <button
        type="submit"
        class="btn from-green to-light-green rounded-md bg-gradient-to-br text-white"
        :disabled="isLoading"
      >
        {{ isLoading ? "Connexion..." : "Se connecter" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { validateAllFields } from "@/utils/validateForm";
import { loginUser } from "~/api";
import { navigateTo } from "#app";

const formData = reactive({
  email: "",
  password: "",
});
const error = ref("");
const isLoading = ref(false);

const handleLogin = async () => {
  // Validation des champs
  if (!validateAllFields(formData)) {
    return (error.value = "Tous les champs sont obligatoires");
  }

  // Réinitialiser l'erreur et activer l'état de chargement
  error.value = "";
  isLoading.value = true;

  try {
    const result = await loginUser(formData);
    console.log(result);
    if (!result.success) {
      error.value = result.message;
    } else {
      console.log(result.success);
      navigateTo("/dashboard");
      // window.location.href = "/dashboard";
    }
  } catch (err) {
    // En théorie, loginUser ne throw plus, mais au cas où
    error.value = "Une erreur inattendue est survenue.";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>
