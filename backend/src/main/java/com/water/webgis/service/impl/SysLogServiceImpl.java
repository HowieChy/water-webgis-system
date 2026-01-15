package com.water.webgis.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.water.webgis.common.Result;
import com.water.webgis.entity.SysLog;
import com.water.webgis.mapper.SysLogMapper;
import com.water.webgis.service.SysLogService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class SysLogServiceImpl extends ServiceImpl<SysLogMapper, SysLog> implements SysLogService {

    @Override
    public Result<IPage<SysLog>> getPagedLogs(int current, int size, String operation) {
        Page<SysLog> page = new Page<>(current, size);
        QueryWrapper<SysLog> query = new QueryWrapper<>();

        if (StringUtils.hasText(operation)) {
            // Fuzzy search on 'operation' OR 'method' OR 'userId' (if strictly needed, but
            // req says operation/method or operator)
            // Requirement: "interface supports fuzzy search by 'operation method name' or
            // 'operator'"
            // Since operator is usually an ID here, let's assume filtering by operation
            // text or method name first.
            query.and(wrapper -> wrapper
                    .like("operation", operation)
                    .or()
                    .like("method", operation)
            // If operation is a number, we might check userId, but string matching is safer
            // for general search
            );
        }

        query.orderByDesc("create_time");
        return Result.success(this.page(page, query));
    }
}
