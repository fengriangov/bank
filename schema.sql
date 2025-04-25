-- mysql -u root -p fengri_bank < schema.sql
CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    account_number VARCHAR(255) UNIQUE NOT NULL,
    account_type VARCHAR(50) NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sending_account_id INT, -- Account sending
    amount DECIMAL(10, 2) NOT NULL,
    receiving_account_id INT, -- Account receiving
    description VARCHAR(255),
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sending_account_id) REFERENCES accounts(id),
    FOREIGN KEY (receiving_account_id) REFERENCES accounts(id)
);

CREATE INDEX idx_user_id ON accounts (user_id);
CREATE INDEX idx_account_id ON transactions (sending_account_id);
CREATE INDEX idx_receiving_account_id ON transactions (receiving_account_id);