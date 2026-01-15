package com.water.webgis.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.water.webgis.common.Result;
import com.water.webgis.entity.FacilityCategory;
import com.water.webgis.entity.WaterFacility;
import com.water.webgis.service.FacilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/facility")
public class FacilityController {

    @Autowired
    private FacilityService facilityService;

    @GetMapping("/category/list")
    public Result<List<FacilityCategory>> listCategories() {
        return Result.success(facilityService.getAllCategories());
    }

    @PostMapping("/category/save")
    public Result<String> saveCategory(@RequestBody FacilityCategory category) {
        return facilityService.saveCategory(category);
    }

    @DeleteMapping("/category/{id}")
    public Result<String> deleteCategory(@PathVariable Long id) {
        return facilityService.deleteCategory(id);
    }

    @GetMapping("/list")
    public Result<List<WaterFacility>> listFacilities() {
        return Result.success(facilityService.getAllFacilities());
    }

    /**
     * 分页查询设施
     */
    @GetMapping("/page")
    public Result<IPage<WaterFacility>> getPagedFacilities(
            @RequestParam(defaultValue = "1") int current,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword) {
        return facilityService.getPagedFacilities(current, size, categoryId, keyword);
    }

    @PostMapping("/save")
    @com.water.webgis.common.annotation.Log("新增/修改设施")
    public Result<String> saveFacility(@RequestBody WaterFacility facility) {
        return facilityService.saveFacility(facility);
    }

    @DeleteMapping("/{id}")
    public Result<String> deleteFacility(@PathVariable Long id) {
        return facilityService.deleteFacility(id);
    }
}
