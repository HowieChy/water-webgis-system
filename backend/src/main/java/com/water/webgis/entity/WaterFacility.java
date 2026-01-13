package com.water.webgis.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.io.Serializable;
import java.util.Date;
import java.util.Map;

@Data
@TableName(value = "water_facility", autoResultMap = true)
public class WaterFacility implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private String name;

    private String code;

    // We will handle geometry as a custom object or handle in XML. 
    // For simplicity in entity, we might exclude reading it directly or use a handler.
    // Here we use Object to hold the retrieved geometry which could be PGobject or String.
    // If we want read/write simply, maybe transient?
    // Let's rely on specific mapper methods for GeoJSON.
    @TableField(exist = false) 
    private String geomJson; // For frontend interaction

    private Long categoryId;

    private String address;

    @TableField(typeHandler = JacksonTypeHandler.class)
    private Map<String, Object> attributes;

    private String status;

    private Date createTime;
}
