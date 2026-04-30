import api from "./authService.js";

export const getProducts = (params = {}) => api.get("/products", { params }).then((r) => r.data);
export const getProduct = (id) => api.get(`/products/${id}`).then((r) => r.data);
export const createProduct = (data) => api.post("/products", data).then((r) => r.data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data).then((r) => r.data);
export const deleteProduct = (id) => api.delete(`/products/${id}`).then((r) => r.data);
export const uploadImage = (file) => {
  const form = new FormData();
  form.append("image", file);
  return api
    .post("/products/upload/image", form, { headers: { "Content-Type": "multipart/form-data" } })
    .then((r) => r.data.url);
};
