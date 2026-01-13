package com.water.webgis.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 限流注解
 * 用于标记需要限流的接口方法
 */
@Target(ElementType.METHOD) // 只能用于方法上
@Retention(RetentionPolicy.RUNTIME) // 运行时保留,可通过反射获取
public @interface RateLimit {
    /**
     * 限流器的唯一标识 key
     */
    int key();

    /**
     * 时间窗口(秒)
     */
    int time();

    /**
     * 时间窗口内允许的最大请求次数
     */
    int count();
}
