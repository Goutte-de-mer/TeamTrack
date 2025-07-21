import { updateUserInfos } from "~/api";
export const useUserStore = defineStore("user", () => {
  const user = ref<any>(null);

  const setUser = (data: any) => {
    user.value = data;
  };

  const clearUser = () => {
    user.value = null;
  };

  const updateUser = async (updates: Partial<typeof user.value>) => {
    if (!user.value) return { success: false, error: "Aucun utilisateur" };

    try {
      const response = await updateUserInfos(updates);
      if (response.ok) {
        const data = await response.json();
        const { userName, email } = data;
        user.value = { ...user.value, userName, email };
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Erreur lors de la mise à jour du user :", error);
      return { success: false, error };
    }
  };

  return { user, setUser, clearUser, updateUser };
});
