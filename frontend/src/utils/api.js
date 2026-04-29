import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('hrms_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  r => r.data,
  e => Promise.reject(new Error(e.response?.data?.message || e.message || 'Request failed'))
);

export const crudOf = (endpoint) => ({
  list: (params = {}) => api.get(`/${endpoint}`, { params }),
  get: (id) => api.get(`/${endpoint}/${id}`),
  create: (data) => api.post(`/${endpoint}`, data),
  update: (id, data) => api.put(`/${endpoint}/${id}`, data),
  remove: (id) => api.delete(`/${endpoint}/${id}`),
  toggle: (id) => api.patch(`/${endpoint}/${id}/toggle-status`),
});

export default api;
