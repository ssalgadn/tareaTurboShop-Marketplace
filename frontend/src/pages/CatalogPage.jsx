import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Navbar from '../components/Navbar';
import FilterPanel from '../components/FilterPanel';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import ProductModal from '../components/ProductModal';

const fetchProducts = async ({ queryKey }) => {
  const [, filters] = queryKey;
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  console.log("🔥 Vite está leyendo esta URL:", API_URL);
  const response = await axios.get(`${API_URL}/api/catalog`, { params: filters });
  return response.data; 
};

export default function CatalogPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    search: '', brand: '', carMake: '', model: '', year: '', page: 1, limit: 12
  });

  const [selectedSku, setSelectedSku] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['catalog', filters], 
    queryFn: fetchProducts,
    refetchInterval: 30000, 
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

  const currentProducts = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div>
      <Navbar />
      
      <div style={{ backgroundColor: 'white', padding: '0.5rem 2rem', borderBottom: '1px solid #e5e7eb' }}>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className='filter-toggle-btn'
        >
          {isFilterOpen ? 'Ocultar Filtros ▲' : 'Buscar y Filtrar ▼'}
        </button>
      </div>

      <FilterPanel isOpen={isFilterOpen} filters={filters} setFilters={setFilters} />

      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', margin: '3rem 0', color: '#6b7280' }}>Cargando catálogo en vivo...</div>
        ) : isError ? (
          <div style={{ textAlign: 'center', margin: '3rem 0', color: '#ef4444' }}>Error al conectar con el servidor.</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
              {currentProducts.length > 0 ? (
                currentProducts.map(product => (
                  <ProductCard key={product.sku} product={product} onOpenDetails={setSelectedSku} />
                ))
              ) : (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666', padding: '3rem 0' }}>
                  No se encontraron repuestos con esos criterios.
                </p>
              )}
            </div>

            <Pagination 
              currentPage={filters.page} 
              totalPages={totalPages} 
              setCurrentPage={handlePageChange} 
            />
          </>
        )}
      </main>

      <ProductModal sku={selectedSku} onClose={() => setSelectedSku(null)} />

    </div>
  );
}