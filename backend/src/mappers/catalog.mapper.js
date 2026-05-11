const normalizeArray = (arr) => (Array.isArray(arr) ? arr : []);

const parseAutoPartsVehicle = (vehicleStr) => {
  if (!vehicleStr) return null;
  const regex = /^([a-zA-Z\-]+)\s+(.+?)\s+(\d{4})-(\d{4})/;
  const match = vehicleStr.match(regex);
  
  if (match) {
    return { 
      make: match[1].trim(), 
      model: match[2].trim(), 
      yearStart: Number(match[3]), 
      yearEnd: Number(match[4]) 
    };
  }
  return { make: "Varios", model: vehicleStr, yearStart: null, yearEnd: null };
};

const extractProductBase = (sku, name, brand, vehiclesArray, image) => ({
  sku,
  name: name || 'Repuesto sin nombre',
  brand: brand || 'Genérico',
  image: image || 'https://via.placeholder.com/300x200?text=Sin+Imagen',
  compatibleVehicles: vehiclesArray.filter(v => v !== null),
  searchString: `${sku} ${name} ${brand} ${vehiclesArray.map(v => v ? v.make + ' ' + v.model : '').join(' ')}`.toLowerCase()
});

const extractOffer = (provider, price, stock, warehouse) => ({
  provider,
  price: Number(price) || 0,
  stock: Number(stock) || 0,
  warehouse: warehouse || 'General'
});

const mapAutoPartsPlus = (item) => {
  const vehicles = normalizeArray(item.fits_vehicles).map(parseAutoPartsVehicle);
  const image = item.img_urls?.[0] || null; 
  const base = extractProductBase(item.sku, item.title, item.brand_name, vehicles, image);
  const offer = extractOffer('AutoPartsPlus', item.unit_price, item.qty_available, item.warehouse_location);
  return { base, offer };
};

const mapRepuestosMax = (item) => {
  const vehicles = normalizeArray(item.compatibilidad?.vehiculos).map(v => ({
    make: v.fabricante || 'Varios',
    model: v.modelo || 'Varios',
    yearStart: Number(v.anios?.desde) || null,
    yearEnd: Number(v.anios?.hasta) || null
  }));
  const image = item.multimedia?.imagenes?.[0]?.url || null;
  const base = extractProductBase(item.identificacion?.sku, item.informacionBasica?.nombre, item.informacionBasica?.marca?.nombre, vehicles, image);
  const offer = extractOffer('RepuestosMax', item.precio?.valor, item.inventario?.cantidad, item.inventario?.ubicacion?.bodega);
  return { base, offer };
};

const mapGlobalParts = (item) => {
  const vehicles = normalizeArray(item.ProductDetails?.VehicleCompatibility?.CompatibleVehicles).map(v => ({
    make: v.Manufacturer?.Name || 'Varios',
    model: v.Model?.Name || 'Varios',
    yearStart: Number(v.YearRange?.StartYear) || null,
    yearEnd: Number(v.YearRange?.EndYear) || null
  }));
  const image = item.ProductDetails?.MediaAssets?.Images?.[0]?.ImageUrl || null;
  const base = extractProductBase(item.ItemHeader?.ExternalReferences?.SKU?.Value, item.ProductDetails?.NameInfo?.DisplayName, item.ProductDetails?.BrandInfo?.BrandName, vehicles, image);
  const offer = extractOffer('GlobalParts', item.ProductDetails?.PricingInfo?.ListPrice?.Amount, item.ProductDetails?.AvailabilityInfo?.QuantityInfo?.AvailableQuantity, item.ProductDetails?.AvailabilityInfo?.WarehouseInfo?.PrimaryWarehouse?.Name);
  return { base, offer };
};

module.exports = { mapAutoPartsPlus, mapRepuestosMax, mapGlobalParts };