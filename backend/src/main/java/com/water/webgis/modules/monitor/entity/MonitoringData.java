package com.water.webgis.modules.monitor.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("monitoring_data")
public class MonitoringData {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long facilityId;
    private BigDecimal waterLevel;
    private BigDecimal flowRate;
    private Integer switchStatus;
    private LocalDateTime collectTime;
}
