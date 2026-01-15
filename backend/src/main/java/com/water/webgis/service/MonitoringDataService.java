package com.water.webgis.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
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
        if (data.getCreateTime() == null) {
            data.setCreateTime(new Date());
        }
        monitoringDataMapper.insert(data);
        return Result.success("Saved");
    }

    /**
     * 分页查询监测数据
     */
    public Result<IPage<MonitoringData>> getPagedData(int current, int size, Long categoryId, Long facilityId) {
        Page<MonitoringData> page = new Page<>(current, size);
        IPage<MonitoringData> result = monitoringDataMapper.selectPageWithCategory(page, categoryId, facilityId);
        return Result.success(result);
    }

    /**
     * 根据ID查询详情
     */
    public Result<MonitoringData> getById(Long id) {
        MonitoringData data = monitoringDataMapper.selectById(id);
        if (data == null) {
            return Result.error("数据不存在");
        }
        return Result.success(data);
    }
}
