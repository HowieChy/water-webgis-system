package com.water.webgis.config;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.water.webgis.entity.FacilityCategory;
import com.water.webgis.entity.SysUser;
import com.water.webgis.mapper.FacilityCategoryMapper;
import com.water.webgis.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

/**
 * Initialize data on startup
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AuthService authService;

    @Autowired
    private FacilityCategoryMapper categoryMapper;

    @Override
    public void run(String... args) throws Exception {
        // Initialize Admin User if not exists
        if (authService.getOne(new QueryWrapper<SysUser>().eq("username", "admin")) == null) {
            SysUser admin = new SysUser();
            admin.setUsername("admin");
            admin.setPassword("123456"); // Will be encoded by register method
            admin.setRealName("Administrator");
            admin.setRoleType("ADMIN");
            admin.setStatus(1);
            authService.register(admin);
            System.out.println("Initialized admin user: admin / 123456");
        }

        // Initialize Default Categories
        initCategories();

        // Initialize Default Facilities
        initFacilities();
    }

    private void initCategories() {
        List<FacilityCategory> defaults = Arrays.asList(
                createCategory("Rainwater Manhole", "雨水井", "map-ysj.png", 1),
                createCategory("Sewage Manhole", "污水井", "map-wsj.png", 2),
                createCategory("Combined Manhole", "合流井", "map-hlj.png", 3),
                createCategory("Pump Station", "泵站", "map-bz.png", 4),
                createCategory("Sluice Gate", "水闸", "map-sz.png", 5),
                createCategory("Rain Grating", "雨水口", "map-ysk.png", 6),
                createCategory("Discharge Outlet", "排放口", "map-pfk.png", 7),
                createCategory("Sewage Treatment Plant", "污水处理厂", "map-wsclc.png", 8),
                createCategory("Low-lying Area", "低洼地区", "map-dwdq.png", 9));

        for (FacilityCategory cat : defaults) {
            if (categoryMapper.selectCount(new QueryWrapper<FacilityCategory>().eq("name", cat.getName())) == 0) {
                categoryMapper.insert(cat);
                System.out.println("Initialized category: " + cat.getName());
            } else {
                // Optional: Update alias/icon if exists?
                // For now, let's just ensure they exist. User might have modified them.
                // Actually, user said "Default these categories exist", implying we should
                // ensure they are there.
                // If name matches but alias/icon missing, maybe update?
                // Let's stick to insert if missing for minimal interference.
            }
        }
    }

    private FacilityCategory createCategory(String name, String alias, String icon, int sort) {
        FacilityCategory c = new FacilityCategory();
        c.setName(name);
        c.setAlias(alias);
        c.setIcon(icon);
        c.setSortOrder(sort);
        return c;
    }

    @Autowired
    private com.water.webgis.mapper.WaterFacilityMapper waterFacilityMapper;

    private void initFacilities() {
        java.util.List<FacilityCategory> categories = categoryMapper.selectList(null);
        if (categories == null || categories.isEmpty()) {
            return;
        }

        // Map Category Name to Prefix
        java.util.Map<String, String> prefixMap = new java.util.HashMap<>();
        prefixMap.put("Rainwater Manhole", "YSJ");
        prefixMap.put("Sewage Manhole", "WSJ");
        prefixMap.put("Combined Manhole", "HLJ");
        prefixMap.put("Pump Station", "BZ");
        prefixMap.put("Sluice Gate", "SZ");
        prefixMap.put("Rain Grating", "YSK");
        prefixMap.put("Discharge Outlet", "PFK");
        prefixMap.put("Sewage Treatment Plant", "WSCLC");
        prefixMap.put("Low-lying Area", "DWDQ");

        String[][] rawData = {
                { "WSGD04462", "121.65741324931902,29.941218670262998" },
                { "WSGD04484", "121.66139822247699,29.936872069727002" },
                { "WSGD04495", "121.663297126827,29.934856323654" },
                { "WSGD04511", "121.65927768206299,29.939214423768348" },
                { "WSGD04546", "121.67200212813923,29.947725482624246" },
                { "WSGD04576", "121.70704554514545,29.95271848817403" },
                { "WSGD04690", "121.5991511838077,29.956424219682287" },
                { "WSGD04717", "121.60864343325635,29.956425968774823" },
                { "WSGD04742", "121.59105922753518,29.970367099630206" },
                { "WSGD04820", "121.64357428534285,29.96666124010526" },
                { "WSGD04901", "121.64926141357945,29.962307143539306" },
                { "WSGD04944", "121.68475486337063,29.95266895286725" },
                { "WSGD05069", "121.70875397807761,29.960215802954785" },
                { "WSGD05129", "121.69381052021899,29.95635357124" },
                { "WSGD05208", "121.69972036467975,29.96365694731183" },
                { "WSGD05218", "121.7009967944631,29.95850093155299" },
                { "WSGD05387", "121.60209080352627,29.95641553892553" },
                { "WSGD05424", "121.71789335530549,29.974966124902366" },
                { "WSGD05437", "121.70291839187124,29.977055305241862" },
                { "WSGD05466", "121.69756315461312,29.977009858543344" },
                { "WSGD05467", "121.56156830474028,29.96764375626958" },
                { "WSGD05502", "121.66600158626696,29.94287552935066" },
                { "WSGD05549", "121.6541985482,29.928909673461" },
                { "WSGD05600", "121.65739516896059,29.930405751638226" },
                { "WSGD05766", "121.59628885489195,29.960273954915493" },
                { "WSGD05767", "121.59668225796038,29.960285467870094" },
                { "WSGD05784", "121.59262929169542,29.960180945409387" },
                { "WSGD05791", "121.5865702984623,29.95981572317641" },
                { "WSGD05907", "121.58728472732794,29.96232328122264" },
                { "WSGD05967", "121.58008489931198,29.96612556943351" },
                { "WSGD06358", "121.661915112505,29.933056111558997" },
                { "WSGD06364", "121.661805325927,29.932925615756" },
                { "WSGD06572", "121.71350191456902,29.972726721662003" },
                { "WSGD06579", "121.71367227103953,29.971174846932747" },
                { "WSGD06580", "121.71369009503469,29.971002743482245" },
                { "WSGD06594", "121.71425408506201,29.967929523900995" },
                { "WSGD06648", "121.55401614457134,30.021783502561878" },
                { "WSGD06727", "121.55287268889799,30.021476149271" },
                { "WSGD06733", "121.554912690875,30.019196862490006" },
                { "WSGD06844", "121.61623910385802,29.927380098723" },
                { "WSGD06890", "121.60716332693934,29.939974196689388" },
                { "WSGD06906", "121.61120233037715,29.93976415082632" },
                { "WSGD06960", "121.62693686339996,29.93710615625769" },
                { "WSGD06979", "121.631709043468,29.935156421878997" },
                { "WSGD06981", "121.632228724175,29.93493755892" },
                { "WSGD06999", "121.63468268348167,29.930497829388788" },
                { "WSGD07017", "121.636293253473,29.926800006904" },
                { "WSGD07168", "121.62236700067457,29.92205734628742" },
                { "WSGD07263", "121.63685397318945,29.923008116538668" },
                { "WSGD07629", "121.61166790350599,29.929613831043003" },
                { "WSGD07651", "121.615948814637,29.934276182260003" },
                { "WSGD07679", "121.61992487362984,29.939481370856917" },
                { "WSGD07698", "121.61039919287201,29.933609005100998" },
                { "WSGD07711", "121.60771581591526,29.935174018934745" },
                { "WSGD07722", "121.60452094718553,29.937021667331447" },
                { "WSGD07827", "121.629072838243,29.926442577130995" },
                { "WSGD07961", "121.58678234810435,29.969370819419098" },
                { "WSGD08059", "121.62416372535334,30.006544260022036" },
                { "WSGD08065", "121.59695667125584,30.017662527530337" },
                { "WSGD08079", "121.59324107833459,30.01765089021941" },
                { "WSGD08088", "121.59846704382184,29.977622677021817" },
                { "WSGD08090", "121.59789143668647,29.956437090119238" },
                { "WSGD08091", "121.58018626134702,29.969400698082016" },
                { "WSGD08104", "121.69001910519079,29.9561697934009" },
                { "WSGD08105", "121.68817878642677,29.965364441972447" },
                { "WSGD08109", "121.65946827136811,29.939024309164477" },
                { "WSGD08116", "121.70654260475094,29.958180961080718" },
                { "WSGD08117", "121.71059009836718,29.958707389367614" },
                { "WSGD08121", "121.70313072424587,29.957421209555022" },
                { "WSGD08127", "121.64835393281484,29.97329669588006" },
                { "WSGD08130", "121.64902232748716,29.986044618163984" },
                { "WSGD08131", "121.6409414981707,29.99312721408642" },
                { "WSGD08139", "121.650659329523,29.96322499115838" },
                { "WSGD08140", "121.65176604297095,29.96416517289228" },
                { "WSGD08161", "121.71969488944083,29.955631969202113" },
                { "WSGD08165", "121.7135529843648,29.959675722024933" },
                { "WSGD08166", "121.71779158844191,29.95977490338232" },
                { "WSGD08179", "121.63929571417593,29.9156467124431" },
                { "WSGD08187", "121.61497901602898,29.925322995088994" },
                { "WSGD08198", "121.68858009407482,29.96591607710779" },
                { "WSGD08199", "121.69675997455674,29.956323066361904" },
                { "WSGD08204", "121.60407010144526,30.032712863390476" },
                { "WSGD08206", "121.60471982556373,30.029938376366033" },
                { "WSGD08211", "121.60534824957224,30.027174118122314" },
                { "WSGD08328", "121.50704215754133,30.005617863233915" },
                { "WSGD08366", "121.62717631108198,29.947316126724957" },
                { "WSGD08368", "121.62558064420669,29.949840982980835" },
                { "WSGD08369", "121.62221826258946,29.951726964737805" },
                { "WSGD08371", "121.62068471176687,29.950450593245716" },
                { "WSGD08378", "121.60189847259987,30.041252580655097" },
                { "WSGD08384", "121.64475346262228,29.960499763140856" },
                { "WSGD08394", "121.5419014845082,30.008333849594838" },
                { "WSGD08399", "121.5359859901319,29.99295283363158" },
                { "WSGD08405", "121.54196555200751,29.99077986173191" },
                { "WSGD08419", "121.6729189708947,29.942155965972024" },
                { "WSGD08496", "121.70381286439857,29.979665480470473" },
                { "WSGD08572", "121.59671822591523,30.02085758052608" },
                { "WSGD08642", "121.61806281200639,29.9438009880182" },
                { "WSGD08645", "121.53295071482505,29.995389928549013" },
                { "WSGD08657", "121.59456099539656,30.01771229134321" }
        };

        int catIdx = 0;
        int count = 0;
        for (String[] row : rawData) {
            String originId = row[0];
            String coords = row[1];

            // Extract suffix (e.g. 04462 from WSGD04462)
            String suffix = originId.length() > 4 ? originId.substring(4) : originId;

            // Assign category round-robin
            FacilityCategory cat = categories.get(catIdx % categories.size());
            String prefix = prefixMap.getOrDefault(cat.getName(), "FAC");

            String newCode = prefix + suffix;
            String newName = cat.getAlias() + "-" + suffix;

            // Check existence by Code
            if (waterFacilityMapper
                    .selectCount(new QueryWrapper<com.water.webgis.entity.WaterFacility>().eq("code", newCode)) > 0) {
                catIdx++; // Move to next category for next item to keep distribution even if skipped? No,
                          // just skip.
                continue;
            }

            com.water.webgis.entity.WaterFacility f = new com.water.webgis.entity.WaterFacility();
            f.setName(newName);
            f.setCode(newCode);
            f.setCategoryId(cat.getId());

            catIdx++;

            // Create GeoJSON
            String[] parts = coords.split(",");
            if (parts.length == 2) {
                String geoJson = String.format("{\"type\":\"Point\",\"coordinates\":[%s,%s]}", parts[0].trim(),
                        parts[1].trim());
                f.setGeomJson(geoJson);
                f.setStatus("Normal");
                f.setCreateTime(new java.util.Date());

                try {
                    waterFacilityMapper.insertWithGeoJSON(f);
                    count++;
                } catch (Exception e) {
                    System.err.println("Failed to insert facility " + newCode + ": " + e.getMessage());
                }
            }
        }

        if (count > 0) {
            System.out.println("Initialized " + count + " default facilities.");
        }
    }
}
