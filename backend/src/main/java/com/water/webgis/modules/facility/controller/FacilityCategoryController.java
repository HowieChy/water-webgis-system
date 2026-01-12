package com.water.webgis.modules.facility.controller;

import com.water.webgis.common.Result;
import com.water.webgis.modules.facility.entity.FacilityCategory;
import com.water.webgis.modules.facility.service.FacilityCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/facility/category")
@RequiredArgsConstructor
@CrossOrigin
public class FacilityCategoryController {

    private final FacilityCategoryService facilityCategoryService;

    @GetMapping("/list")
    public Result<List<FacilityCategory>> list() {
        return Result.success(facilityCategoryService.list());
    }
}
