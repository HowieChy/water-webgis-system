package com.water.webgis.modules.sys.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.water.webgis.modules.sys.entity.SysUser;

public interface SysUserService extends IService<SysUser> {
    String login(String username, String password);
}
