package com.water.webgis.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Spring Security 安全配置类
 * 配置认证、授权、CORS、Session 等安全相关设置
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter; // JWT 认证过滤器

    /**
     * 配置安全过滤链
     * 
     * @param http HttpSecurity 配置对象
     * @return SecurityFilterChain 安全过滤链
     * @throws Exception 配置异常
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 禁用 CSRF 防护(前后端分离项目使用 JWT,不需要 CSRF)
                .csrf(csrf -> csrf.disable())

                // 配置 CORS 跨域
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Session 管理策略:IF_REQUIRED(需要时创建,用于验证码存储)
                // 注意:虽然 JWT 是无状态的,但验证码需要 Session 支持
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

                // 配置请求授权规则
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll() // 认证接口允许匿名访问
                        .requestMatchers("/api/captcha/**").permitAll() // 验证码接口允许匿名访问
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll() // Swagger 文档允许访问
                        .anyRequest().authenticated()) // 其他所有请求需要认证

                // 在用户名密码认证过滤器之前添加 JWT 认证过滤器
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * 认证管理器 Bean
     * 
     * @param authenticationConfiguration 认证配置
     * @return AuthenticationManager 认证管理器
     * @throws Exception 配置异常
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * 密码编码器 Bean
     * 使用 BCrypt 加密算法
     * 
     * @return PasswordEncoder 密码编码器
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * CORS 过滤器 Bean
     * 配置跨域请求的具体规则
     * 
     * @return CorsFilter CORS 过滤器
     */
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // 允许携带凭证(Cookie、Session)
        config.setAllowCredentials(true);

        // 允许的源地址(前端开发服务器地址)
        config.addAllowedOriginPattern("http://localhost:*");
        config.addAllowedOriginPattern("http://192.168.*.*:*");
        config.addAllowedOriginPattern("http://127.0.0.1:*");

        // 允许所有请求头
        config.addAllowedHeader("*");

        // 允许所有 HTTP 方法
        config.addAllowedMethod("*");

        // 对所有路径应用此 CORS 配置
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }

    /**
     * CORS 配置源(用于 Spring Security)
     * 
     * @return UrlBasedCorsConfigurationSource CORS 配置源
     */
    private UrlBasedCorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // 允许携带凭证
        config.setAllowCredentials(true);

        // 允许所有源(开发环境配置,生产环境应指定具体域名)
        config.addAllowedOriginPattern("*");

        // 允许所有请求头
        config.addAllowedHeader("*");

        // 允许所有 HTTP 方法
        config.addAllowedMethod("*");

        // 对所有路径应用此配置
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
