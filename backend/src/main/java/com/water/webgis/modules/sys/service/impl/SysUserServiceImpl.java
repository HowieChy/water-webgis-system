package com.water.webgis.modules.sys.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.water.webgis.common.utils.JwtUtils;
import com.water.webgis.modules.sys.entity.SysUser;
import com.water.webgis.modules.sys.mapper.SysUserMapper;
import com.water.webgis.modules.sys.service.SysUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // Assuming we use BCrypt
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements SysUserService {

    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // Or inject it

    @Override
    public String login(String username, String password) {
        SysUser user = getOne(new QueryWrapper<SysUser>().eq("username", username));
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }
        if (user.getStatus() == 0) {
            throw new RuntimeException("Account disabled");
        }
        return jwtUtils.generateToken(username, user.getRoleType());
    }
}
