-- mysql -u root -p fengri_bank < add_test_data.sql
USE fengri_bank;
INSERT INTO users (first_name, last_name, email, password, admin) VALUES 
('Jasper', 'Green', 'elvi.green11@gmail.com', '$2a$15$/vKJfUgRg7XlOMvF78oMx.9Hhk88cVrKumTlWKMOW95fxqJ.oBNay', TRUE),
('Jerry', 'Feng', 'noobisplayz321@gmail.com', '$2a$15$6mdvEKi2lLwGq/cxxvuOr./LIruu149fHCTXBipNZ8QFwlLX3Giem', FALSE)
ON DUPLICATE KEY UPDATE email = email;

INSERT INTO accounts (user_id, account_number, account_type, balance) VALUES
('1', '911137', 'Personal', '100'),
('1', '714167', 'Business', '1000'),
('2', '652762', 'Personal', '0')
ON DUPLICATE KEY UPDATE account_number = account_number;