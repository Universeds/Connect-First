-- Connect First Database Setup Script
-- Run this after connecting to MariaDB as root

-- Create database
CREATE DATABASE IF NOT EXISTS connect_first;

-- Create user (you can change the password if needed)
CREATE USER IF NOT EXISTS 'cfuser'@'localhost' IDENTIFIED BY 'password';

-- Grant privileges
GRANT ALL PRIVILEGES ON connect_first.* TO 'cfuser'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE connect_first;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    username VARCHAR(255) PRIMARY KEY,
    role ENUM('helper', 'manager') NOT NULL,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS needs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cost DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    category ENUM('Food', 'Clothing', 'Toiletries', 'Medical', 'Education', 'Other') DEFAULT 'Other',
    priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
    is_time_sensitive BOOLEAN DEFAULT FALSE,
    frequency_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS baskets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    need_id INT NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (need_id) REFERENCES needs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_need (username, need_id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    need_id INT NOT NULL,
    quantity INT NOT NULL,
    total_cost DECIMAL(10,2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample admin user
INSERT INTO users (username, role) VALUES ('admin', 'manager')
ON DUPLICATE KEY UPDATE role='manager';

-- Insert sample needs for testing
INSERT INTO needs (name, description, cost, quantity, category, priority, is_time_sensitive) VALUES
('Canned Food Boxes', 'Non-perishable food items for families in need', 25.00, 50, 'Food', 'High', TRUE),
('Winter Coats', 'Warm winter coats for children and adults', 45.00, 30, 'Clothing', 'High', TRUE),
('Hygiene Kits', 'Basic hygiene supplies including soap, toothpaste, shampoo', 15.00, 100, 'Toiletries', 'Medium', FALSE),
('First Aid Supplies', 'Medical supplies and first aid kits', 35.00, 25, 'Medical', 'High', FALSE),
('School Supply Bundles', 'Notebooks, pencils, and basic school supplies', 20.00, 60, 'Education', 'Medium', TRUE),
('Blankets', 'Warm blankets for shelters', 30.00, 40, 'Other', 'Medium', FALSE)
ON DUPLICATE KEY UPDATE name=name;

-- Verify setup
SELECT 'Database setup complete!' AS Status;
SELECT COUNT(*) AS 'Users Created' FROM users;
SELECT COUNT(*) AS 'Sample Needs Created' FROM needs;
