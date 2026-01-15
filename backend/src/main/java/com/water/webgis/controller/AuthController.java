package com.water.webgis.controller;

import com.water.webgis.common.Result;
import com.water.webgis.entity.SysUser;
import com.water.webgis.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.water.webgis.common.annotation.Log;
import java.util.Map;

/**
 * 认证控制器
 * 处理用户登录、注册等认证相关请求
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService; // 注入认证服务

    /**
     * 用户登录接口
     * 验证用户名、密码和验证码,成功后返回 JWT Token
     * 
     * @param body    包含 username, password, code 的请求体
     * @param session HTTP Session,用于获取验证码
     * @return 登录结果,包含 token 和用户信息
     */
    // @com.water.webgis.annotation.RateLimit(key = 1, time = 60, count = 5) //
    // 60秒内最多5次请求
    @PostMapping("/login")
    @Log("用户登录")
    public Result<Map<String, Object>> login(@RequestBody Map<String, String> body,
            jakarta.servlet.http.HttpSession session) {
        // 从请求体中获取用户名、密码和验证码
        String username = body.get("username");
        String password = body.get("password");
        String code = body.get("code");

        // 从 Session 中获取之前生成的验证码
        String sessionCode = (String) session.getAttribute("CAPTCHA_KEY");

        // 调试日志:打印输入的验证码、Session 中的验证码和 Session ID
        System.out.println(
                "Login - Input code: " + code + ", Session code: " + sessionCode + ", Session ID: " + session.getId());

        // 验证码校验:检查验证码是否为空或不匹配(忽略大小写)
        if (code == null || sessionCode == null || !code.equalsIgnoreCase(sessionCode)) {
            return Result.error("验证码错误");
        }

        // 验证码使用后立即删除,防止重复使用
        session.removeAttribute("CAPTCHA_KEY");

        // 调用认证服务进行用户名和密码验证
        return authService.login(username, password);
    }

    /**
     * 用户注册接口
     * 
     * @param user 用户信息
     * @return 注册结果
     */
    @PostMapping("/register")
    public Result<String> register(@RequestBody SysUser user) {
        return authService.register(user);
    }
}
