package com.water.webgis;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.water.webgis.mapper")
public class WaterWebgisApplication {

    public static void main(String[] args) {
        SpringApplication.run(WaterWebgisApplication.class, args);
    }

}
