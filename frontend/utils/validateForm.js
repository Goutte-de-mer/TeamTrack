/**
 * Vérifie que tous les champs d'un objet sont remplis (non vides)
 * @param {Object} formData - L'objet contenant les données du formulaire
 * @returns {Boolean} - True si tous les champs sont remplis, false sinon
 */
export const validateAllFields = (formData) => {
  return !Object.values(formData).some((value) => value === "");
};
