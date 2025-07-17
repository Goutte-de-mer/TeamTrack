export const useUserStore = defineStore("user", () => {
  const user = ref(null);

  const setUser = (data: any) => {
    user.value = data;
  };

  const clearUser = () => {
    user.value = null;
  };

  return { user, setUser, clearUser };
});
