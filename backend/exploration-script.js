require('dotenv').config();
const axios = require('axios');

const BASE_URL = process.env.BACKEND_URL;

async function inspectAPIsPAGES() {
  console.log("🔍 Iniciando peticiones de exploración...\n");

  if (!BASE_URL) {
    console.error("❌ Error: No se encontró BACKEND_URL en tu archivo .env");
    return;
  }

  try {
    // 1. Petición a AutoPartsPlus
    const urlAuto = `${BASE_URL}/api/autopartsplus/catalog?page=1&limit=1`;
    const resAuto = await axios.get(urlAuto);
    console.log("=== 📦 JSON AutoPartsPlus ===");
    console.log(JSON.stringify(resAuto.data, null, 2));
    console.log("\n-------------------------------------------------\n");

    // 2. Petición a RepuestosMax
    const urlRepuestos = `${BASE_URL}/api/repuestosmax/catalogo?pagina=1&limite=1`;
    const resRepuestos = await axios.get(urlRepuestos);
    console.log("=== 📦 JSON RepuestosMax ===");
    console.log(JSON.stringify(resRepuestos.data, null, 2));
    console.log("\n-------------------------------------------------\n");

    // 3. Petición a GlobalParts
    const urlGlobal = `${BASE_URL}/api/globalparts/inventory/catalog?page=1&itemsPerPage=1`;
    const resGlobal = await axios.get(urlGlobal);
    console.log("=== 📦 JSON GlobalParts ===");
    console.log(JSON.stringify(resGlobal.data, null, 2));
    console.log("\n✅ Exploración finalizada.");

  } catch (error) {
    console.error("❌ Ocurrió un error al hacer las peticiones:");
    // Si la API devuelve un error (ej. 404 o 500), imprimimos el detalle
    if (error.response) {
      console.error(`Estado: ${error.response.status}`);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

async function inspectAPIsSKUs() {
  console.log("🔍 Iniciando peticiones de exploración...\n");

  if (!BASE_URL) {
    console.error("❌ Error: No se encontró BACKEND_URL en tu archivo .env");
    return;
  }

  try {
    // 1. Petición a AutoPartsPlus
    const urlAuto = `${BASE_URL}/api/autopartsplus/parts?sku=CL-MOC6KMQW`;
    const resAuto = await axios.get(urlAuto);
    console.log("=== 📦 JSON AutoPartsPlus ===");
    console.log(JSON.stringify(resAuto.data, null, 2));
    console.log("\n-------------------------------------------------\n");

    // 2. Petición a RepuestosMax
    const urlRepuestos = `${BASE_URL}/api/repuestosmax/productos?codigo=EL-MOC6KN4H`;
    const resRepuestos = await axios.get(urlRepuestos);
    console.log("=== 📦 JSON RepuestosMax ===");
    console.log(JSON.stringify(resRepuestos.data, null, 2));
    console.log("\n-------------------------------------------------\n");

    // 3. Petición a GlobalParts
    const urlGlobal = `${BASE_URL}/api/globalparts/inventory/search?partNumber=ES-MOC6KMNZ`;
    const resGlobal = await axios.get(urlGlobal);
    console.log("=== 📦 JSON GlobalParts ===");
    console.log(JSON.stringify(resGlobal.data, null, 2));
    console.log("\n✅ Exploración finalizada.");

  } catch (error) {
    console.error("❌ Ocurrió un error al hacer las peticiones:");
    // Si la API devuelve un error (ej. 404 o 500), imprimimos el detalle
    if (error.response) {
      console.error(`Estado: ${error.response.status}`);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}


// inspectAPIsPAGES();
inspectAPIsSKUs();