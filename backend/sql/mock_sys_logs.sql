-- =========================================================================================
-- 脚本说明: 模拟生成系统操作日志
-- 数据库类型: PostgreSQL
-- 功能: 批量插入模拟的系统日志数据 (含登录、设施管理、数据导出等操作)
-- =========================================================================================

TRUNCATE TABLE sys_log RESTART IDENTITY;

INSERT INTO sys_log (user_id, operation, method, ip_addr, create_time)
SELECT 
    -- 模拟用户ID: 80%也是管理员(ID=1), 20%是其他用户
    CASE WHEN random() < 0.8 THEN 1 ELSE floor(random() * 5 + 2)::bigint END,
    
    -- 模拟操作类型
    (ARRAY[
        '用户登录', 
        '新增设施', 
        '修改设施', 
        '删除设施', 
        '导出监测报表', 
        '查询历史数据', 
        '系统参数配置'
    ])[floor(random() * 7 + 1)],
    
    -- 模拟方法名 (对应上面的操作)
    CASE floor(random() * 7 + 1)
        WHEN 1 THEN 'com.water.webgis.controller.AuthController.login()'
        WHEN 2 THEN 'com.water.webgis.controller.FacilityController.create()'
        WHEN 3 THEN 'com.water.webgis.controller.FacilityController.update()'
        WHEN 4 THEN 'com.water.webgis.controller.FacilityController.delete()'
        WHEN 5 THEN 'com.water.webgis.controller.MonitoringDataController.export()'
        WHEN 6 THEN 'com.water.webgis.controller.MonitoringDataController.getHistory()'
        ELSE 'com.water.webgis.controller.SystemController.config()'
    END,
    
    -- 模拟IP地址 (192.168.1.X)
    '192.168.1.' || floor(random() * 254 + 1)::text,
    
    -- 模拟时间: 近7天内的随机时间
    NOW() - (random() * interval '7 days')
FROM 
    generate_series(1, 100); -- 生成100条测试数据

-- 输出结果
DO $$
DECLARE
    v_count INT;
BEGIN
    SELECT count(*) INTO v_count FROM sys_log;
    RAISE NOTICE '已成功生成 % 条系统日志测试数据。', v_count;
END $$;
