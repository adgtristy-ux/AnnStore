import { useState, useEffect } from 'react';
import { useAppContext } from '../App';

export default function CartDrawer() {
  const {
    cart, cartOpen, setCartOpen,
    handleUpdateCartQty, handleRemoveCartItem, handleCheckout,
  } = useAppContext();

  const [closing, setClosing] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const closeDrawer = () => {
    setClosing(true);
    setTimeout(() => { setCartOpen(false); setClosing(false); }, 220);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && cartOpen) closeDrawer(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [cartOpen]);

  if (!cartOpen && !closing) return null;

  const subtotal = cart.reduce((s, item) => s + (item.productId?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const onRemove = async (id) => {
    setRemovingId(id);
    setTimeout(async () => { await handleRemoveCartItem(id); setRemovingId(null); }, 250);
  };

  const onCheckout = async () => {
    setCheckingOut(true);
    const success = await handleCheckout();
    setCheckingOut(false);
    if (success) {
      setOrderPlaced(true);
      setTimeout(() => setOrderPlaced(false), 4000);
    }
  };

  return (
    <>
      {/* order placed popup */}
      {orderPlaced && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 anim-fade">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOrderPlaced(false)} />
          <div className="relative bg-white rounded-card p-8 max-w-xs w-full text-center shadow-modal anim-scale">
            <div className="text-4xl mb-3">&#10003;</div>
            <h3 className="font-heading text-xl text-ink mb-1">Order placed!</h3>
            <p className="text-ink-light text-sm mb-5">Thank you for shopping with us.</p>
            <button onClick={() => setOrderPlaced(false)} className="btn-primary w-full">
              Continue shopping
            </button>
          </div>
        </div>
      )}

      {/* backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 anim-fade"
        onClick={closeDrawer}
      />

      {/* drawer */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[380px] bg-white border-l border-border shadow-modal flex flex-col ${
          closing ? 'cart-exit' : 'cart-enter'
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-heading text-lg text-ink">Your cart</h2>
          <button
            onClick={closeDrawer}
            className="p-1.5 rounded-card hover:bg-bg-alt text-ink-light hover:text-ink transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <svg className="w-12 h-12 text-ink-faint/40 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <p className="text-ink-light text-sm mb-1">Your cart is empty</p>
              <p className="text-ink-faint text-xs mb-4">Browse our collection to get started</p>
              <button onClick={closeDrawer} className="btn-secondary text-xs">
                Browse products
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const product = item.productId;
              if (!product) return null;
              const isRemoving = removingId === item._id;

              return (
                <div
                  key={item._id}
                  className={`flex gap-3 p-3 rounded-card bg-bg-alt/50 transition-all duration-200 ${
                    isRemoving ? 'opacity-0 translate-x-4' : ''
                  }`}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-14 h-14 rounded-card object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-ink truncate">{product.name}</h4>
                    <p className="text-ink-light text-xs">${product.price.toFixed(2)}</p>

                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? handleUpdateCartQty(item._id, item.quantity - 1)
                            : onRemove(item._id)
                        }
                        className="w-6 h-6 rounded border border-border text-ink-light hover:border-border-hover hover:text-ink flex items-center justify-center text-xs transition-colors"
                      >
                        -
                      </button>
                      <span className="text-xs font-medium text-ink w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateCartQty(item._id, item.quantity + 1)}
                        className="w-6 h-6 rounded border border-border text-ink-light hover:border-border-hover hover:text-ink flex items-center justify-center text-xs transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <span className="text-sm font-medium text-ink">
                      ${(product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => onRemove(item._id)}
                      className="text-ink-faint hover:text-danger transition-colors p-0.5"
                      aria-label={`Remove ${product.name}`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* summary */}
        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-border space-y-2">
            <div className="flex justify-between text-sm text-ink-light">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-ink-light">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-ink pt-2 border-t border-border">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              disabled={checkingOut}
              className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
            >
              {checkingOut ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </>
              ) : (
                'Checkout'
              )}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
