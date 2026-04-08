import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

/* -- Product endpoints -- */
export const fetchProducts = () => api.get('/products').then((r) => r.data);
export const createProduct = (data) => api.post('/products', data).then((r) => r.data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data).then((r) => r.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data);

/* -- Cart endpoints -- */
export const fetchCart = () => api.get('/cart').then((r) => r.data);
export const addToCart = (productId, quantity = 1) =>
  api.post('/cart', { productId, quantity }).then((r) => r.data);
export const updateCartItem = (id, quantity) =>
  api.put(`/cart/${id}`, { quantity }).then((r) => r.data);
export const removeCartItem = (id) => api.delete(`/cart/${id}`).then((r) => r.data);
export const checkout = () => api.post('/cart/checkout').then((r) => r.data);

/* -- Admin endpoints -- */
export const adminLogin = (username, password) =>
  api.post('/admin/login', { username, password }).then((r) => r.data);
