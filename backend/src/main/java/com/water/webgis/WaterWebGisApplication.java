package com.water.webgis;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot 应用程序主类
 * 城市水务 WebGIS 系统的启动入口
 */
@SpringBootApplication // Spring Boot 核心注解,包含 @Configuration, @EnableAutoConfiguration, @ComponentScan
@MapperScan("com.water.webgis.mapper") // 扫描 Mapper 接口所在的包,自动注册为 MyBatis 的 Mapper
public class WaterWebgisApplication {

    /**
     * 应用程序入口方法
     * 
     * @param args 命令行参数
     */
    public static void main(String[] args) {
        // 启动 Spring Boot 应用
        SpringApplication.run(WaterWebgisApplication.class, args);
    }

}
