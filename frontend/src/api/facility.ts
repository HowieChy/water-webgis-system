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

// Monitoring
export const getHistory = (params: any) => {
  return request.get("/monitor/history", { params });
};
