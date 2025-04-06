import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json'
  }
});

const clientService = {
  get: async ({ pageNumber = 1, pageSize = 15, name, email }) => {
    const params = new URLSearchParams();

    params.append('pageNumber', pageNumber);
    params.append('pageSize', pageSize);

    if (name) params.append('name', name);
    if (email) params.append('email', email);

    return await api.get('/api/client', { params });
  },

  getById: async (id) => {
    return await api.get(`/api/client/${id}`);
  },

  create: async (client) => {
    return await api.post('/api/client', client);
  },

  update: async (id, client) => {
    return await api.put(`/api/client/${id}`, client);
  },

  delete: async (id) => {
    return await api.delete(`/api/client/${id}`);
  }
};

export default clientService;
