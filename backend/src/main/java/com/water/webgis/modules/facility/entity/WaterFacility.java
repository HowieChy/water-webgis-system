package com.water.webgis.modules.facility.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
// Using PostGIS geometry type handling might require custom TypeHandler or just Object if using Jackson to serialize
// For simplicity we use String or specific Geometry type if library supported. We added postgis-jdbc.
// But MyBatis Plus might need a TypeHandler.
// Let's use Object for now and handle GeoJSON parsing in Controller or Service if needed.
// Or we can use a library like JTS (org.locationtech.jts.geom.Geometry).
// Spring Boot Data JPA supports it, MyBatis requires configuration.
// We will simply treat it as Object or String and cast in SQL for now to keep dependency simple?
// Actually, using a custom TypeHandler is best.
import java.time.LocalDateTime;

@Data
@TableName(value = "water_facility", autoResultMap = true)
public class WaterFacility {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String code;
    // We will need a TypeHandler for Geometry, or use String and ST_AsGeoJSON in query.
    // Let's use String for simplicity in Java object and handled by PG logic
    private Object geom; // This might need attention
    private Long categoryId;
    private String address;
    private String attributes; // JSONB
    private String status;
    private LocalDateTime createTime;
}
