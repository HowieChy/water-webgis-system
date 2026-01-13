import request from "../utils/request";

export const getUsers = (params: any) => {
  return request.get("/user/list", { params });
};
// Since we don't have user/list endpoint in AuthController or SysUserController yet (SysUserController removed?),
// I need to add SysUserController logic or AuthController logic for listing users.
// Checking backend... AutController has login/register.
// I should create SysUserController for Management.
