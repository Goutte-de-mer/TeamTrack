const BASE_URL = "http://localhost:3001";

export async function loginUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { success: false, message: "Email ou mot de passe incorrect" };
      }
      return { success: false, message: "Erreur de connexion" };
    }
    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    console.error("Erreur connexion : ", error);
    throw error;
  }
}

export async function registerUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      return { success: false, message: "Erreur lors de l'inscription" };
    }
    const data = await response.json();

    return { success: true, data };
  } catch (error) {
    console.error("Erreur inscription : ", error);
    throw error;
  }
}

export async function getProjects() {
  const response = await fetch(`${BASE_URL}/projects/all`, {
    credentials: "include",
  });
  return response;
}

export async function logoutUser() {
  const response = await fetch("/api/users/logout", {
    method: "POST",
    credentials: "include",
  });

  return response;
}

export async function getProjectById(projectId) {
  const response = await fetch(`/api/projects/${projectId}`, {
    credentials: "include",
  });
  return response;
}

export async function createProject(formData) {
  const response = await fetch("/api/projects/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });
  return response;
}

export async function createTask(formData) {
  const response = await fetch("/api/tasks/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(formData),
  });
  return response;
}

export async function updateTaskStatus(data) {
  const response = await fetch("/api/tasks/update/status", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return response;
}

export async function getUsers() {
  const response = await fetch("/api/users", {
    credentials: "include",
  });
  return response;
}

export async function updateProjectInfos(data) {
  const response = await fetch("/api/projects/update", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return response;
}
