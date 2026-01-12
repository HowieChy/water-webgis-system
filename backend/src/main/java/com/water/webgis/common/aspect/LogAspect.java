package com.water.webgis.common.aspect;

import com.water.webgis.common.annotation.Log;
import com.water.webgis.common.utils.JwtUtils;
import com.water.webgis.modules.sys.entity.SysLog;
import com.water.webgis.modules.sys.mapper.SysLogMapper;
import com.water.webgis.modules.sys.service.SysUserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;

@Aspect
@Component
@RequiredArgsConstructor
public class LogAspect {

    private final SysLogMapper sysLogMapper;
    private final JwtUtils jwtUtils;
    // We might need to fetch user ID by username, so injecting Mapper or Service is needed if we store user ID in log.
    // For simplicity, let's assume we can get it or just store username if ID is hard to get without DB query.
    // But table says user_id. So we need to look it up.
    private final SysUserService sysUserService; 

    @Around("@annotation(logAnnotation)")
    public Object around(ProceedingJoinPoint point, Log logAnnotation) throws Throwable {
        long beginTime = System.currentTimeMillis();
        Object result = point.proceed();
        long time = System.currentTimeMillis() - beginTime;

        saveSysLog(point, logAnnotation, time);

        return result;
    }

    private void saveSysLog(ProceedingJoinPoint joinPoint, Log logAnnotation, long time) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        SysLog sysLog = new SysLog();
        sysLog.setOperation(logAnnotation.value());
        sysLog.setMethod(signature.getDeclaringTypeName() + "." + signature.getName());
        sysLog.setCreateTime(LocalDateTime.now());

        // Get Request
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            sysLog.setIpAddr(request.getRemoteAddr());
            String token = request.getHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);
                try {
                    String username = jwtUtils.getUsernameFromToken(token);
                    // Here we ideally look up the user ID. 
                    // com.water.webgis.modules.sys.entity.SysUser user = sysUserService.getOne(new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<com.water.webgis.modules.sys.entity.SysUser>().eq("username", username));
                    // if (user != null) sysLog.setUserId(user.getId());
                    // Optimization: Cache this or just log username if schema allows. Schema says user_id.
                    // Implementation Detail: Fetching user might be slow for every log. Async is better.
                    // For now, simpler sync logic.
                     com.water.webgis.modules.sys.entity.SysUser user = sysUserService.getOne(new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<com.water.webgis.modules.sys.entity.SysUser>().eq("username", username));
                     if(user != null) {
                        sysLog.setUserId(user.getId());
                     }
                } catch (Exception e) {
                    // Ignore invalid token for logging purposes (e.g. login failure)
                }
            }
        }
        
        sysLogMapper.insert(sysLog);
    }
}
