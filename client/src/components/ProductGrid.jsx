import { useState, useMemo } from 'react';
import { useAppContext } from '../App';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const { products } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ['All', ...cats.sort()];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <section className="pt-4">
      {/* heading */}
      <div className="mb-6">
        <h1 className="font-heading text-3xl sm:text-4xl text-ink mb-1">Our Collection</h1>
        <p className="text-ink-light text-sm">Vintage Lego Sets, Rare and Hard to Find!</p>
      </div>

      {/* filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-card text-xs font-medium transition-colors duration-150 ${
                activeCategory === cat
                  ? 'bg-ink text-white'
                  : 'bg-bg-alt text-ink-light hover:text-ink border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative sm:ml-auto">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field !pl-9 !py-2 sm:w-56 text-sm"
            aria-label="Search products"
          />
        </div>
      </div>

      {/* grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-ink-light mb-3">No products match your search.</p>
          <button
            onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
            className="btn-secondary text-xs"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
