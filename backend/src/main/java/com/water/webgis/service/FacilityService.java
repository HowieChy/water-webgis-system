package com.water.webgis.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.water.webgis.common.Result;
import com.water.webgis.entity.FacilityCategory;
import com.water.webgis.entity.WaterFacility;
import com.water.webgis.mapper.FacilityCategoryMapper;
import com.water.webgis.mapper.WaterFacilityMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
public class FacilityService {

    @Autowired
    private FacilityCategoryMapper categoryMapper;

    @Autowired
    private WaterFacilityMapper waterFacilityMapper;

    // Category Methods
    public List<FacilityCategory> getAllCategories() {
        return categoryMapper.selectList(null);
    }
    
    public Result<String> saveCategory(FacilityCategory category) {
        if (category.getId() == null) {
            categoryMapper.insert(category);
        } else {
            categoryMapper.updateById(category);
        }
        return Result.success("Saved category");
    }

    // Water Facility Methods
    public List<WaterFacility> getAllFacilities() {
        return waterFacilityMapper.selectAllWithGeoJSON();
    }
    
    @Transactional
    public Result<String> saveFacility(WaterFacility facility) {
        if (facility.getId() == null) {
            facility.setCreateTime(new Date());
            waterFacilityMapper.insertWithGeoJSON(facility);
        } else {
            // Update logic (simplified, might need custom update for geom)
            // For now, let's assume update involves primarily attributes or standard fields
            // If geom updates, we need similar ST_GeomFromGeoJSON handling
             waterFacilityMapper.updateById(facility);
        }
        return Result.success("Saved facility");
    }
    
    public Result<String> deleteFacility(Long id) {
        waterFacilityMapper.deleteById(id);
        return Result.success("Deleted");
    }
}
