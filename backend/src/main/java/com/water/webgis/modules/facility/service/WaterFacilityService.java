package com.water.webgis.modules.facility.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.water.webgis.modules.facility.entity.WaterFacility;
import java.util.List;

public interface WaterFacilityService extends IService<WaterFacility> {
    List<WaterFacility> getListWithGeoJSON();
}
