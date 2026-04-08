import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import * as api from './services/api';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import AdminLogin from './components/AdminLogin';
import Toast from './components/Toast';

const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export default function App() {
  const [view, setView] = useState('products');
  const [cartOpen, setCartOpen] = useState(false);

  // Admin auth state
  const [adminAuth, setAdminAuth] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const data = await api.fetchProducts();
      setProducts(data);
    } catch {
      setError('Could not load products. Please check that the server is running.');
      addToast('Failed to load products', 'error');
    }
  }, [addToast]);

  const loadCart = useCallback(async () => {
    try {
      const data = await api.fetchCart();
      setCart(data);
    } catch {
      addToast('Failed to load cart', 'error');
    }
  }, [addToast]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadProducts(), loadCart()]);
      setLoading(false);
    };
    init();
  }, [loadProducts, loadCart]);

  // Switch to admin — require login first
  const goToAdmin = () => {
    if (adminAuth) {
      setView('admin');
    } else {
      setShowLogin(true);
    }
  };

  const onLoginSuccess = () => {
    setAdminAuth(true);
    setShowLogin(false);
    setView('admin');
    addToast('Logged in as admin');
  };

  const onLogout = () => {
    setAdminAuth(false);
    setView('products');
    addToast('Logged out');
  };

  const handleAddToCart = async (productId) => {
    try {
      await api.addToCart(productId, 1);
      await loadCart();
      addToast('Added to cart');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add to cart', 'error');
    }
  };

  const handleUpdateCartQty = async (cartItemId, quantity) => {
    try {
      await api.updateCartItem(cartItemId, quantity);
      await loadCart();
    } catch {
      addToast('Failed to update quantity', 'error');
    }
  };

  const handleRemoveCartItem = async (cartItemId) => {
    try {
      await api.removeCartItem(cartItemId);
      await loadCart();
      addToast('Removed from cart');
    } catch {
      addToast('Failed to remove item', 'error');
    }
  };

  const handleCheckout = async () => {
    try {
      await api.checkout();
      await Promise.all([loadCart(), loadProducts()]);
      setCartOpen(false);
      addToast('Order placed successfully!');
      return true;
    } catch (err) {
      addToast(err.response?.data?.message || 'Checkout failed', 'error');
      return false;
    }
  };

  const handleCreateProduct = async (data) => {
    const result = await api.createProduct(data);
    await loadProducts();
    addToast('Product created');
    return result;
  };

  const handleUpdateProduct = async (id, data) => {
    const result = await api.updateProduct(id, data);
    await loadProducts();
    addToast('Product updated');
    return result;
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.deleteProduct(id);
      await loadProducts();
      addToast('Product deleted');
    } catch {
      addToast('Failed to delete product', 'error');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const ctx = {
    products, cart, cartCount, loading, error,
    view, setView: (v) => (v === 'admin' ? goToAdmin() : setView(v)),
    cartOpen, setCartOpen,
    adminAuth, onLogout,
    handleAddToCart, handleUpdateCartQty, handleRemoveCartItem, handleCheckout,
    handleCreateProduct, handleUpdateProduct, handleDeleteProduct,
    addToast,
  };

  return (
    <AppContext.Provider value={ctx}>
      <div
        className="min-h-screen text-ink"
        style={{
          backgroundImage: `url('/images/Minifigure%20Heads%20-%20Pile%20-%20Desktop%20widescreeen.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16">
          {loading ? (
            <LoadingSkeleton />
          ) : error ? (
            <ErrorState message={error} />
          ) : view === 'products' ? (
            <ProductGrid />
          ) : (
            <AdminPanel />
          )}
        </main>

        <CartDrawer />
        {showLogin && <AdminLogin onClose={() => setShowLogin(false)} onSuccess={onLoginSuccess} />}
        <Toast toasts={toasts} />
      </div>
    </AppContext.Provider>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 pt-8">
      <div className="h-8 w-48 bg-bg-alt rounded animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-0 overflow-hidden">
            <div className="bg-bg-alt h-52 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-bg-alt rounded animate-pulse" />
              <div className="h-3 w-full bg-bg-alt rounded animate-pulse" />
              <div className="h-4 w-1/3 bg-bg-alt rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-danger-light flex items-center justify-center mb-5">
        <svg className="w-7 h-7 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="font-heading text-2xl text-ink mb-2">Something went wrong</h2>
      <p className="text-ink-light max-w-sm mb-6">{message}</p>
      <button onClick={() => window.location.reload()} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
