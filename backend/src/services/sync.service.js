const NodeCache = require("node-cache");
const catalogService = require("./catalog.service");
const { mapAutoPartsPlus, mapRepuestosMax, mapGlobalParts } = require("../mappers/catalog.mapper");

const myCache = new NodeCache({ stdTTL: 0, checkperiod: 0 }); 

const unificarCatalogos = (currentCache, newItems, mapperFn) => {
  const mapTemporal = currentCache ? new Map(currentCache) : new Map();

  newItems.forEach(item => {
    const { base, offer } = mapperFn(item);
    if (!base.sku) return;

    if (mapTemporal.has(base.sku)) {
      const productoExistente = mapTemporal.get(base.sku);
      productoExistente.offers = productoExistente.offers.filter(o => o.provider !== offer.provider);
      productoExistente.offers.push(offer);
      productoExistente.totalStock = productoExistente.offers.reduce((acc, curr) => acc + curr.stock, 0);
      mapTemporal.set(base.sku, productoExistente);
    } else {
      mapTemporal.set(base.sku, {
        ...base,
        totalStock: offer.stock,
        offers: [offer]
      });
    }
  });

  return mapTemporal;
};

const runBackgroundSync = async () => {
  console.log("🔄 Sincronizando catálogos en segundo plano...");
  
  let currentCatalogMap = myCache.get("unified_catalog") || new Map();

  const [autoRes, repMaxRes, globalRes] = await Promise.allSettled([
    catalogService.fetchAutoParts(1),
    catalogService.fetchRepuestosMax(1),
    catalogService.fetchGlobalParts(1)
  ]);

  if (autoRes.status === 'fulfilled') {
    currentCatalogMap = unificarCatalogos(currentCatalogMap, autoRes.value, mapAutoPartsPlus);
  } else {
    console.error("⚠️ Falló AutoPartsPlus. Manteniendo stock antiguo de este proveedor.");
  }

  if (repMaxRes.status === 'fulfilled') {
    currentCatalogMap = unificarCatalogos(currentCatalogMap, repMaxRes.value, mapRepuestosMax);
  }

  if (globalRes.status === 'fulfilled') {
    currentCatalogMap = unificarCatalogos(currentCatalogMap, globalRes.value, mapGlobalParts);
  }

  // Guardamos el mapa unificado en la memoria RAM
  myCache.set("unified_catalog", currentCatalogMap);
  console.log(`✅ Sincronización exitosa. Total SKU únicos: ${currentCatalogMap.size}`);
};

// Iniciar el ciclo de sincronización (Ej: cada 30 segundos)
const startPolling = () => {
  runBackgroundSync(); // Primera carga inmediata
  setInterval(runBackgroundSync, 30000); // Luego cada 30 segundos
};

const getCachedCatalog = () => {
  const mapa = myCache.get("unified_catalog");
  return mapa ? Array.from(mapa.values()) : [];
};

module.exports = { startPolling, getCachedCatalog };