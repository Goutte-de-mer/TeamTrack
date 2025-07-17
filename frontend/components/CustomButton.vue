<template>
  <button class="btn bg-green hover:bg-light-green" @click="go">
    {{ label }}
  </button>
</template>

<script setup>
const props = defineProps({
  to: String,
  label: String,
});

const router = useRouter();
function go() {
  router.push(props.to);
}
</script>
