'use strict';

module.exports = {
  process() {
    return 'module.exports = {};'; // Devuelve un objeto vacío como resultado de la transformación
  },
  getCacheKey() {
    // Genera una clave de caché única para este transformador
    return 'cssTransform'; 
  },
};
