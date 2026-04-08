import { useState } from 'react';
import { useAppContext } from '../App';
import ProductModal from './ProductModal';

export default function AdminPanel() {
  const { products, handleDeleteProduct, handleUpdateProduct } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [stockEditId, setStockEditId] = useState(null);
  const [stockValue, setStockValue] = useState('');
  const [savingStock, setSavingStock] = useState(false);

  const openCreate = () => { setEditingProduct(null); setModalOpen(true); };
  const openEdit = (p) => { setEditingProduct(p); setModalOpen(true); };

  const onDelete = async (id) => {
    if (deleteConfirm === id) {
      await handleDeleteProduct(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const openStockEdit = (p) => {
    setStockEditId(p._id);
    setStockValue(String(p.stock));
  };

  const cancelStockEdit = () => {
    setStockEditId(null);
    setStockValue('');
  };

  const saveStock = async (product) => {
    const newStock = parseInt(stockValue, 10);
    if (isNaN(newStock) || newStock < 0) return;
    setSavingStock(true);
    try {
      await handleUpdateProduct(product._id, {
        ...product,
        stock: newStock,
      });
    } catch { /* handled by App */ }
    setSavingStock(false);
    setStockEditId(null);
    setStockValue('');
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return { text: 'Sold Out', cls: 'bg-red-100 text-red-700 border-red-200' };
    if (stock <= 5) return { text: `${stock} left`, cls: 'bg-yellow-50 text-yellow-700 border-yellow-200' };
    return { text: `${stock} in stock`, cls: 'bg-green-50 text-green-700 border-green-200' };
  };

  return (
    <section className="pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="font-heading text-3xl text-ink">Admin Panel</h1>
          <p className="text-ink-light text-sm mt-0.5">Manage your product catalogue</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5 self-start">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add product
        </button>
      </div>

      <div className="card overflow-hidden">
        {/* desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-alt/30">
                <th className="px-4 py-3 font-medium text-ink-light text-xs uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 font-medium text-ink-light text-xs uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 font-medium text-ink-light text-xs uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 font-medium text-ink-light text-xs uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 font-medium text-ink-light text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {products.map((p) => {
                const badge = getStockBadge(p.stock);
                return (
                  <tr key={p._id} className="hover:bg-bg-alt/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.imageUrl} alt={p.name} className="w-9 h-9 rounded object-cover" />
                        <div>
                          <p className="font-medium text-ink text-sm">{p.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-bg-alt text-ink-light border border-border">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-ink">${p.price.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      {stockEditId === p._id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={stockValue}
                            onChange={(e) => setStockValue(e.target.value)}
                            className="input-field !w-20 !px-2 !py-1 text-xs"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveStock(p);
                              if (e.key === 'Escape') cancelStockEdit();
                            }}
                          />
                          <button
                            onClick={() => saveStock(p)}
                            disabled={savingStock}
                            className="text-success hover:text-green-800 transition-colors p-0.5"
                            title="Save"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={cancelStockEdit}
                            className="text-ink-faint hover:text-ink transition-colors p-0.5"
                            title="Cancel"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border ${badge.cls}`}
                        >
                          {badge.text}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openStockEdit(p)}
                          className="btn-ghost !px-2.5 !py-1 text-xs flex items-center gap-1"
                          title="Update stock"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                          </svg>
                          Stock
                        </button>
                        <button onClick={() => openEdit(p)} className="btn-ghost !px-2.5 !py-1 text-xs">
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(p._id)}
                          className={`text-xs px-2.5 py-1 rounded-card transition-all duration-150 ${
                            deleteConfirm === p._id
                              ? 'bg-danger text-white'
                              : 'text-ink-faint hover:text-danger hover:bg-danger-light'
                          }`}
                        >
                          {deleteConfirm === p._id ? 'Confirm' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* mobile list */}
        <div className="md:hidden divide-y divide-border/60">
          {products.map((p) => {
            const badge = getStockBadge(p.stock);
            return (
              <div key={p._id} className="p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink text-sm truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-ink-light text-xs">{p.category}</span>
                      <span className="text-ink text-xs font-medium">${p.price.toFixed(2)}</span>
                      <span className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${badge.cls}`}>
                        {badge.text}
                      </span>
                    </div>
                  </div>
                </div>

                {stockEditId === p._id ? (
                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="number"
                      min="0"
                      value={stockValue}
                      onChange={(e) => setStockValue(e.target.value)}
                      className="input-field !w-24 !px-2 !py-1 text-xs"
                      autoFocus
                    />
                    <button
                      onClick={() => saveStock(p)}
                      disabled={savingStock}
                      className="btn-primary !px-3 !py-1 text-xs"
                    >
                      Save
                    </button>
                    <button onClick={cancelStockEdit} className="btn-ghost !px-3 !py-1 text-xs">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openStockEdit(p)}
                      className="btn-ghost flex-1 text-xs flex items-center justify-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                      Stock
                    </button>
                    <button onClick={() => openEdit(p)} className="btn-ghost flex-1 text-xs">Edit</button>
                    <button
                      onClick={() => onDelete(p._id)}
                      className={`flex-1 text-xs px-3 py-1.5 rounded-card transition-all ${
                        deleteConfirm === p._id
                          ? 'bg-danger text-white'
                          : 'btn-ghost text-ink-faint hover:text-danger'
                      }`}
                    >
                      {deleteConfirm === p._id ? 'Confirm' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {modalOpen && <ProductModal product={editingProduct} onClose={() => setModalOpen(false)} />}
    </section>
  );
}
