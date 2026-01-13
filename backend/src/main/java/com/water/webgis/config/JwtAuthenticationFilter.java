package com.water.webgis.config;

import com.water.webgis.common.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

/**
 * JWT 认证过滤器
 * 继承 OncePerRequestFilter 确保每个请求只执行一次
 * 负责从请求头中提取 JWT Token 并验证,设置 Spring Security 上下文
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils; // 注入 JWT 工具类

    /**
     * 过滤器核心方法:处理每个 HTTP 请求
     * 
     * @param request     HTTP 请求对象
     * @param response    HTTP 响应对象
     * @param filterChain 过滤器链,用于传递请求到下一个过滤器
     * @throws ServletException Servlet 异常
     * @throws IOException      IO 异常
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // 从请求头中获取 Authorization 字段
        String authHeader = request.getHeader("Authorization");
        String token = null; // JWT Token
        String username = null; // 从 Token 中解析出的用户名

        // 检查 Authorization 头是否存在且以 "Bearer " 开头
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // 提取 Token(去掉 "Bearer " 前缀,共 7 个字符)
            token = authHeader.substring(7);

            // 验证 Token 是否有效
            if (jwtUtils.validateToken(token)) {
                // 从 Token 中提取用户名
                username = jwtUtils.getUsernameFromToken(token);
            }
        }

        // 如果用户名不为空且当前 Security 上下文中没有认证信息
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // 注意:在真实应用中,应该从数据库加载完整的 UserDetails
            // 这里为了简化,直接创建一个最小化的 UserDetails 对象
            // 生产环境建议注入 UserDetailsService 从数据库加载用户信息
            UserDetails userDetails = new User(username, "", new ArrayList<>());

            // 创建认证令牌
            // 参数:principal(用户信息), credentials(凭证,这里为null), authorities(权限列表)
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());

            // 设置请求详情(IP地址、Session ID 等)
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            // 将认证信息设置到 Spring Security 上下文中
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        // 继续执行过滤器链,传递请求到下一个过滤器
        filterChain.doFilter(request, response);
    }
}
