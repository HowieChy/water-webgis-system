-- =========================================================================================
-- 脚本说明: 模拟生成近15天的历史监测数据
-- 数据库类型: PostgreSQL (使用 generate_series 生成时间序列)
-- 功能: 
-- 1. 清空现有监测数据 (可选, 默认开启)
-- 2. 为所有设施生成每小时一条的监测数据
-- 3. 模拟真实波动: 包含随机扰动和日变化规律(正弦波)
-- =========================================================================================

-- 1. 清空现有数据 (如果不希望清空，请注释掉下面这行)
TRUNCATE TABLE monitoring_data RESTART IDENTITY;

-- 2. 插入模拟数据
INSERT INTO monitoring_data (
    facility_id, 
    category_id, 
    water_level, 
    flow_rate, 
    switch_status, 
    remark, 
    collect_time, 
    create_time
)
SELECT 
    f.id,
    f.category_id,
    -- 水位模拟: 基准值 3.0 +/- 0.5 随机波动 + 0.3 日周期波动 (正弦函数)
    ROUND(
        (
            3.0 +                                                    -- 基准水位
            (random() * 1.0 - 0.5) +                                 -- 随机波动 (-0.5 ~ 0.5)
            sin(EXTRACT(EPOCH FROM t.series_time) / 3600 / 24 * 2 * PI()) * 0.3 -- 日周期波动
        )::numeric, 
        2
    ),
    -- 流量模拟: 基准值 1.5 + 随机增量 (保证非负)
    ROUND(
        ABS(
            1.5 + 
            (random() * 2.0 - 1.0) + 
            sin(EXTRACT(EPOCH FROM t.series_time) / 3600 / 24 * 2 * PI() - 1) * 0.8
        )::numeric, 
        2
    ),
    -- 状态模拟: 90% 概率开启(1), 10% 关闭(0)
    CASE WHEN random() > 0.1 THEN 1 ELSE 0 END,
    -- 备注模拟: 随机状态文本
    (ARRAY['设备正常', '设备正常', '设备正常', '数据波动', '定期巡检'])[floor(random() * 5 + 1)],
    -- 采集时间: 15天前到现在
    t.series_time,
    -- 创建时间: 当前时间
    NOW()
FROM 
    water_facility f
CROSS JOIN 
    generate_series(
        NOW() - interval '15 days', -- 开始时间: 15天前
        NOW(),                      -- 结束时间: 现在
        interval '1 hour'           -- 频率: 每1小时一条
    ) as t(series_time);

-- 3. 输出执行结果摘要
DO $$
DECLARE
    v_count INT;
BEGIN
    SELECT count(*) INTO v_count FROM monitoring_data;
    RAISE NOTICE '已成功生成 % 条监测数据，覆盖 % 个设施，跨度15天。', v_count, (SELECT count(*) FROM water_facility);
END $$;
