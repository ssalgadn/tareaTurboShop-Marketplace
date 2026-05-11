export default function ProductCard({ product, onOpenDetails }) {
  const precioMasBajo = Math.min(...product.offers.map(o => o.price));

  return (
    <div 
      className="product-card" 
      onClick={() => onOpenDetails(product.sku)}
      style={{ cursor: 'pointer' }}
    >
      
      <div style={{ height: '180px', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb', marginBottom: '0.5rem' }}>
        <img 
          src={product.image} 
          alt={`Imagen de ${product.name}`} 
          style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          onError={(e) => { 
            e.currentTarget.onerror = null; 
            const textoImagen = encodeURIComponent(product.name || 'Repuesto');
            e.currentTarget.src = `https://placehold.co/400x300/f3f4f6/6b21a8?text=${textoImagen}`;
          }} 
        />
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {product.category || 'Repuesto'}
        </span>
        
        <h3 style={{ 
          margin: '0', 
          fontSize: '1.15rem', 
          color: '#1f2937',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.8rem'
        }}>
          {product.name}
        </h3>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
        <span style={{ color: '#4b5563', fontSize: '0.9rem', fontWeight: '600' }}>{product.brand}</span>
        
        <span style={{ 
          fontSize: '0.8rem', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontWeight: 'bold',
          backgroundColor: product.totalStock > 0 ? '#dcfce7' : '#fee2e2', 
          color: product.totalStock > 0 ? '#166534' : '#991b1b' 
        }}>
          {product.totalStock > 0 ? `${product.totalStock} en stock` : 'Agotado'}
        </span>
      </div>

      <p style={{ fontWeight: '800', fontSize: '1.3rem', margin: '0.5rem 0 0 0', color: 'var(--primary-purple)' }}>
        Desde ${precioMasBajo.toLocaleString('es-CL')}
      </p>
      
      <small style={{ color: '#6b7280', fontSize: '0.85rem' }}>
        Disponible en {product.offers.length} tienda(s)
      </small>

      <button 
        className="modern-details-btn"
        onClick={() => onOpenDetails(product.sku)}
      >
        Ver Detalles
      </button>
    </div>
  );
}