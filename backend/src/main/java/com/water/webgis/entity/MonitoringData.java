package com.water.webgis.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
@TableName("monitoring_data")
public class MonitoringData implements Serializable {
    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    private Long facilityId;

    private BigDecimal waterLevel;

    private BigDecimal flowRate;

    private Integer switchStatus; // 1: Open, 0: Closed

    private Date collectTime;
}
