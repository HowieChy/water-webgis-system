package com.water.webgis.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.water.webgis.common.Result;
import com.water.webgis.entity.SysLog;
import com.water.webgis.mapper.SysLogMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sys/log")
public class SysLogController {

    @Autowired
    private SysLogMapper sysLogMapper;

    @GetMapping("/list")
    public Result<IPage<SysLog>> list(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String operation) {
        
        Page<SysLog> page = new Page<>(current, size);
        QueryWrapper<SysLog> query = new QueryWrapper<>();
        if (operation != null && !operation.isEmpty()) {
            query.like("operation", operation);
        }
        query.orderByDesc("create_time");
        
        return Result.success(sysLogMapper.selectPage(page, query));
    }
}
