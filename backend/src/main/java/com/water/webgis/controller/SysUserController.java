package com.water.webgis.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.water.webgis.common.Result;
import com.water.webgis.entity.SysUser;
import com.water.webgis.mapper.SysUserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class SysUserController {

    @Autowired
    private SysUserMapper sysUserMapper;

    @GetMapping("/list")
    public Result<IPage<SysUser>> list(
            @RequestParam(defaultValue = "1") Integer current,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) String keyword) {
        
        Page<SysUser> page = new Page<>(current, size);
        QueryWrapper<SysUser> query = new QueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            query.like("username", keyword).or().like("real_name", keyword);
        }
        
        // Hide password
        query.select(SysUser.class, info -> !info.getColumn().equals("password"));
        
        return Result.success(sysUserMapper.selectPage(page, query));
    }
}
