import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3003',
  headers: {
    'Content-Type': 'application/json'
  }
});

const consultationService = {
  get: async ({ pageNumber = 1, pageSize = 15, status }) => {
    const params = new URLSearchParams();
    
    params.append('pageNumber', pageNumber);
    params.append('pageSize', pageSize);

    if (status) params.append('status', status);

    return await api.get('/api/consultation', { params });
  },

  getById: async (id) => {
    return await api.get(`/api/consultation/${id}`);
  },

  create: async (consultation) => {
    return await api.post('/api/consultation', consultation);
  },

  update: async (id, consultation) => {
    return await api.put(`/api/consultation/${id}`, consultation);
  },

  delete: async (id) => {
    return await api.delete(`/api/consultation/${id}`);
  },

  carried: async (id) => {
    return await api.put(`/api/consultation/${id}/carried`);
  },

  cancel: async (id) => {
    return await api.put(`/api/consultation/${id}/canceled`);
  },

  reschedule: async (id) => {
    return await api.put(`/api/consultation/${id}/scheduled`);
  }
};

export default consultationService;