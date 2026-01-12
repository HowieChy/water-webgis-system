-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Facility Category Table
CREATE TABLE IF NOT EXISTS facility_category (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    icon_url VARCHAR(255),
    sort_order INT DEFAULT 0
);

-- 2. Water Facility Table
CREATE TABLE IF NOT EXISTS water_facility (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE,
    geom GEOMETRY(Point, 4326), -- WGS84
    category_id BIGINT REFERENCES facility_category(id),
    address VARCHAR(255),
    attributes JSONB,
    status VARCHAR(20),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Monitoring Data Table
CREATE TABLE IF NOT EXISTS monitoring_data (
    id BIGSERIAL PRIMARY KEY,
    facility_id BIGINT REFERENCES water_facility(id),
    water_level DECIMAL(10,2),
    flow_rate DECIMAL(10,2),
    switch_status INT,
    collect_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. System User Table
CREATE TABLE IF NOT EXISTS sys_user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    real_name VARCHAR(50),
    role_type VARCHAR(20), -- ADMIN, USER
    contact VARCHAR(20),
    status INT DEFAULT 1 -- 1: Enabled, 0: Disabled
);

-- 5. System Log Table
CREATE TABLE IF NOT EXISTS sys_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    operation VARCHAR(50),
    method VARCHAR(255),
    ip_addr VARCHAR(50),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for spatial queries
CREATE INDEX IF NOT EXISTS idx_water_facility_geom ON water_facility USING GIST (geom);
