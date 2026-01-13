package com.water.webgis.config;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MyBatis-Plus 配置类
 * 配置 MyBatis-Plus 的插件和功能
 */
@Configuration // 标识这是一个配置类
public class MybatisPlusConfig {

    /**
     * 配置 MyBatis-Plus 拦截器
     * 主要用于添加分页插件
     * 
     * @return MybatisPlusInterceptor 拦截器实例
     */
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        // 创建拦截器实例
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();

        // 添加分页内部拦截器,指定数据库类型为 PostgreSQL
        // 这样 MyBatis-Plus 会自动处理分页查询,生成正确的 SQL 语句
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.POSTGRE_SQL));

        return interceptor;
    }
}
