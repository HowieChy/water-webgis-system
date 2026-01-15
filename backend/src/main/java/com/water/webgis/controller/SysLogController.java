package com.water.webgis.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.water.webgis.common.Result;
import com.water.webgis.entity.SysLog;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sys/log")
public class SysLogController {

    @Autowired
    private com.water.webgis.service.SysLogService sysLogService;

    @GetMapping("/list")
    public Result<IPage<SysLog>> list(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String operation) {

        return sysLogService.getPagedLogs(current, size, operation);
    }
}
