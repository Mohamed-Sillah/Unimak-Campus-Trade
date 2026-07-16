import api from "./api";

export const getAllListings = () => api.get("/listings");
export const getListingById = (id) => api.get(`/listings/${id}`);
export const getProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);

/**
 * Creates a new product listing.
 * @param {FormData} formData - Must contain title, price, image, etc.
 */
export const createListing = (formData) => {
  // Let the browser/axios set the Content-Type including the multipart boundary
  return api.post("/products", formData);
};

export const updateListing = (id, formData) => {
  // Let the browser/axios set the Content-Type including the multipart boundary
  return api.patch(`/products/${id}`, formData);
};
export const deleteListing = (id) => api.delete(`/products/${id}`);