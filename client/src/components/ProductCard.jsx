import { useState } from 'react';
import { useAppContext } from '../App';

export default function ProductCard({ product }) {
  const { handleAddToCart } = useAppContext();
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  const outOfStock = product.stock <= 0;

  const onAdd = async () => {
    if (outOfStock) return;
    setAdding(true);
    await handleAddToCart(product._id);
    setTimeout(() => setAdding(false), 400);
  };

  return (
    <div className={`card-interactive overflow-hidden flex flex-col anim-up ${outOfStock ? 'opacity-80' : ''}`}>
      {/* image */}
      <div className="relative overflow-hidden bg-bg-alt aspect-[4/3]">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center text-ink-faint text-3xl">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-300 ${outOfStock ? 'grayscale' : 'hover:scale-105'}`}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              Sold Out
            </span>
          </div>
        )}

        {!outOfStock && product.stock <= 3 && (
          <div className="absolute top-2 right-2">
            <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
              Only {product.stock} left!
            </span>
          </div>
        )}
      </div>

      {/* info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-medium text-ink text-sm leading-snug line-clamp-1">
            {product.name}
          </h3>
          <span className="badge bg-bg-alt text-ink-light border border-border flex-shrink-0">
            {product.category}
          </span>
        </div>

        <p className="text-ink-faint text-xs leading-relaxed mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <div>
            <span className="text-lg font-semibold text-ink">${product.price.toFixed(2)}</span>
            {!outOfStock && (
              <span className={`text-xs ml-1.5 ${product.stock <= 5 ? 'text-yellow-600 font-medium' : 'text-ink-faint'}`}>
                {product.stock} left
              </span>
            )}
          </div>

          <button
            onClick={onAdd}
            disabled={outOfStock || adding}
            className={`!px-3 !py-1.5 text-xs flex items-center gap-1.5 font-medium rounded-card transition-all duration-200 active:scale-[0.97] ${
              outOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
            aria-label={outOfStock ? `${product.name} is sold out` : `Add ${product.name} to cart`}
          >
            {adding ? (
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : outOfStock ? (
              'Sold Out'
            ) : (
              'Add to cart'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
