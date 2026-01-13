package com.water.webgis.controller;

import com.water.webgis.common.Result;
import com.water.webgis.entity.SysUser;
import com.water.webgis.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        return authService.login(username, password);
    }

    @PostMapping("/register")
    public Result<String> register(@RequestBody SysUser user) {
        return authService.register(user);
    }
}
