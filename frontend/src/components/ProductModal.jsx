import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchProductDetail = async ({ queryKey }) => {
  const [, sku] = queryKey;
  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const response = await axios.get(`${API_URL}/api/catalog/${sku}`);
  return response.data;
};

export default function ProductModal({ sku, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', sku],
    queryFn: fetchProductDetail,
    enabled: !!sku, 
    staleTime: 60000,
    refetchInterval: 30000,
  });

  useEffect(() => {
    if (sku) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsClosing(false);
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sku]);

  if (!sku) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 200);
  };

  return (
    <div 
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
    >
      <div 
        className={`modal-content ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={handleClose}
          style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.8rem', cursor: 'pointer', color: '#6b7280', transition: 'color 0.2s' }}
          onMouseOver={(e) => e.target.style.color = '#1f2937'}
          onMouseOut={(e) => e.target.style.color = '#6b7280'}
        >
          ✖
        </button>

        {isLoading || !product ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>Cargando información consolidada...</div>
        ) : isError ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'red' }}>Error al cargar los detalles.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Cabecera */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'center' }}>
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={product.image} 
                  alt={product.name || 'Repuesto'} 
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    const fallbackText = encodeURIComponent(product.name || 'Repuesto');
                    e.currentTarget.src = `https://placehold.co/400x300/f3f4f6/6b21a8?text=${fallbackText}`;
                  }}
                />
              </div>
              <div>
                <span style={{ color: '#6b7280', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '0.05em' }}>
                  {product.brand} | SKU: {product.sku}
                </span>
                <h2 style={{ margin: '0.5rem 0', color: '#1f2937', fontSize: '1.8rem' }}>{product.name}</h2>
                <span style={{ 
                  display: 'inline-block', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 'bold',
                  backgroundColor: product.totalStock > 0 ? '#dcfce7' : '#fee2e2', color: product.totalStock > 0 ? '#166534' : '#991b1b' 
                }}>
                  Stock Total Consolidado: {product.totalStock || 0} unidades
                </span>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              
              <div>
                <h3 style={{ color: '#374151', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Ofertas Disponibles
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {(product.offers || []).map((offer, index) => (
                    <div key={index} style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#f9fafb'
                    }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{offer.provider}</span>
                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                          Bodega: {offer.warehouse} • Stock: {offer.stock}
                        </span>
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-purple)' }}>
                        ${(offer.price || 0).toLocaleString('es-CL')}
                      </div>
                    </div>
                  ))}
                  {(!product.offers || product.offers.length === 0) && (
                    <p style={{ color: '#6b7280' }}>No hay ofertas disponibles en este momento.</p>
                  )}
                </div>
              </div>
              
              {/* Vehículos Compatibles */}
              <div>
                <h3 style={{ color: '#374151', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  Vehículos Compatibles
                </h3>
                <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  <ul style={{ paddingLeft: '1.2rem', color: '#4b5563', fontSize: '0.95rem', margin: 0 }}>
                    {(product.compatibleVehicles || []).map((v, index) => (
                      <li key={index} style={{ marginBottom: '0.5rem' }}>
                        <strong>{v.make}</strong> {v.model} ({v.yearStart} - {v.yearEnd})
                      </li>
                    ))}
                    {(!product.compatibleVehicles || product.compatibleVehicles.length === 0) && (
                      <li style={{ listStyle: 'none', marginLeft: '-1.2rem' }}>Información de compatibilidad no disponible.</li>
                    )}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}