-- Users table
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role ENUM('helper', 'manager') NOT NULL,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Needs table
CREATE TABLE IF NOT EXISTS needs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cost DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    category ENUM('Food', 'Clothing', 'Toiletries', 'Medical', 'Education', 'Other') DEFAULT 'Other',
    priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
    is_time_sensitive BOOLEAN DEFAULT FALSE,
    deadline DATETIME NULL DEFAULT NULL,
    frequency_count INT DEFAULT 0,
    address VARCHAR(500) DEFAULT '',
    latitude DECIMAL(10, 8) DEFAULT NULL,
    longitude DECIMAL(11, 8) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Baskets table
CREATE TABLE IF NOT EXISTS baskets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    need_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (need_id) REFERENCES needs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_need (username, need_id)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    need_id INT NOT NULL,
    quantity INT NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: Users are seeded via backend/seedUsers.js script
-- Run: npm run seed (in backend directory) to create default users

-- Insert sample needs for testing
INSERT INTO needs (name, description, cost, quantity, category, priority, is_time_sensitive) VALUES
('Canned Food Boxes', 'Non-perishable food items for families in need', 25.00, 50, 'Food', 'High', TRUE),
('Winter Coats', 'Warm winter coats for children and adults', 45.00, 30, 'Clothing', 'High', TRUE),
('Hygiene Kits', 'Basic hygiene supplies including soap, toothpaste, shampoo', 15.00, 100, 'Toiletries', 'Medium', FALSE),
('First Aid Supplies', 'Medical supplies and first aid kits', 35.00, 25, 'Medical', 'High', FALSE),
('School Supply Bundles', 'Notebooks, pencils, and basic school supplies', 20.00, 60, 'Education', 'Medium', TRUE),
('Blankets', 'Warm blankets for shelters', 30.00, 40, 'Other', 'Medium', FALSE)
ON DUPLICATE KEY UPDATE name=name;
