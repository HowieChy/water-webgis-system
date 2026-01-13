package com.water.webgis.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.water.webgis.common.Result;
import com.water.webgis.entity.SysUser;
import com.water.webgis.mapper.SysUserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 系统用户管理控制器
 * 提供用户的 CRUD 操作接口
 */
@RestController
@RequestMapping("/api/user")
public class SysUserController {

    @Autowired
    private SysUserMapper sysUserMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 分页查询用户列表
     * 
     * @param pageNum  页码
     * @param pageSize 每页数量
     * @param username 用户名(模糊查询)
     * @param realName 真实姓名(模糊查询)
     * @return 分页结果
     */
    @GetMapping("/page")
    public Result<IPage<SysUser>> page(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String realName) {

        // 创建分页对象
        Page<SysUser> page = new Page<>(pageNum, pageSize);

        // 构建查询条件
        QueryWrapper<SysUser> query = new QueryWrapper<>();

        // 用户名模糊查询
        if (username != null && !username.isEmpty()) {
            query.like("username", username);
        }

        // 真实姓名模糊查询
        if (realName != null && !realName.isEmpty()) {
            query.like("real_name", realName);
        }

        // 排除密码字段
        query.select(SysUser.class, info -> !info.getColumn().equals("password"));

        // 执行分页查询
        IPage<SysUser> result = sysUserMapper.selectPage(page, query);

        return Result.success(result);
    }

    /**
     * 创建新用户
     * 
     * @param user 用户信息
     * @return 创建结果
     */
    @PostMapping
    public Result<String> create(@RequestBody SysUser user) {
        // 检查用户名是否已存在
        QueryWrapper<SysUser> query = new QueryWrapper<>();
        query.eq("username", user.getUsername());
        if (sysUserMapper.selectCount(query) > 0) {
            return Result.error("用户名已存在");
        }

        // 加密密码
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 设置默认状态为启用
        if (user.getStatus() == null) {
            user.setStatus(1);
        }

        // 插入数据库
        sysUserMapper.insert(user);

        return Result.success("创建成功");
    }

    /**
     * 更新用户信息
     * 
     * @param id   用户 ID
     * @param user 用户信息
     * @return 更新结果
     */
    @PutMapping("/{id}")
    public Result<String> update(@PathVariable Long id, @RequestBody SysUser user) {
        // 检查用户是否存在
        SysUser existingUser = sysUserMapper.selectById(id);
        if (existingUser == null) {
            return Result.error("用户不存在");
        }

        // 设置 ID
        user.setId(id);

        // 如果提供了新密码,则加密
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            // 不更新密码
            user.setPassword(null);
        }

        // 更新数据库
        sysUserMapper.updateById(user);

        return Result.success("更新成功");
    }

    /**
     * 删除用户
     * 
     * @param id 用户 ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    public Result<String> delete(@PathVariable Long id) {
        // 检查用户是否存在
        SysUser user = sysUserMapper.selectById(id);
        if (user == null) {
            return Result.error("用户不存在");
        }

        // 删除用户
        sysUserMapper.deleteById(id);

        return Result.success("删除成功");
    }

    /**
     * 批量删除用户
     * 
     * @param body 包含 ids 数组的请求体
     * @return 删除结果
     */
    @PostMapping("/batch-delete")
    public Result<String> batchDelete(@RequestBody Map<String, List<Long>> body) {
        List<Long> ids = body.get("ids");

        if (ids == null || ids.isEmpty()) {
            return Result.error("请选择要删除的用户");
        }

        // 批量删除
        sysUserMapper.deleteBatchIds(ids);

        return Result.success("批量删除成功");
    }
}
