package com.water.webgis.controller;

import com.water.webgis.common.Result;
import com.water.webgis.entity.MonitoringData;
import com.water.webgis.service.MonitoringDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/monitor")
public class MonitoringDataController {

    @Autowired
    private MonitoringDataService monitoringDataService;

    @GetMapping("/history")
    public Result<List<MonitoringData>> getHistory(
            @RequestParam Long facilityId,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date startTime,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date endTime) {
        return monitoringDataService.getHistory(facilityId, startTime, endTime);
    }
    
    @PostMapping("/report")
    public Result<String> reportData(@RequestBody MonitoringData data) {
        return monitoringDataService.saveData(data);
    }
}
