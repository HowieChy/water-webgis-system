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

@Service
public class AuthService extends ServiceImpl<SysUserMapper, SysUser> {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public Result<Map<String, Object>> login(String username, String password) {
        SysUser user = getOne(new QueryWrapper<SysUser>().eq("username", username));
        
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return Result.error(401, "Invalid username or password");
        }
        
        if (user.getStatus() == 0) {
            return Result.error(403, "Account is disabled");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("role", user.getRoleType());
        
        String token = jwtUtils.generateToken(claims, username);
        
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        data.put("user", user); // Be careful not to expose password, ideally use DTO
        user.setPassword(null); // Clear password before returning
        
        return Result.success(data);
    }

    public Result<String> register(SysUser user) {
        if (getOne(new QueryWrapper<SysUser>().eq("username", user.getUsername())) != null) {
            return Result.error("Username already exists");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setStatus(1); // Default enable
        save(user);
        
        return Result.success("Register success");
    }
}
