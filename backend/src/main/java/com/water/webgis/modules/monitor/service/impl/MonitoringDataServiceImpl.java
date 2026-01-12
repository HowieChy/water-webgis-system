package com.water.webgis.modules.monitor.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.water.webgis.modules.monitor.entity.MonitoringData;
import com.water.webgis.modules.monitor.mapper.MonitoringDataMapper;
import com.water.webgis.modules.monitor.service.MonitoringDataService;
import org.springframework.stereotype.Service;

@Service
public class MonitoringDataServiceImpl extends ServiceImpl<MonitoringDataMapper, MonitoringData> implements MonitoringDataService {
}
