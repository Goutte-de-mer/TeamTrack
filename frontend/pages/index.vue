<template>
  <div class="flex min-h-screen flex-col items-center justify-center">
    <h1 class="mb-10 text-2xl font-medium">Bienvenue</h1>
    <div class="space-x-6">
      <CustomButton to="/login" label="Connexion" />
      <CustomButton to="/register" label="Inscription" />
    </div>
  </div>
</template>

<script setup></script>
