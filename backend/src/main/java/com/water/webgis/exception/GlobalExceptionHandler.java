package com.water.webgis.exception;

import com.water.webgis.common.Result;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 全局异常处理器
 * 使用 @RestControllerAdvice 统一处理所有 Controller 抛出的异常
 * 避免在每个 Controller 中重复编写异常处理代码
 */
@RestControllerAdvice // 全局 Controller 增强,自动应用于所有 @RestController
public class GlobalExceptionHandler {

    /**
     * 处理所有 Exception 类型的异常
     * 这是最顶层的异常捕获,会捕获所有未被其他 Handler 处理的异常
     * 
     * @param e 异常对象
     * @return 统一的错误响应
     */
    @ExceptionHandler(Exception.class)
    public Result<String> handleException(Exception e) {
        // 打印异常堆栈信息到控制台,便于调试
        e.printStackTrace();

        // 返回 500 错误响应,包含异常消息
        return Result.error(500, "System Error: " + e.getMessage());
    }

    /**
     * 处理 RuntimeException 类型的异常
     * 运行时异常通常是程序逻辑错误,如空指针、数组越界等
     * 
     * @param e 运行时异常对象
     * @return 统一的错误响应
     */
    @ExceptionHandler(RuntimeException.class)
    public Result<String> handleRuntimeException(RuntimeException e) {
        // 打印异常堆栈信息
        e.printStackTrace();

        // 返回 500 错误响应,包含异常消息
        return Result.error(500, e.getMessage());
    }
}
