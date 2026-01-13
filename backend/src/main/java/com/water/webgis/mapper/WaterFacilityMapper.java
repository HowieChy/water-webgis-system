package com.water.webgis.mapper;

import com.water.webgis.entity.WaterFacility;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface WaterFacilityMapper extends BaseMapper<WaterFacility> {
    
    // Custom select to get Geometry as GeoJSON
    @Select("SELECT id, name, code, category_id, address, attributes, status, create_time, ST_AsGeoJSON(geom) as geomJson FROM water_facility")
    List<WaterFacility> selectAllWithGeoJSON();
    
    // Insert with Geometry from GeoJSON
    @Insert("INSERT INTO water_facility (name, code, geom, category_id, address, attributes, status, create_time) VALUES (#{name}, #{code}, ST_GeomFromGeoJSON(#{geomJson}), #{categoryId}, #{address}, #{attributes, typeHandler=com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler}, #{status}, #{createTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insertWithGeoJSON(WaterFacility facility);
}
