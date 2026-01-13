package com.water.webgis.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.water.webgis.common.JwtUtils;
import com.water.webgis.common.Result;
import com.water.webgis.entity.SysUser;
import com.water.webgis.mapper.SysUserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证服务类
 * 继承 MyBatis-Plus 的 ServiceImpl,提供基础 CRUD 功能
 * 处理用户登录、注册等认证业务逻辑
 */
@Service
public class AuthService extends ServiceImpl<SysUserMapper, SysUser> {

    @Autowired
    private PasswordEncoder passwordEncoder; // 密码编码器,用于加密和验证密码

    @Autowired
    private JwtUtils jwtUtils; // JWT 工具类,用于生成 Token

    /**
     * 用户登录方法
     * 
     * @param username 用户名
     * @param password 密码(明文)
     * @return 登录结果,成功返回 Token 和用户信息,失败返回错误信息
     */
    public Result<Map<String, Object>> login(String username, String password) {
        // 根据用户名查询用户
        // QueryWrapper 是 MyBatis-Plus 的条件构造器,eq 表示等于
        SysUser user = getOne(new QueryWrapper<SysUser>().eq("username", username));

        // 验证用户是否存在,以及密码是否匹配
        // passwordEncoder.matches() 会将明文密码加密后与数据库中的密文比较
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return Result.error(401, "Invalid username or password");
        }

        // 检查账户状态,0 表示禁用,1 表示启用
        if (user.getStatus() == 0) {
            return Result.error(403, "Account is disabled");
        }

        // 构建 JWT 的自定义声明(payload)
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId()); // 用户 ID
        claims.put("role", user.getRoleType()); // 用户角色

        // 生成 JWT Token
        String token = jwtUtils.generateToken(claims, username);

        // 构建返回数据
        Map<String, Object> data = new HashMap<>();
        data.put("token", token); // JWT Token
        data.put("user", user); // 用户信息

        // 安全考虑:清除密码字段,避免返回给前端
        user.setPassword(null);

        return Result.success(data);
    }

    /**
     * 用户注册方法
     * 
     * @param user 用户信息对象
     * @return 注册结果
     */
    public Result<String> register(SysUser user) {
        // 检查用户名是否已存在
        if (getOne(new QueryWrapper<SysUser>().eq("username", user.getUsername())) != null) {
            return Result.error("Username already exists");
        }

        // 加密密码
        // BCrypt 是一种单向加密算法,相同密码每次加密结果不同,但都能验证成功
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 设置默认状态为启用
        user.setStatus(1);

        // 保存用户到数据库
        // save() 方法继承自 ServiceImpl
        save(user);

        return Result.success("Register success");
    }
}
