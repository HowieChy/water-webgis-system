package com.water.webgis.modules.sys.controller;

import com.water.webgis.common.Result;
import com.water.webgis.modules.sys.dto.AuthRequest;
import com.water.webgis.modules.sys.service.SysUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final SysUserService sysUserService;

    @PostMapping("/login")
    public Result<String> login(@RequestBody AuthRequest request) {
        String token = sysUserService.login(request.getUsername(), request.getPassword());
        return Result.success(token);
    }
}
