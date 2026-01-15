package com.water.webgis.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.water.webgis.common.Result;
import com.water.webgis.entity.SysLog;

public interface SysLogService extends IService<SysLog> {
    /**
     * Get paginated system logs with optional fuzzy search
     * 
     * @param current   current page number
     * @param size      page size
     * @param operation operation description or method name (fuzzy search)
     * @return paginated logs
     */
    Result<IPage<SysLog>> getPagedLogs(int current, int size, String operation);
}
