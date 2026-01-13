package com.water.webgis.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.water.webgis.common.Result;
import com.water.webgis.entity.MonitoringData;
import com.water.webgis.mapper.MonitoringDataMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class MonitoringDataService {

    @Autowired
    private MonitoringDataMapper monitoringDataMapper;

    public Result<List<MonitoringData>> getHistory(Long facilityId, Date startTime, Date endTime) {
        QueryWrapper<MonitoringData> query = new QueryWrapper<>();
        query.eq("facility_id", facilityId);
        if (startTime != null) {
            query.ge("collect_time", startTime);
        }
        if (endTime != null) {
            query.le("collect_time", endTime);
        }
        query.orderByAsc("collect_time");
        
        return Result.success(monitoringDataMapper.selectList(query));
    }
    
    public Result<String> saveData(MonitoringData data) {
        if (data.getCollectTime() == null) {
            data.setCollectTime(new Date());
        }
        monitoringDataMapper.insert(data);
        return Result.success("Saved");
    }
}
