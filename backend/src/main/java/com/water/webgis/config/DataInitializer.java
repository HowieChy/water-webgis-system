package com.water.webgis.config;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.water.webgis.entity.SysUser;
import com.water.webgis.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Initialize data on startup
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AuthService authService;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Admin User if not exists
        if (authService.getOne(new QueryWrapper<SysUser>().eq("username", "admin")) == null) {
            SysUser admin = new SysUser();
            admin.setUsername("admin");
            admin.setPassword("123456"); // Will be encoded by register method
            admin.setRealName("Administrator");
            admin.setRoleType("ADMIN");
            admin.setStatus(1);
            authService.register(admin);
            System.out.println("Initialized admin user: admin / 123456");
        }
    }
}
