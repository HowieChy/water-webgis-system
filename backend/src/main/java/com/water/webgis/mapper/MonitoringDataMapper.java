package com.water.webgis.mapper;

import com.water.webgis.entity.MonitoringData;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MonitoringDataMapper extends BaseMapper<MonitoringData> {

        /**
         * 分页查询监测数据（每个设施只返回最新一条）
         */
        @Select("<script>" +
                        "SELECT DISTINCT ON (md.facility_id) md.*, wf.name as facilityName, wf.code as facilityCode " +
                        "FROM monitoring_data md " +
                        "LEFT JOIN water_facility wf ON md.facility_id = wf.id " +
                        "<where>" +
                        "<if test='categoryId != null'> AND md.category_id = #{categoryId} </if>" +
                        "<if test='facilityId != null'> AND md.facility_id = #{facilityId} </if>" +
                        "</where>" +
                        "ORDER BY md.facility_id, md.collect_time DESC" +
                        "</script>")
        IPage<MonitoringData> selectPageWithCategory(Page<MonitoringData> page,
                        @Param("categoryId") Long categoryId,
                        @Param("facilityId") Long facilityId);
}
