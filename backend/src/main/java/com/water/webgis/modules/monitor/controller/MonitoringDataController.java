package com.water.webgis.modules.monitor.controller;

import com.water.webgis.common.Result;
import com.water.webgis.modules.monitor.entity.MonitoringData;
import com.water.webgis.modules.monitor.service.MonitoringDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/monitor")
@RequiredArgsConstructor
@CrossOrigin
public class MonitoringDataController {

    private final MonitoringDataService monitoringDataService;

    @GetMapping("/list/{facilityId}")
    public Result<List<MonitoringData>> list(@PathVariable Long facilityId) {
        // Simple list by facility ID. In real app, we might need time range query.
        return Result.success(monitoringDataService.lambdaQuery().eq(MonitoringData::getFacilityId, facilityId).list());
    }
}
