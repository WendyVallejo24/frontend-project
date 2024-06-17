import axios from 'axios';

axios.interceptors.request.use(config => {
  // Agregar encabezados u otras configuraciones necesarias
  return config;
}, error => {
  return Promise.reject(error);
});

export default axios;
