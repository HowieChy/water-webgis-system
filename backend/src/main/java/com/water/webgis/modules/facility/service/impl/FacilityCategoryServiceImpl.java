package com.water.webgis.modules.facility.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.water.webgis.modules.facility.entity.FacilityCategory;
import com.water.webgis.modules.facility.mapper.FacilityCategoryMapper;
import com.water.webgis.modules.facility.service.FacilityCategoryService;
import org.springframework.stereotype.Service;

@Service
public class FacilityCategoryServiceImpl extends ServiceImpl<FacilityCategoryMapper, FacilityCategory> implements FacilityCategoryService {
}
