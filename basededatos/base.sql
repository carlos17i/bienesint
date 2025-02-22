-- Tabla de Usuarios (Responsables)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,     
    username VARCHAR(50) UNIQUE NOT NULL,       
    password_hash VARCHAR(255) NOT NULL,        
    email VARCHAR(100) UNIQUE NOT NULL,         
    full_name VARCHAR(100) NOT NULL,            
    role ENUM('Administrador', 'Usuario', 'Responsable') NOT NULL, 
    is_active BOOLEAN DEFAULT true,             
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 
);

-- Tabla de Categorías de Bienes
CREATE TABLE asset_categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,   
    name VARCHAR(100) NOT NULL,                   
    description TEXT,                             
    parent_category_id INT,                       
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    FOREIGN KEY (parent_category_id) REFERENCES asset_categories(category_id)
);

-- Tabla de Áreas (Ubicaciones)
CREATE TABLE areas (
    area_id INT AUTO_INCREMENT PRIMARY KEY,  
    name VARCHAR(100) NOT NULL,              
    description TEXT,                        
    parent_area_id INT,                      
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    FOREIGN KEY (parent_area_id) REFERENCES areas(area_id)
);

-- Tabla de Bienes (Inventario)
CREATE TABLE assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,   
    name VARCHAR(100) NOT NULL,                
    description TEXT,                          
    category_id INT NOT NULL,                  
    institutional_code VARCHAR(50) UNIQUE,    
    senescyt_code VARCHAR(50) UNIQUE,         
    qr_code VARCHAR(255) UNIQUE,              
    barcode VARCHAR(50) UNIQUE,               
    model VARCHAR(100),                       
    status ENUM('Activo', 'Inactivo', 'En Reparación', 'Dado de Baja') NOT NULL DEFAULT 'Activo', 
    purchase_date DATE,                       
    purchase_value DECIMAL(10,2),             
    current_value DECIMAL(10,2),              
    area_id INT NOT NULL,                     
    notes TEXT,                               
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
    FOREIGN KEY (category_id) REFERENCES asset_categories(category_id),
    FOREIGN KEY (area_id) REFERENCES areas(area_id)
);

-- Tabla de Asignaciones de Bienes a Usuarios
CREATE TABLE asset_assignments (
    assignment_id INT AUTO_INCREMENT PRIMARY KEY, 
    asset_id INT NOT NULL,                        
    user_id INT NOT NULL,                         
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    return_date TIMESTAMP,                        
    notes TEXT,                                   
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
