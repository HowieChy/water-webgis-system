package com.water.webgis.common;

import lombok.Data;

/**
 * 统一响应结果类
 * 用于封装所有 API 接口的返回数据
 * 
 * @param <T> 泛型,表示响应数据的类型
 */
@Data // Lombok 注解,自动生成 getter/setter/toString/equals/hashCode 方法
public class Result<T> {
    private Integer code; // 响应状态码(200=成功, 500=失败, 401=未授权等)
    private String message; // 响应消息
    private T data; // 响应数据(泛型,可以是任意类型)

    /**
     * 成功响应(无数据)
     * 
     * @return Result 对象,code=200, message="Success", data=null
     */
    public static <T> Result<T> success() {
        return success(null);
    }

    /**
     * 成功响应(带数据)
     * 
     * @param data 响应数据
     * @return Result 对象,code=200, message="Success"
     */
    public static <T> Result<T> success(T data) {
        Result<T> result = new Result<>();
        result.setCode(200); // 设置成功状态码
        result.setMessage("Success"); // 设置成功消息
        result.setData(data); // 设置响应数据
        return result;
    }

    /**
     * 错误响应(自定义状态码和消息)
     * 
     * @param code    错误状态码
     * @param message 错误消息
     * @return Result 对象,data=null
     */
    public static <T> Result<T> error(Integer code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code); // 设置错误状态码
        result.setMessage(message); // 设置错误消息
        return result;
    }

    /**
     * 错误响应(默认状态码 500)
     * 
     * @param message 错误消息
     * @return Result 对象,code=500
     */
    public static <T> Result<T> error(String message) {
        return error(500, message);
    }
}
