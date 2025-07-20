export const checkAuth = async () => {
  if (import.meta.server) {
    const headers = useRequestHeaders(["cookie"]);
    return await $fetch("http://localhost:3001/users/check-cookie", {
      headers: {
        cookie: headers.cookie || "",
      },
    });
  } else {
    return await $fetch("http://localhost:3001/users/check-cookie", {
      credentials: "include",
    });
  }
};
