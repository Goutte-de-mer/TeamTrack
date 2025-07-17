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
