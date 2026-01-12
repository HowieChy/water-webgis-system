package com.water.webgis.modules.facility.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.water.webgis.modules.facility.entity.WaterFacility;
import com.water.webgis.modules.facility.mapper.WaterFacilityMapper;
import com.water.webgis.modules.facility.service.WaterFacilityService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WaterFacilityServiceImpl extends ServiceImpl<WaterFacilityMapper, WaterFacility> implements WaterFacilityService {
    @Override
    public List<WaterFacility> getListWithGeoJSON() {
        return baseMapper.selectListWithGeoJSON();
    }
}
