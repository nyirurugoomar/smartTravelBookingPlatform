const API_BASE_URL = 'https://smarttravelbookingplatform-backend.onrender.com/api';


export const fetchFromApi = async (endpoint) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch from ${endpoint}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${endpoint}:`, error);
    throw error;
  }
};


export const createApi = (resource) => ({
  getAll: () => fetchFromApi(`/${resource}`),
  getById: (id) => fetchFromApi(`/${resource}/${id}`),
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/${resource}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to create ${resource}`);
    return response.json();
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/${resource}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Failed to update ${resource}`);
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/${resource}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Failed to delete ${resource}`);
    return response.json();
  },
}); 