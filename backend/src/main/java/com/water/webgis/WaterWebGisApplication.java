package com.water.webgis;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.mybatis.spring.annotation.MapperScan;

@SpringBootApplication
@MapperScan("com.water.webgis.modules.*.mapper")
public class WaterWebGisApplication {

    public static void main(String[] args) {
        SpringApplication.run(WaterWebGisApplication.class, args);
    }

}
