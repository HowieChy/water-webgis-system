package com.water.webgis.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
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
        return categoryMapper
                .selectList(new com.baomidou.mybatisplus.core.conditions.query.QueryWrapper<FacilityCategory>()
                        .orderByAsc("sort_order"));
    }

    public Result<String> saveCategory(FacilityCategory category) {
        if (category.getId() == null) {
            categoryMapper.insert(category);
        } else {
            categoryMapper.updateById(category);
        }
        return Result.success("Saved category");
    }

    public Result<String> deleteCategory(Long id) {
        categoryMapper.deleteById(id);
        return Result.success("Deleted category");
    }

    // Water Facility Methods
    public List<WaterFacility> getAllFacilities() {
        return waterFacilityMapper.selectAllWithGeoJSON();
    }

    /**
     * 分页查询设施
     */
    public Result<IPage<WaterFacility>> getPagedFacilities(int current, int size, Long categoryId, String keyword) {
        Page<WaterFacility> page = new Page<>(current, size);
        QueryWrapper<WaterFacility> query = new QueryWrapper<>();

        if (categoryId != null) {
            query.eq("category_id", categoryId);
        }

        if (keyword != null && !keyword.trim().isEmpty()) {
            query.and(wrapper -> wrapper
                    .like("name", keyword)
                    .or()
                    .like("code", keyword));
        }

        query.orderByDesc("create_time");

        IPage<WaterFacility> result = waterFacilityMapper.selectPage(page, query);
        return Result.success(result);
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
