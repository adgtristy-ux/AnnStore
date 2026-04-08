import { useAppContext } from '../App';
import logo from '../assets/images/annz-bricks-logo.png';

export default function Navbar() {
  const { view, setView, cartCount, setCartOpen, adminAuth, onLogout } = useAppContext();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* logo */}
          <button
            onClick={() => setView('products')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="Annz Bricks" className="w-8 h-8 rounded-md object-cover" />
            <span className="font-heading text-xl text-ink tracking-tight">Annz Bricks</span>
          </button>

          {/* right side */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setView('products')}
              className={`px-3 py-1.5 rounded-card text-sm transition-colors duration-150 ${
                view === 'products'
                  ? 'bg-bg-alt text-ink font-medium'
                  : 'text-ink-light hover:text-ink hover:bg-bg-alt/60'
              }`}
            >
              Shop
            </button>

            <button
              onClick={() => setView('admin')}
              className={`px-3 py-1.5 rounded-card text-sm transition-colors duration-150 ${
                view === 'admin'
                  ? 'bg-bg-alt text-ink font-medium'
                  : 'text-ink-light hover:text-ink hover:bg-bg-alt/60'
              }`}
            >
              Admin
            </button>

            {adminAuth && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 rounded-card text-sm text-ink-faint hover:text-danger transition-colors duration-150"
              >
                Logout
              </button>
            )}

            {/* cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-card text-ink-light hover:text-ink hover:bg-bg-alt/60 transition-colors duration-150 ml-1"
              aria-label={`Cart (${cartCount} items)`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 anim-scale">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
