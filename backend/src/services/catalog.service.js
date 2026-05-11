const axios = require('axios');

const BASE_URL = process.env.API_URL;

const fetchAutoParts = async (page = 1) => {
  const response = await axios.get(`${BASE_URL}/api/autopartsplus/catalog?page=${page}&limit=20`);
  return response.data.parts || []; 
};

const fetchRepuestosMax = async (page = 1) => {
  const response = await axios.get(`${BASE_URL}/api/repuestosmax/catalogo?pagina=${page}&limite=20`);
  return response.data.productos || [];
};

const fetchGlobalParts = async (page = 1) => {
  const response = await axios.get(`${BASE_URL}/api/globalparts/inventory/catalog?page=${page}&itemsPerPage=20`);
  return response.data.ResponseEnvelope?.Body?.CatalogListing?.Items || [];
};

const fetchAutoPartsBySku = async (sku) => {
  const response = await axios.get(`${BASE_URL}/api/autopartsplus/parts?sku=${sku}`);
  // El envoltorio se mantuvo igual
  return response.data.parts || []; 
};

const fetchRepuestosMaxBySku = async (sku) => {
  const response = await axios.get(`${BASE_URL}/api/repuestosmax/productos?codigo=${sku}`);
  // Aquí está el cambio: entramos primero a "resultado"
  return response.data.resultado?.productos || [];
};

const fetchGlobalPartsBySku = async (sku) => {
  const response = await axios.get(`${BASE_URL}/api/globalparts/inventory/search?partNumber=${sku}`);
  // Aquí está el cambio: entramos a "SearchResults" en lugar de "CatalogListing"
  return response.data.ResponseEnvelope?.Body?.SearchResults?.Items || [];
};

module.exports = {
  fetchAutoParts,
  fetchRepuestosMax,
  fetchGlobalParts,
  fetchAutoPartsBySku,
  fetchRepuestosMaxBySku,
  fetchGlobalPartsBySku
};