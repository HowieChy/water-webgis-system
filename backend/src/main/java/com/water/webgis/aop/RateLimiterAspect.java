package com.water.webgis.aop;

import com.google.common.util.concurrent.RateLimiter;
import com.water.webgis.annotation.RateLimit;
import com.water.webgis.common.Result;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

/**
 * 限流切面
 * 使用 Guava RateLimiter 实现接口请求限流
 */
@Aspect
@Component
public class RateLimiterAspect {

    // 存储每个接口的限流器,key 为方法签名,value 为对应的 RateLimiter
    private final Map<String, RateLimiter> limiters = new ConcurrentHashMap<>();

    /**
     * 环绕通知:拦截带有 @RateLimit 注解的方法
     * 
     * @param point     切点,包含被拦截方法的信息
     * @param rateLimit RateLimit 注解实例,包含限流配置
     * @return 方法执行结果
     * @throws Throwable 方法执行异常
     */
    @Around("@annotation(rateLimit)")
    public Object around(ProceedingJoinPoint point, RateLimit rateLimit) throws Throwable {
        // 获取方法的完整签名作为限流器的唯一标识
        String key = point.getSignature().toLongString();

        // 如果该方法还没有限流器,则创建一个
        // 限流速率 = count / time (例如: 5次/60秒 = 0.083次/秒)
        RateLimiter limiter = limiters.computeIfAbsent(key,
                k -> RateLimiter.create(rateLimit.count() / (double) rateLimit.time()));

        // 尝试获取令牌,如果获取失败说明超过限流阈值
        if (!limiter.tryAcquire()) {
            // 返回限流错误响应
            return Result.error("请求过于频繁,请稍后再试");
        }

        // 未超过限流,继续执行原方法
        return point.proceed();
    }
}
