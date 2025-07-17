// export default defineNuxtRouteMiddleware(async (to) => {
//   const publicRoutes = ["/", "/login", "/register"];
//   if (publicRoutes.includes(to.path)) return;

//   if (import.meta.server) {
//     const headers = useRequestHeaders(["cookie"]);

//     try {
//       const response = await $fetch(
//         "http://localhost:3001/users/check-cookie",
//         {
//           headers: {
//             cookie: headers.cookie || "",
//           },
//         },
//       );

//       if (!response.authenticated && to.path !== "/") {
//         return navigateTo("/");
//       }
//     } catch {
//       if (to.path !== "/") {
//         return navigateTo("/");
//       }
//     }
//   }
// });

// export default defineNuxtRouteMiddleware(async (to) => {
//   const publicPages = ["/", "/login", "/register"];
//   if (publicPages.includes(to.path)) return;

//   const userStore = useUserStore();
//   if (userStore.user) return; // déjà authentifié

//   if (import.meta.server) {
//     const headers = useRequestHeaders(["cookie"]);
//     try {
//       const response = await $fetch(
//         "http://localhost:3001/users/check-cookie",
//         {
//           headers: {
//             cookie: headers.cookie || "",
//           },
//         },
//       );
//       if (!response.authenticated) {
//         userStore.clearUser();
//         return navigateTo("/login");
//       }
//       userStore.setUser(response.user);
//     } catch {
//       userStore.clearUser();
//       return navigateTo("/login");
//     }
//   } else {
//     // côté client sans user -> rediriger vers login
//     return navigateTo("/login");
//   }
// });

export default defineNuxtRouteMiddleware(async (to) => {
  const publicPages = ["/", "/login", "/register"];
  if (publicPages.includes(to.path)) return;

  try {
    const response = await $fetch("http://localhost:3001/users/check-cookie", {
      credentials: "include",
    });

    if (!response.authenticated) {
      return navigateTo("/");
    }

    // Optionnel : tu peux mettre à jour le store si tu veux garder user en mémoire
    const userStore = useUserStore();
    userStore.setUser(response.user);
  } catch {
    return navigateTo("/");
  }
});
