package com.water.webgis.modules.facility.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("facility_category")
public class FacilityCategory {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String iconUrl;
    private Integer sortOrder;
}
