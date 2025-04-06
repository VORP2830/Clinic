import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3002',
  headers: {
    'Content-Type': 'application/json'
  }
});

const professionalService = {
    get: async ({ pageNumber = 1, pageSize = 15, name, email, phone, specialty }) => {
        const params = new URLSearchParams();
      
        params.append('pageNumber', pageNumber);
        params.append('pageSize', pageSize);
      
        if (name) params.append('name', name);
        if (email) params.append('email', email);
        if (phone) params.append('phone', phone);
        if (specialty) params.append('specialty', specialty);
      
        return await api.get('/api/professional', { params });
    },
      

  getById: async (id) => {
    return await api.get(`/api/professional/${id}`);
  },

  create: async (professional) => {
    return await api.post('/api/professional', professional);
  },

  update: async (id, professional) => {
    return await api.put(`/api/professional/${id}`, professional);
  },

  delete: async (id) => {
    return await api.delete(`/api/professional/${id}`);
  }
};

export default professionalService;
