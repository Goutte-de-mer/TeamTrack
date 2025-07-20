import { checkAuth } from "~/utils/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ["/", "/login", "/register"];
  if (publicRoutes.includes(to.path)) return;

  const userStore = useUserStore();

  try {
    const response = await checkAuth();
    if (!response.authenticated) {
      return navigateTo("/");
    }
    userStore.setUser(response.user);
  } catch {
    return navigateTo("/");
  }
});
