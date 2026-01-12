package com.water.webgis.modules.facility.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.water.webgis.modules.facility.entity.WaterFacility;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import java.util.List;

@Mapper
public interface WaterFacilityMapper extends BaseMapper<WaterFacility> {
    // Custom query to return GeoJSON string
    // This is a naive implementation; for production, use proper TypeHandler
    @Select("SELECT id, name, code, ST_AsGeoJSON(geom) as geom, category_id, address, attributes, status, create_time FROM water_facility")
    List<WaterFacility> selectListWithGeoJSON();
}
