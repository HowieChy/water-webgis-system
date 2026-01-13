package com.water.webgis.common;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Map;

/**
 * JWT 工具类
 * 负责 JWT Token 的生成、验证和解析
 */
@Component
public class JwtUtils {

    // 从配置文件中读取 JWT 密钥
    @Value("${jwt.secret}")
    private String secret;

    // 从配置文件中读取 JWT 过期时间(毫秒)
    @Value("${jwt.expiration}")
    private Long expiration;

    /**
     * 获取签名密钥
     * 使用 HMAC-SHA 算法将密钥字符串转换为 Key 对象
     * 
     * @return 签名密钥
     */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * 生成 JWT Token
     * 
     * @param claims  自定义声明(payload),可包含用户 ID、角色等信息
     * @param subject 主题,通常是用户名
     * @return 生成的 JWT Token 字符串
     */
    public String generateToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims) // 设置自定义声明
                .setSubject(subject) // 设置主题(用户名)
                .setIssuedAt(new Date(System.currentTimeMillis())) // 设置签发时间
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // 设置过期时间
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // 使用 HS256 算法签名
                .compact(); // 生成最终的 Token 字符串
    }

    /**
     * 验证 Token 是否有效
     * 
     * @param token JWT Token 字符串
     * @return true 表示有效,false 表示无效(过期、签名错误等)
     */
    public boolean validateToken(String token) {
        try {
            // 使用密钥解析 Token,如果解析成功说明 Token 有效
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            // 任何异常(过期、签名错误、格式错误等)都表示 Token 无效
            return false;
        }
    }

    /**
     * 从 Token 中提取用户名
     * 
     * @param token JWT Token 字符串
     * @return 用户名
     */
    public String getUsernameFromToken(String token) {
        // 解析 Token 获取 Claims(声明)
        Claims claims = Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token).getBody();
        // 返回 Subject(主题),即用户名
        return claims.getSubject();
    }

    /**
     * 从 Token 中获取所有声明信息
     * 
     * @param token JWT Token 字符串
     * @return Claims 对象,包含所有声明信息
     */
    public Claims getClaimsFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build()
                .parseClaimsJws(token).getBody();
    }
}
