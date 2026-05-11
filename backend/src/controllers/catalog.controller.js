const syncService = require('../services/sync.service');
const catalogService = require('../services/catalog.service');
const { mapAutoPartsPlus, mapRepuestosMax, mapGlobalParts } = require('../mappers/catalog.mapper');

const getUnifiedCatalog = (req, res) => {
  try {
    const { search = '', brand = '', carMake = '', model = '', year = '', page = 1, limit = 20 } = req.query;
    let catalog = syncService.getCachedCatalog();

    if (search) {
      const termino = search.toLowerCase();
      catalog = catalog.filter(item => item.searchString.includes(termino));
    }

    if (brand) {
      catalog = catalog.filter(item => item.brand.toLowerCase() === brand.toLowerCase());
    }

    if (carMake) {
      catalog = catalog.filter(item => 
        item.compatibleVehicles.some(v => v.make.toLowerCase().includes(carMake.toLowerCase()))
      );
    }

    if (model) {
      catalog = catalog.filter(item => 
        item.compatibleVehicles.some(v => v.model.toLowerCase().includes(model.toLowerCase()))
      );
    }

    if (year) {
      const yearStr = String(year);
      catalog = catalog.filter(item => 
        item.compatibleVehicles.some(v => {
          if (!v.yearStart || !v.yearEnd) return false;
          
          for (let y = v.yearStart; y <= v.yearEnd; y++) {
            if (String(y).startsWith(yearStr)) return true;
          }
          return false;
        })
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + Number(limit);
    const paginatedItems = catalog.slice(startIndex, endIndex);

    res.json({
      totalItems: catalog.length,
      totalPages: Math.ceil(catalog.length / limit),
      currentPage: Number(page),
      data: paginatedItems
    });

  } catch (error) {
    console.error("Error en el controlador del catálogo:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

const getProductBySku = async (req, res) => {
  try {
    const { sku } = req.params;

    if (!sku) {
      return res.status(400).json({ message: "Se requiere un SKU válido" });
    }

    const catalog = syncService.getCachedCatalog();
    let product = catalog.find(item => item.sku === sku);

    if (!product) {
      console.log(`SKU ${sku} no está en caché. Buscando en proveedores en vivo...`);
      
      const [autoRes, repMaxRes, globalRes] = await Promise.allSettled([
        catalogService.fetchAutoPartsBySku(sku),
        catalogService.fetchRepuestosMaxBySku(sku),
        catalogService.fetchGlobalPartsBySku(sku)
      ]);

      let liveProduct = null;

      const processLiveResponse = (res, mapperFn) => {
        if (res.status === 'fulfilled' && res.value.length > 0) {
          const { base, offer } = mapperFn(res.value[0]);
          if (!liveProduct) {
            liveProduct = { ...base, totalStock: offer.stock, offers: [offer] };
          } else {
            liveProduct.offers.push(offer);
            liveProduct.totalStock += offer.stock;
          }
        }
      };

      processLiveResponse(autoRes, mapAutoPartsPlus);
      processLiveResponse(repMaxRes, mapRepuestosMax);
      processLiveResponse(globalRes, mapGlobalParts);

      product = liveProduct;
    }

    if (!product) {
      return res.status(404).json({ message: "Repuesto no encontrado en ninguna bodega" });
    }

    res.json(product);

  } catch (error) {
    console.error(`Error buscando SKU ${req.params.sku}:`, error);
    res.status(500).json({ message: "Error interno al buscar el repuesto" });
  }
};

module.exports = { 
  getUnifiedCatalog,
  getProductBySku
};