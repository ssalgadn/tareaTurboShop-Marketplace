export default function FilterPanel({ isOpen, filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  return (
    <div style={{
      maxHeight: isOpen ? '500px' : '0px',
      opacity: isOpen ? 1 : 0,
      overflow: 'hidden',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: '#ffffff',
      borderBottom: isOpen ? '1px solid #f3f4f6' : 'none',
      boxShadow: isOpen ? 'inset 0 -4px 6px -4px rgba(0,0,0,0.05)' : 'none'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gridColumn: '1 / -1' }}>
          <label className="modern-label">Búsqueda inteligente</label>
          <input 
            type="text" name="search" value={filters.search} onChange={handleChange}
            placeholder="Ej: Silenciador, Filtro o código SKU..." 
            className="modern-input"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label className="modern-label">Fabricante</label>
          <input 
            type="text" name="brand" value={filters.brand} onChange={handleChange}
            placeholder="Ej: Bosch, KYB..." 
            className="modern-input"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label className="modern-label">Marca del Auto</label>
          <input 
            type="text" name="carMake" value={filters.carMake} onChange={handleChange}
            placeholder="Ej: Lexus, Subaru..." 
            className="modern-input"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label className="modern-label">Modelo del Auto</label>
          <input 
            type="text" name="model" value={filters.model} onChange={handleChange}
            placeholder="Ej: Forester, X5..." 
            className="modern-input"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label className="modern-label">Año</label>
          <input 
            type="number" name="year" value={filters.year} onChange={handleChange}
            placeholder="Ej: 201 o 2015" 
            className="modern-input"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label className="modern-label">Mostrar</label>
          <select 
            name="limit" value={filters.limit} onChange={handleChange}
            className="modern-input"
            style={{ cursor: 'pointer' }}
          >
            <option value="4">4 productos por página</option>
            <option value="12">12 productos por página</option>
            <option value="20">20 productos por página</option>
          </select>
        </div>

      </div>
    </div>
  );
}