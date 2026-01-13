import request from "../utils/request";

// 获取用户列表(分页)
export const getUsers = (params: any) => {
  return request.get("/api/user/page", { params });
};

// 创建用户
export const createUser = (data: any) => {
  return request.post("/api/user", data);
};

// 更新用户
export const updateUser = (id: number, data: any) => {
  return request.put(`/api/user/${id}`, data);
};

// 删除用户
export const deleteUser = (id: number) => {
  return request.delete(`/api/user/${id}`);
};

// 批量删除用户
export const batchDeleteUsers = (ids: number[]) => {
  return request.post("/api/user/batch-delete", { ids });
};
