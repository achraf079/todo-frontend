const API_BASE_URL = 'http://localhost:3000';

export const api = {
  // Récupérer toutes les tâches
  getTasks: async (filter = '') => {
    const url = filter ? `${API_BASE_URL}/tasks?status=${filter}` : `${API_BASE_URL}/tasks`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erreur lors du chargement');
    return response.json();
  },

  // Créer une tâche
  createTask: async (task) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Erreur lors de la création');
    return response.json();
  },

  // Modifier une tâche
  updateTask: async (id, task) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Erreur lors de la modification');
    return response.json();
  },

  // Supprimer une tâche
  deleteTask: async (id) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erreur lors de la suppression');
    return true;
  }
};