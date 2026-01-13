package com.water.webgis.common.aspect;

import com.water.webgis.common.JwtUtils;
import com.water.webgis.common.annotation.Log;
import com.water.webgis.entity.SysLog;
import com.water.webgis.mapper.SysLogMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.util.Date;

@Aspect
@Component
public class SysLogAspect {

    @Autowired
    private SysLogMapper sysLogMapper;

    @Autowired
    private JwtUtils jwtUtils;

    @Around("@annotation(com.water.webgis.common.annotation.Log)")
    public Object log(ProceedingJoinPoint point) throws Throwable {
        long beginTime = System.currentTimeMillis();
        // Execute method
        Object result = point.proceed();
        // Execute time
        long time = System.currentTimeMillis() - beginTime;

        saveSysLog(point, time);

        return result;
    }

    private void saveSysLog(ProceedingJoinPoint joinPoint, long time) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        SysLog sysLog = new SysLog();
        Log log = method.getAnnotation(Log.class);
        if (log != null) {
            // Annotation value
            sysLog.setOperation(log.value());
        }

        // Request method name
        String className = joinPoint.getTarget().getClass().getName();
        String methodName = signature.getName();
        sysLog.setMethod(className + "." + methodName + "()");

        // Request params (optional, can be large) 
        // Object[] args = joinPoint.getArgs(); 
        // sysLog.setParams(Arrays.toString(args));

        // Get Request info
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        if (request != null) {
            sysLog.setIpAddr(request.getRemoteAddr());
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    String username = jwtUtils.getUsernameFromToken(token);
                     // Ideally we get userId here. For now we might look up or use username if field changed. 
                     // Entity has userId (Long). We need to fetch userId from token claims or DB.
                     // Assuming claims have "id".
                     Object idObj = jwtUtils.getClaimsFromToken(token).get("id");
                     if(idObj != null) {
                         sysLog.setUserId(Long.valueOf(idObj.toString()));
                     }
                } catch (Exception e) {
                    // ignore
                }
            }
        }
        
        sysLog.setCreateTime(new Date());
        sysLogMapper.insert(sysLog);
    }
}
