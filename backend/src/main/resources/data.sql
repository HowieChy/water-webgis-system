-- Initial Admin User (password: 123456)
-- BCrypt hash for 123456 is usually $2a$10$..
INSERT INTO sys_user (username, password, real_name, role_type, status) VALUES 
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOcd7.j/3r.6.', 'System Admin', 'ADMIN', 1)
ON CONFLICT (username) DO NOTHING;

-- Initial Facility Categories
INSERT INTO facility_category (name, icon_url, sort_order) VALUES 
('Pump Station', '/icons/pump.png', 1),
('Sluice Gate', '/icons/gate.png', 2),
('Pipe Network', '/icons/pipe.png', 3)
ON CONFLICT DO NOTHING;
