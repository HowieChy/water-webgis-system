import request from "../utils/request";

export const getFacilities = () => {
  return request.get("/facility/list");
};

export const getCategories = () => {
  return request.get("/facility/category/list");
};

export const saveFacility = (data: any) => {
  return request.post("/facility/save", data);
};

export const createFacility = (data: any) => {
  return request.post("/facility/save", data);
};

export const updateFacility = (id: number, data: any) => {
  data.id = id;
  return request.post("/facility/save", data);
};

export const deleteFacility = (id: number) => {
  return request.delete(`/facility/${id}`);
};

// Monitoring
export const getHistory = (params: any) => {
  return request.get("/monitor/history", { params });
};

// Category
export const saveCategory = (data: any) =>
  request.post("/facility/category/save", data);
export const deleteCategory = (id: number) =>
  request.delete(`/facility/category/${id}`);
